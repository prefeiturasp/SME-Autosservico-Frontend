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

export async function getJenkinsJobSummary(
  projectFullName: string,
  hostids = DEFAULT_HOSTIDS
): Promise<JenkinsJobSummary> {
  const project = projectFullName.trim();
  if (!project) return {};

  const fetchByKey = async (keyValue: string) => {
    const params = {
      output: ["lastvalue"],
      hostids,
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
      hostids,
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
  const lastvalue = await fetchByKey(project);
  if (lastvalue) return jenkinsJobSummaryFromLastvalue(lastvalue);

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
