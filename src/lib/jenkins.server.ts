import "server-only";
import axios, { AxiosInstance } from "axios";

let cachedClient: AxiosInstance | null = null;

function getJenkinsBaseUrl(): string {
  const url = process.env.JENKINS_URL;
  if (!url) throw new Error("JENKINS_URL não configurada");
  return url.replace(/\/$/, "");
}

function getJenkinsUsername(): string {
  const username = process.env.JENKINS_USERNAME;
  if (!username) throw new Error("JENKINS_USERNAME não configurada");
  return username;
}

function getJenkinsApiToken(): string {
  const token = process.env.JENKINS_API_TOKEN;
  if (!token) throw new Error("JENKINS_API_TOKEN não configurada");
  return token;
}

function getTimeout(): number {
  const raw = process.env.JENKINS_TIMEOUT_MS;
  const parsed = raw ? Number(raw) : 10000;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 10000;
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
