import "server-only";
import { importPKCS8, SignJWT } from "jose";

// Sistema do dashboard -> prefixo das variáveis GA_<PREFIXO>_PROPERTY_ID e
// GA_<PREFIXO>_CREDENTIALS_BASE64 (JSON da service account em base64).
const PREFIXO_ENV_POR_SISTEMA: Record<string, string> = {
  SGP: "SGP",
  SigPAE: "SIGPAE",
  SigEscola: "SIGESCOLA",
  Intranet: "INTRANET",
};

const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const DATA_API_URL = "https://analyticsdata.googleapis.com/v1beta";
const TIMEOUT_MS = 15000;

type ServiceAccount = {
  client_email: string;
  private_key: string;
  token_uri: string;
};

type Config = { propertyId: string; credentials: ServiceAccount };

export type GaRow = { dimensions: string[]; metrics: number[] };

type GaApiRow = {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
};

export class AnalyticsNaoConfiguradoError extends Error {}

function getConfig(systemName: string): Config {
  const prefixo = PREFIXO_ENV_POR_SISTEMA[systemName];
  if (!prefixo) {
    throw new AnalyticsNaoConfiguradoError(
      `Sistema sem integração com o Google Analytics: ${systemName}`,
    );
  }
  const propertyId = process.env[`GA_${prefixo}_PROPERTY_ID`];
  const credentialsBase64 = process.env[`GA_${prefixo}_CREDENTIALS_BASE64`];
  if (!propertyId || !credentialsBase64) {
    throw new AnalyticsNaoConfiguradoError(
      `GA_${prefixo}_PROPERTY_ID ou GA_${prefixo}_CREDENTIALS_BASE64 não configurada`,
    );
  }
  const credentials = JSON.parse(
    Buffer.from(credentialsBase64, "base64").toString("utf8"),
  ) as ServiceAccount;
  return { propertyId, credentials };
}

const tokens = new Map<string, { token: string; expiraEm: number }>();

async function getAccessToken(credentials: ServiceAccount): Promise<string> {
  const emCache = tokens.get(credentials.client_email);
  if (emCache && emCache.expiraEm > Date.now()) return emCache.token;

  const key = await importPKCS8(credentials.private_key, "RS256");
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(credentials.client_email)
    .setAudience(credentials.token_uri)
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);

  const res = await fetch(credentials.token_uri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Falha ao autenticar no Google (${res.status})`);

  const { access_token, expires_in } = (await res.json()) as {
    access_token: string;
    expires_in: number;
  };
  tokens.set(credentials.client_email, {
    token: access_token,
    expiraEm: Date.now() + (expires_in - 60) * 1000,
  });
  return access_token;
}

const cache = new Map<string, { expiraEm: number; valor: Promise<GaRow[]> }>();

const TTL_REALTIME_MS = 60 * 1000;
const TTL_RELATORIO_MS = 5 * 60 * 1000;

async function consultar(
  systemName: string,
  metodo: "runReport" | "runRealtimeReport",
  body: Record<string, unknown>,
): Promise<GaRow[]> {
  const { propertyId, credentials } = getConfig(systemName);
  const token = await getAccessToken(credentials);
  const res = await fetch(`${DATA_API_URL}/properties/${propertyId}:${metodo}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`Google Analytics respondeu ${res.status} para ${systemName}`);
  }
  const data = (await res.json()) as { rows?: GaApiRow[] };
  return (data.rows ?? []).map((row) => ({
    dimensions: (row.dimensionValues ?? []).map((d) => d.value ?? ""),
    metrics: (row.metricValues ?? []).map((m) => Number(m.value ?? 0)),
  }));
}

// A cota da Data API é por property (200 mil tokens/dia): o cache em memória
// evita que cada usuário com o dashboard aberto gere uma chamada ao Google.
function comCache(
  systemName: string,
  metodo: "runReport" | "runRealtimeReport",
  body: Record<string, unknown>,
): Promise<GaRow[]> {
  const chave = `${systemName}:${metodo}:${JSON.stringify(body)}`;
  const emCache = cache.get(chave);
  if (emCache && emCache.expiraEm > Date.now()) return emCache.valor;

  const valor = consultar(systemName, metodo, body);
  const ttl = metodo === "runRealtimeReport" ? TTL_REALTIME_MS : TTL_RELATORIO_MS;
  cache.set(chave, { expiraEm: Date.now() + ttl, valor });
  valor.catch(() => cache.delete(chave));
  return valor;
}

export function runReport(systemName: string, body: Record<string, unknown>) {
  return comCache(systemName, "runReport", body);
}

export function runRealtimeReport(systemName: string, body: Record<string, unknown>) {
  return comCache(systemName, "runRealtimeReport", body);
}

export function resetGoogleAnalyticsCache(): void {
  tokens.clear();
  cache.clear();
}
