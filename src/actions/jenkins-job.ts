import "server-only";

import { zabbixRpc } from "@/lib/zabbix.server";
import { jenkinsJobSummaryFromLastvalue } from "./_helpers/jenkinsJob";
import type { JenkinsJobSummary } from "@/types/jenkins";

type ZabbixItemGetResult = { itemid?: string; lastvalue?: string };

const DEFAULT_HOSTIDS = "10726";
const ITEM_TYPE = 18;

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

export async function getJenkinsJobSummary(
  projectFullName: string,
  hostids?: string,
  environment: "prod" | "homolog" = "prod"
): Promise<JenkinsJobSummary> {
  const project = projectFullName.trim();
  if (!project) return {};
  const resolvedHostids = hostids ?? DEFAULT_HOSTIDS;

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

  // 1) Tenta como veio (compatível com a requisição padrão especificada)
  if (environment === "prod") {
    const lastvalue = await fetchByKey(project);
    if (lastvalue) return jenkinsJobSummaryFromLastvalue(lastvalue);
  }

  if (environment === "homolog") {
    const base = project.includes("/") ? project.split("/")[0] : project;
    const currentEnv = project.includes("/") ? project.slice(base.length + 1) : undefined;

    const candidateEnvs: string[] = [];
    if (currentEnv) {
      if (/prod/i.test(currentEnv)) {
        candidateEnvs.push(currentEnv.replace(/prod/gi, "homolog"));
        candidateEnvs.push(currentEnv.replace(/prod/gi, "hml"));
      }
    }

    candidateEnvs.push("homolog", "homologacao", "hml", "hmg", "develop", "dev", "staging", "stage");

    for (const env of candidateEnvs) {
      const lv = await fetchByKey(`${base}/${env}`);
      if (lv) return jenkinsJobSummaryFromLastvalue(lv);
    }

    // Se não encontrou diretamente, busca por prefixo e escolhe o mais recente dentre os ambientes de homologação disponíveis.
    const candidates = await fetchCandidatesByPrefix(base);
    let best: JenkinsJobSummary | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const c of candidates) {
      if (!c.lastvalue) continue;
      const env = getEnvFromLastvalue(c.lastvalue);
      if (!isHomologEnv(env)) continue;

      let summary: JenkinsJobSummary;
      try {
        summary = jenkinsJobSummaryFromLastvalue(c.lastvalue);
      } catch {
        continue;
      }

      const score = scoreSummary(summary);
      if (score > bestScore) {
        bestScore = score;
        best = summary;
      }
    }

    if (best && Number.isFinite(bestScore)) return best;
    return {};
  }

  // 2) Compat: quando a chave não inclui branch, tenta `${key}/master` (padrão do exemplo do projeto)
  if (!project.includes("/")) {
    const lastvalueWithMaster = await fetchByKey(`${project}/master`);
    if (lastvalueWithMaster) return jenkinsJobSummaryFromLastvalue(lastvalueWithMaster);

    // 3) Compat: jobs que não possuem "master" (ex.: PR-###) — escolhe o mais recente entre as opções encontradas
    const candidates = await fetchCandidatesByPrefix(project);
    let best: JenkinsJobSummary | null = null;
    let bestScore = Number.NEGATIVE_INFINITY;

    for (const c of candidates) {
      if (!c.lastvalue) continue;
      let summary: JenkinsJobSummary;
      try {
        summary = jenkinsJobSummaryFromLastvalue(c.lastvalue);
      } catch {
        continue;
      }
      const score = scoreSummary(summary);
      if (score > bestScore) {
        bestScore = score;
        best = summary;
      }
    }

    if (best && Number.isFinite(bestScore)) return best;
  }

  return {};
}
