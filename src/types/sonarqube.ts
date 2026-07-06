export type SonarRating = "A" | "B" | "C" | "D" | "E";

export type QualityGateStatus = "OK" | "ERROR" | "WARN" | "NONE";

export type QualityGateCondition = {
  metricKey: string;
  comparator: string;
  errorThreshold?: string;
  actualValue?: string;
  status: "OK" | "ERROR" | "WARN" | "NO_VALUE";
};

export type SonarQualityMetrics = {
  projectKey: string;
  projectName: string;
  branch?: string;
  qualityGate: {
    status: QualityGateStatus;
    failedConditions: QualityGateCondition[];
  };
  measures: {
    bugs: number;
    vulnerabilities: number;
    codeSmells: number;
    coverage: number;
    duplicatedLinesDensity: number;
    securityHotspots: number;
    reliabilityRating: SonarRating;
    securityRating: SonarRating;
    sqaleRating: SonarRating;
    securityReviewRating: SonarRating;
    ncloc: number;
    uncoveredLines: number;
    acceptedIssues: number;
  };
  lastAnalysisAt?: string;
};

export type SonarMetricsApiSuccess = {
  found: true;
  data: SonarQualityMetrics;
};

export type SonarMetricsApiNotFound = {
  found: false;
  message: string;
};

export type SonarMetricsApiResponse = SonarMetricsApiSuccess | SonarMetricsApiNotFound;
