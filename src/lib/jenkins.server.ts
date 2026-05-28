import "server-only";
import axios, { AxiosInstance } from "axios";

let cachedClient: AxiosInstance | null = null;

// TEMPORÁRIO: defaults hardcoded para teste em homolog. Reverter na PR de retorno.
const DEFAULT_JENKINS_URL = "https://jenkins2.sme.prefeitura.sp.gov.br";
const DEFAULT_JENKINS_USERNAME = "luis_dourado";
const DEFAULT_JENKINS_API_TOKEN = "11bc982264a24499ca2eea10e804685047";
const DEFAULT_JENKINS_TIMEOUT_MS = 10000;

function getJenkinsBaseUrl(): string {
  const url = process.env.JENKINS_URL ?? DEFAULT_JENKINS_URL;
  return url.replace(/\/$/, "");
}

function getJenkinsUsername(): string {
  return process.env.JENKINS_USERNAME ?? DEFAULT_JENKINS_USERNAME;
}

function getJenkinsApiToken(): string {
  return process.env.JENKINS_API_TOKEN ?? DEFAULT_JENKINS_API_TOKEN;
}

function getTimeout(): number {
  const raw = process.env.JENKINS_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : DEFAULT_JENKINS_TIMEOUT_MS;
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_JENKINS_TIMEOUT_MS;
}

export function jenkinsClient(): AxiosInstance {
  if (cachedClient) return cachedClient;

  const credentials = Buffer.from(`${getJenkinsUsername()}:${getJenkinsApiToken()}`).toString(
    "base64",
  );

  cachedClient = axios.create({
    baseURL: getJenkinsBaseUrl(),
    timeout: getTimeout(),
    headers: {
      Authorization: `Basic ${credentials}`,
      Accept: "application/json",
    },
  });

  return cachedClient;
}

export function resetJenkinsClientCache(): void {
  cachedClient = null;
}

export function jenkinsFullNameToJobPath(fullName: string): string {
  const parts = fullName
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .map(encodeURIComponent);

  if (parts.length === 0) throw new Error("Nome do job Jenkins inválido");
  return `/job/${parts.join("/job/")}`;
}

export type JenkinsJobApiBuild = {
  number?: number;
  result?: string | null;
  duration?: number;
  timestamp?: number;
  building?: boolean;
};

export type JenkinsJobApiResponse = {
  name?: string;
  url?: string;
  color?: string;
  healthReport?: Array<{
    score?: number;
    description?: string;
  }>;
  builds?: JenkinsJobApiBuild[];
  lastBuild?: JenkinsJobApiBuild | null;
  lastSuccessfulBuild?: JenkinsJobApiBuild | null;
  lastFailedBuild?: JenkinsJobApiBuild | null;
};

const JOB_TREE = [
  "name",
  "url",
  "color",
  "healthReport[score,description]",
  "builds[number,result,duration,timestamp,building]{0,20}",
  "lastBuild[number,result,duration,timestamp,building]",
  "lastSuccessfulBuild[number,result,duration,timestamp,building]",
  "lastFailedBuild[number,result,duration,timestamp,building]",
].join(",");

export async function fetchJenkinsJob(fullName: string): Promise<JenkinsJobApiResponse> {
  const path = `${jenkinsFullNameToJobPath(fullName)}/api/json`;
  const { data } = await jenkinsClient().get<JenkinsJobApiResponse>(path, {
    params: { tree: JOB_TREE },
  });
  return data;
}

export function isJenkinsNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}
