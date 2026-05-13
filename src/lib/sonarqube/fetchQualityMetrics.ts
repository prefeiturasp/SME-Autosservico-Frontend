import "server-only";
import {
  fetchMeasures,
  fetchProjectStatus,
  type SonarMeasuresResponse,
  type SonarProjectStatusResponse,
} from "./client";
import type {
  QualityGateCondition,
  QualityGateStatus,
  SonarQualityMetrics,
  SonarRating,
} from "@/types/sonarqube";

const METRIC_KEYS = [
  "bugs",
  "vulnerabilities",
  "code_smells",
  "coverage",
  "duplicated_lines_density",
  "security_hotspots",
  "reliability_rating",
  "security_rating",
  "sqale_rating",
  "security_review_rating",
  "ncloc",
  "uncovered_lines",
  "accepted_issues",
];

function toNumber(value: string | undefined, fallback = 0): number {
  if (value === undefined || value === null || value === "") return fallback;
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function toRating(value: string | undefined): SonarRating {
  const n = toNumber(value, 1);
  if (n <= 1) return "A";
  if (n <= 2) return "B";
  if (n <= 3) return "C";
  if (n <= 4) return "D";
  return "E";
}

function measuresToRecord(
  measures: SonarMeasuresResponse["component"]["measures"],
): Record<string, string | undefined> {
  return measures.reduce<Record<string, string | undefined>>((acc, m) => {
    acc[m.metric] = m.value;
    return acc;
  }, {});
}

function extractLastAnalysisDate(status: SonarProjectStatusResponse): string | undefined {
  const direct = status.projectStatus.period?.date;
  if (direct) return direct;
  return status.projectStatus.periods?.[0]?.date;
}

export async function fetchQualityMetrics(
  projectKey: string,
  branch?: string,
): Promise<SonarQualityMetrics> {
  const [statusRes, measuresRes] = await Promise.all([
    fetchProjectStatus(projectKey, branch),
    fetchMeasures(projectKey, METRIC_KEYS, branch),
  ]);

  const map = measuresToRecord(measuresRes.component.measures);

  const failedConditions: QualityGateCondition[] = statusRes.projectStatus.conditions
    .filter((c) => c.status === "ERROR" || c.status === "WARN")
    .map((c) => ({
      metricKey: c.metricKey,
      comparator: c.comparator,
      errorThreshold: c.errorThreshold,
      actualValue: c.actualValue,
      status: c.status,
    }));

  return {
    projectKey: measuresRes.component.key,
    projectName: measuresRes.component.name,
    branch: measuresRes.component.branch ?? branch,
    qualityGate: {
      status: statusRes.projectStatus.status as QualityGateStatus,
      failedConditions,
    },
    measures: {
      bugs: toNumber(map.bugs),
      vulnerabilities: toNumber(map.vulnerabilities),
      codeSmells: toNumber(map.code_smells),
      coverage: toNumber(map.coverage),
      duplicatedLinesDensity: toNumber(map.duplicated_lines_density),
      securityHotspots: toNumber(map.security_hotspots),
      reliabilityRating: toRating(map.reliability_rating),
      securityRating: toRating(map.security_rating),
      sqaleRating: toRating(map.sqale_rating),
      securityReviewRating: toRating(map.security_review_rating),
      ncloc: toNumber(map.ncloc),
      uncoveredLines: toNumber(map.uncovered_lines),
      acceptedIssues: toNumber(map.accepted_issues),
    },
    lastAnalysisAt: extractLastAnalysisDate(statusRes),
  };
}

export const __test__ = {
  toNumber,
  toRating,
  measuresToRecord,
  extractLastAnalysisDate,
  METRIC_KEYS,
};
