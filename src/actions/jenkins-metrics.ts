import "server-only";

import { formatDDMMYYYY_HHMM_FromMillis, formatDurationMs } from "@/lib/utils";
import { fetchJenkinsJob, isJenkinsNotFound, type JenkinsJobApiBuild } from "@/lib/jenkins.server";
import type { JenkinsBuildInfo } from "@/types/jenkins";
import type {
  JenkinsBranchBuildMetrics,
  JenkinsBuildStatus,
  JenkinsMetricsApiResponse,
} from "@/types/jenkins-metrics";

type JenkinsEnvironment = "prod" | "homolog";

function normalizeProjectFullName(projectFullName: string): string | null {
  const normalized = projectFullName.trim();
  return normalized || null;
}

function getBaseAndCurrentEnv(project: string): { base: string; currentEnv?: string } {
  const base = project.includes("/") ? project.split("/")[0] : project;
  const currentEnv = project.includes("/") ? project.slice(base.length + 1) : undefined;
  return { base, currentEnv };
}

function buildCandidateFullNames(project: string, environment: JenkinsEnvironment): string[] {
  if (project.includes("/") && environment === "prod") return [project];

  const { base, currentEnv } = getBaseAndCurrentEnv(project);

  if (environment === "homolog") {
    const homologCandidates = [
      ...(currentEnv && /prod/i.test(currentEnv)
        ? [
            currentEnv.replaceAll(/prod/gi, "homolog"),
            currentEnv.replaceAll(/prod/gi, "hml"),
          ]
        : []),
      "homolog",
      "homologacao",
      "hml",
      "hmg",
      "develop",
      "dev",
      "staging",
      "stage",
    ];

    return [...new Set(homologCandidates.map((env) => `${base}/${env}`))];
  }

  return project.includes("/") ? [project] : [`${project}/master`, `${project}/main`];
}

function normalizeStatus(build: JenkinsJobApiBuild | null | undefined): JenkinsBuildStatus {
  if (!build) return "UNKNOWN";
  if (build.building) return "IN_PROGRESS";

  switch (build.result) {
    case "SUCCESS":
    case "FAILURE":
    case "UNSTABLE":
    case "ABORTED":
      return build.result;
    default:
      return "UNKNOWN";
  }
}

function parseBuild(build: JenkinsJobApiBuild | null | undefined): JenkinsBuildInfo | undefined {
  if (!build) return undefined;

  const number = Number(build.number);
  const timestampMs = Number(build.timestamp);
  const durationMs = Number(build.duration);
  const timestamp = formatDDMMYYYY_HHMM_FromMillis(timestampMs);
  const duration = formatDurationMs(durationMs);

  if (!Number.isFinite(number)) return undefined;
  if (!Number.isFinite(timestampMs) || !timestamp) return undefined;
  if (!Number.isFinite(durationMs) || !duration) return undefined;

  return {
    number,
    status: normalizeStatus(build),
    timestampMs,
    timestamp,
    durationMs,
    duration,
  };
}

function calculateStabilityPercent(
  healthScore: number | undefined,
  builds: JenkinsJobApiBuild[] | undefined,
): number {
  if (Number.isFinite(healthScore)) {
    return Math.max(0, Math.min(100, Math.round(Number(healthScore))));
  }

  const finished = (builds ?? []).filter((build) => !build.building && typeof build.result === "string");
  if (finished.length === 0) return 0;

  const successCount = finished.filter((build) => build.result === "SUCCESS").length;
  return Math.round((successCount / finished.length) * 100);
}

function toMetrics(fullName: string, job: Awaited<ReturnType<typeof fetchJenkinsJob>>): JenkinsBranchBuildMetrics {
  const health = job.healthReport?.[0];

  return {
    jobName: job.name ?? fullName,
    jobUrl: job.url ?? "",
    status: normalizeStatus(job.lastBuild),
    stabilityPercent: calculateStabilityPercent(health?.score, job.builds),
    ...(health?.description ? { healthDescription: health.description } : {}),
    ...(parseBuild(job.lastBuild) ? { lastBuild: parseBuild(job.lastBuild) } : {}),
    ...(parseBuild(job.lastSuccessfulBuild)
      ? { lastSuccessfulBuild: parseBuild(job.lastSuccessfulBuild) }
      : {}),
    ...(parseBuild(job.lastFailedBuild) ? { lastFailedBuild: parseBuild(job.lastFailedBuild) } : {}),
  };
}

export async function getJenkinsBranchBuildMetrics(
  projectFullName: string,
  environment: JenkinsEnvironment = "prod",
): Promise<JenkinsMetricsApiResponse> {
  const project = normalizeProjectFullName(projectFullName);
  if (!project) return { found: false, message: "Projeto Jenkins não informado" };

  const candidates = buildCandidateFullNames(project, environment);

  for (const candidate of candidates) {
    try {
      const job = await fetchJenkinsJob(candidate);
      return { found: true, data: toMetrics(candidate, job) };
    } catch (e) {
      if (isJenkinsNotFound(e)) continue;
      throw e;
    }
  }

  return {
    found: false,
    message: `Job não encontrado no Jenkins (tentado: ${candidates.join(", ")})`,
  };
}
