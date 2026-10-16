import "server-only";
import axios, { AxiosInstance } from "axios";

let cachedClient: AxiosInstance | null = null;

function getSonarBaseUrl(): string {
  const url = process.env.SONAR_URL;
  if (!url) throw new Error("SONAR_URL não configurada");
  return url.replace(/\/$/, "");
}

function getSonarToken(): string {
  const token = process.env.SONAR_TOKEN;
  if (!token) throw new Error("SONAR_TOKEN não configurada");
  return token;
}

export function sonarClient(): AxiosInstance {
  if (cachedClient) return cachedClient;
  cachedClient = axios.create({
    baseURL: getSonarBaseUrl(),
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${getSonarToken()}`,
      Accept: "application/json",
    },
  });
  return cachedClient;
}

export function resetSonarClientCache(): void {
  cachedClient = null;
}

export type SonarProjectStatusResponse = {
  projectStatus: {
    status: "OK" | "ERROR" | "WARN" | "NONE";
    conditions: Array<{
      status: "OK" | "ERROR" | "WARN" | "NO_VALUE";
      metricKey: string;
      comparator: string;
      errorThreshold?: string;
      actualValue?: string;
    }>;
    period?: { mode?: string; date?: string };
    periods?: Array<{ mode?: string; date?: string }>;
  };
};

export type SonarMeasuresResponse = {
  component: {
    key: string;
    name: string;
    branch?: string;
    measures: Array<{
      metric: string;
      value?: string;
    }>;
  };
};

export class SonarBranchNotFoundError extends Error {
  constructor(public readonly branch: string, public readonly projectKey: string) {
    super(`Branch '${branch}' não encontrada no projeto '${projectKey}'`);
    this.name = "SonarBranchNotFoundError";
  }
}

function isAxios404(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export type SonarComponentSummary = {
  key: string;
  name: string;
  qualifier: string;
  project?: string;
};

export type SonarComponentsSearchResponse = {
  paging: { pageIndex: number; pageSize: number; total: number };
  components: SonarComponentSummary[];
};

export async function fetchProjectStatus(
  projectKey: string,
  branch?: string,
): Promise<SonarProjectStatusResponse> {
  const params: Record<string, string> = { projectKey };
  if (branch) params.branch = branch;
  try {
    const { data } = await sonarClient().get<SonarProjectStatusResponse>(
      "/api/qualitygates/project_status",
      { params },
    );
    return data;
  } catch (e) {
    if (branch && isAxios404(e)) throw new SonarBranchNotFoundError(branch, projectKey);
    throw e;
  }
}

export async function fetchMeasures(
  projectKey: string,
  metricKeys: string[],
  branch?: string,
): Promise<SonarMeasuresResponse> {
  const params: Record<string, string> = {
    component: projectKey,
    metricKeys: metricKeys.join(","),
  };
  if (branch) params.branch = branch;
  try {
    const { data } = await sonarClient().get<SonarMeasuresResponse>(
      "/api/measures/component",
      { params },
    );
    return data;
  } catch (e) {
    if (branch && isAxios404(e)) throw new SonarBranchNotFoundError(branch, projectKey);
    throw e;
  }
}

export async function searchComponents(
  query: string,
  pageSize = 20,
): Promise<SonarComponentsSearchResponse> {
  const { data } = await sonarClient().get<SonarComponentsSearchResponse>(
    "/api/components/search",
    { params: { qualifiers: "TRK", q: query, ps: pageSize } },
  );
  return data;
}
