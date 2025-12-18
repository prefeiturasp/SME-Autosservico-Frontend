export type JenkinsBuildInfo = {
  number: number;
  status: string;
  timestampMs: number;
  timestamp: string;
  durationMs: number;
  duration: string;
};

export type JenkinsJobSummary = {
  lastBuild?: JenkinsBuildInfo;
  lastSuccessfulBuild?: JenkinsBuildInfo;
  lastFailedBuild?: JenkinsBuildInfo;
};

