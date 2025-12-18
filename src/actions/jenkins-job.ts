import "server-only";

import { zabbixRpc } from "@/lib/zabbix.server";
import { jenkinsJobSummaryFromLastvalue } from "./_helpers/jenkinsJob";
import type { JenkinsJobSummary } from "@/types/jenkins";

type ZabbixItemGetResult = { itemid?: string; lastvalue?: string };

const DEFAULT_HOSTIDS = "10726";
const ITEM_TYPE = 18;

type ZabbixFetchers = {
  fetchByKey: (keyValue: string) => Promise<string | undefined>;
  fetchCandidatesByPrefix: (keyPrefix: string) => Promise<ZabbixItemGetResult[]>;
};

function scoreSummary(summary: JenkinsJobSummary): number {
  const timestamps = [
    summary.lastBuild?.timestampMs,
    summary.lastSuccessfulBuild?.timestampMs,
    summary.lastFailedBuild?.timestampMs,
  ].filter((v): v is number => Number.isFinite(v));

  if (timestamps.length === 0) return Number.NEGATIVE_INFINITY;
  return Math.max(...timestamps);
}

function getEnvFromLastvalue(lastvalue: string): string | undefined {
  try {
    const parsed: unknown = JSON.parse(lastvalue);
    if (!Array.isArray(parsed) || parsed.length === 0) return undefined;
    const job = parsed[0];
    if (typeof job !== "object" || job === null) return undefined;
    const fullName = (job as { fullName?: unknown }).fullName;
    if (typeof fullName !== "string") return undefined;
    const parts = fullName.split("/");
    return parts.length >= 2 ? parts[1] : undefined;
  } catch {
    return undefined;
  }
}

function isHomologEnv(env: string | undefined): boolean {
  if (!env) return false;
  return /^(homolog|homologacao|hml|hmg|develop|dev|staging|stage)$/i.test(env);
}

function normalizeProjectFullName(projectFullName: string): string | null {
  const normalized = projectFullName.trim();
  return normalized || null;
}

function createZabbixFetchers(resolvedHostids: string): ZabbixFetchers {
  const fetchByKey = async (keyValue: string) => {
    const params = {
      output: ["lastvalue"],
      hostids: resolvedHostids,
      search: {
        key_: `jenkins.job.mb.get[${keyValue}]`,
      },
      filter: {
        type: ITEM_TYPE,
      },
    };

    const result = await zabbixRpc<ZabbixItemGetResult[] | undefined>("item.get", params, 1);
    return result?.[0]?.lastvalue;
  };

  const fetchCandidatesByPrefix = async (keyPrefix: string) => {
    const params = {
      output: ["lastvalue"],
      hostids: resolvedHostids,
      search: {
        // `search` é por substring; o sufixo "/" permite pegar PR-###, feature branches etc.
        key_: `jenkins.job.mb.get[${keyPrefix}/`,
      },
      filter: {
        type: ITEM_TYPE,
      },
    };

    const result = await zabbixRpc<ZabbixItemGetResult[] | undefined>("item.get", params, 1);
    return result ?? [];
  };

  return { fetchByKey, fetchCandidatesByPrefix };
}

function safeSummaryFromLastvalue(lastvalue: string): JenkinsJobSummary | null {
  try {
    return jenkinsJobSummaryFromLastvalue(lastvalue);
  } catch {
    return null;
  }
}

async function tryFetchSummaryByKey(
  fetchByKey: ZabbixFetchers["fetchByKey"],
  keyValue: string
): Promise<JenkinsJobSummary | null> {
  const lastvalue = await fetchByKey(keyValue);
  if (!lastvalue) return null;
  return safeSummaryFromLastvalue(lastvalue);
}

function getBaseAndCurrentEnv(project: string): { base: string; currentEnv?: string } {
  const base = project.includes("/") ? project.split("/")[0] : project;
  const currentEnv = project.includes("/") ? project.slice(base.length + 1) : undefined;
  return { base, currentEnv };
}

function buildHomologCandidateEnvs(currentEnv?: string): string[] {
  return [
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
}

async function findBestSummaryFromPrefixCandidates(
  candidates: ZabbixItemGetResult[],
  isAllowed: (lastvalue: string) => boolean
): Promise<JenkinsJobSummary | null> {
  let best: JenkinsJobSummary | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const candidate of candidates) {
    if (!candidate.lastvalue) continue;
    if (!isAllowed(candidate.lastvalue)) continue;

    const summary = safeSummaryFromLastvalue(candidate.lastvalue);
    if (!summary) continue;

    const score = scoreSummary(summary);
    if (score <= bestScore) continue;

    bestScore = score;
    best = summary;
  }

  return best && Number.isFinite(bestScore) ? best : null;
}

async function getHomologSummary(
  project: string,
  fetchers: ZabbixFetchers
): Promise<JenkinsJobSummary | null> {
  const { base, currentEnv } = getBaseAndCurrentEnv(project);
  const candidateEnvs = buildHomologCandidateEnvs(currentEnv);

  for (const env of candidateEnvs) {
    const summary = await tryFetchSummaryByKey(fetchers.fetchByKey, `${base}/${env}`);
    if (summary) return summary;
  }

  const candidates = await fetchers.fetchCandidatesByPrefix(base);
  return findBestSummaryFromPrefixCandidates(candidates, (lastvalue) =>
    isHomologEnv(getEnvFromLastvalue(lastvalue))
  );
}

async function getCompatSummary(
  project: string,
  fetchers: ZabbixFetchers
): Promise<JenkinsJobSummary | null> {
  if (project.includes("/")) return null;

  const withMaster = await tryFetchSummaryByKey(fetchers.fetchByKey, `${project}/master`);
  if (withMaster) return withMaster;

  const candidates = await fetchers.fetchCandidatesByPrefix(project);
  return findBestSummaryFromPrefixCandidates(candidates, () => true);
}

export async function getJenkinsJobSummary(
  projectFullName: string,
  hostids?: string,
  environment: "prod" | "homolog" = "prod"
): Promise<JenkinsJobSummary> {
  const project = normalizeProjectFullName(projectFullName);
  if (!project) return {};
  const resolvedHostids = hostids ?? DEFAULT_HOSTIDS;
  const fetchers = createZabbixFetchers(resolvedHostids);

  // 1) Tenta como veio (compatível com a requisição padrão especificada)
  if (environment === "prod") {
    const direct = await tryFetchSummaryByKey(fetchers.fetchByKey, project);
    if (direct) return direct;
  }

  if (environment === "homolog") {
    return (await getHomologSummary(project, fetchers)) ?? {};
  }

  return (await getCompatSummary(project, fetchers)) ?? {};
}
