import { formatDDMMYYYY_HHMM_FromMillis, formatDurationMs } from "@/lib/utils";
import type { JenkinsBuildInfo, JenkinsJobSummary } from "@/types/jenkins";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function parseBuild(build: unknown, fallbackStatus?: string): JenkinsBuildInfo | undefined {
  if (!isRecord(build)) return undefined;

  const number = Number(build.number);
  const timestampMs = Number(build.timestamp);
  const durationMs = Number(build.duration);

  const result = typeof build.result === "string" ? build.result : undefined;
  const inProgress =
    (typeof build.inProgress === "boolean" ? build.inProgress : false) ||
    (typeof build.building === "boolean" ? build.building : false);

  const status = result ?? (inProgress ? "IN_PROGRESS" : fallbackStatus ?? "UNKNOWN");

  const timestamp = formatDDMMYYYY_HHMM_FromMillis(timestampMs);
  const duration = formatDurationMs(durationMs);

  if (!Number.isFinite(number)) return undefined;
  if (!Number.isFinite(timestampMs) || !timestamp) return undefined;
  if (!Number.isFinite(durationMs) || !duration) return undefined;

  return { number, status, timestampMs, timestamp, durationMs, duration };
}

/**
 * Parseia o campo `lastvalue` do item.get do Zabbix.
 * `lastvalue` é um JSON serializado em string (tipicamente um array com 1 elemento).
 */
export function jenkinsJobSummaryFromLastvalue(lastvalue: string | undefined): JenkinsJobSummary {
  if (!lastvalue) return {};

  let parsed: unknown;
  try {
    parsed = JSON.parse(lastvalue);
  } catch {
    throw new Error("Campo lastvalue inválido (JSON malformado)");
  }

  if (!Array.isArray(parsed) || parsed.length === 0) return {};
  const job = parsed[0];
  if (!isRecord(job)) return {};

  const lastBuild = parseBuild(job.lastBuild, "UNKNOWN");
  const lastSuccessfulBuild = parseBuild(job.lastSuccessfulBuild, "SUCCESS");
  const lastFailedBuild = parseBuild(job.lastFailedBuild, "FAILURE");

  return {
    ...(lastBuild ? { lastBuild } : {}),
    ...(lastSuccessfulBuild ? { lastSuccessfulBuild } : {}),
    ...(lastFailedBuild ? { lastFailedBuild } : {}),
  };
}
