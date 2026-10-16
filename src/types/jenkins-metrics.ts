import type { JenkinsBuildInfo } from "@/types/jenkins";

export type JenkinsBuildStatus =
  | "SUCCESS"
  | "FAILURE"
  | "IN_PROGRESS"
  | "UNSTABLE"
  | "ABORTED"
  | "UNKNOWN";

export type JenkinsBranchBuildMetrics = {
  jobName: string;
  jobUrl: string;
  status: JenkinsBuildStatus;
  stabilityPercent: number;
  healthDescription?: string;
  lastBuild?: JenkinsBuildInfo;
  lastSuccessfulBuild?: JenkinsBuildInfo;
  lastFailedBuild?: JenkinsBuildInfo;
};

export type JenkinsMetricsApiSuccess = {
  found: true;
  data: JenkinsBranchBuildMetrics;
};

export type JenkinsMetricsApiNotFound = {
  found: false;
  message: string;
};

export type JenkinsMetricsApiResponse = JenkinsMetricsApiSuccess | JenkinsMetricsApiNotFound;
