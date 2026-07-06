import "server-only";
import { SonarBranchNotFoundError } from "./client";
import { fetchQualityMetrics } from "./fetchQualityMetrics";
import type { SonarQualityMetrics } from "@/types/sonarqube";

export type FallbackResult =
  | { found: true; data: SonarQualityMetrics; triedBranches: string[] }
  | { found: false; triedBranches: string[] };

export async function fetchQualityMetricsWithFallback(
  projectKey: string,
  branches: readonly string[],
): Promise<FallbackResult> {
  if (branches.length === 0) {
    const data = await fetchQualityMetrics(projectKey);
    return { found: true, data, triedBranches: [] };
  }

  const tried: string[] = [];
  for (const branch of branches) {
    tried.push(branch);
    try {
      const data = await fetchQualityMetrics(projectKey, branch);
      return { found: true, data, triedBranches: tried };
    } catch (e) {
      if (e instanceof SonarBranchNotFoundError) continue;
      throw e;
    }
  }

  return { found: false, triedBranches: tried };
}
