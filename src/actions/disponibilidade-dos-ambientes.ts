import "server-only";
import { zabbixRpc } from "@/lib/zabbix.server";

export type ProducaoStatus = {
  available: boolean;
  incidents_recent: boolean;
  message: string;
  /** Data e hora do último incidente (dd/mm/aaaa HH:mm) quando houver ativo ou recente */
  lastIncidentAt?: string;
};

const DEFAULT_HOST = process.env.ZABBIX_DEFAULT_HOST ?? "Zabbix server";
const RECENT_WINDOW_MS = Number(
  process.env.ZABBIX_RECENT_WINDOW_MS ?? 24 * 60 * 60 * 1000
);

type Trigger = { lastchange: string; value: string };

function formatDDMMYYYY_HHMM_FromSeconds(seconds?: number): string | undefined {
  if (!seconds || !isFinite(seconds)) return undefined;
  const d = new Date(seconds * 1000);
  if (isNaN(d.getTime())) return undefined;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

export async function getDisponibilidadeDosAmbientesProducao(
  projectName: string,
  host = DEFAULT_HOST
): Promise<ProducaoStatus> {
  const params = {
    filter: { host: [host], description: [projectName] },
    output: "extend" as const, // igual ao Postman
  };

  const triggers = await zabbixRpc<Trigger[]>("trigger.get", params, 2);

  // Sem triggers
  if (!triggers?.length) {
    return {
      available: true,
      incidents_recent: false,
      message: "Sem incidentes recentes",
    };
  }

  const now = Date.now();

  // Incidentes ativos
  const active = triggers.filter((t) => t.value === "1");
  if (active.length > 0) {
    const lastActiveSec = Math.max(...active.map((t) => Number(t.lastchange) || 0));
    return {
      available: false,
      incidents_recent: true,
      message: "Há incidentes ativos",
      lastIncidentAt: formatDDMMYYYY_HHMM_FromSeconds(lastActiveSec),
    };
  }

  // Houve incidentes recentes (janela configurável)
  const recent = triggers.filter(
    (t) => now - Number(t.lastchange) * 1000 <= RECENT_WINDOW_MS
  );
  const hasRecent = recent.length > 0;
  const lastRecentSec = hasRecent
    ? Math.max(...recent.map((t) => Number(t.lastchange) || 0))
    : undefined;

  return {
    available: true,
    incidents_recent: hasRecent,
    message: hasRecent ? "Houve incidentes recentes" : "Sem incidentes recentes",
    lastIncidentAt: hasRecent ? formatDDMMYYYY_HHMM_FromSeconds(lastRecentSec) : undefined,
  };
}
