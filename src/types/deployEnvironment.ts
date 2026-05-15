export type DeployEnvironment = "producao" | "homologacao" | "qa";

export type JenkinsEnvironment = "prod" | "homolog" | "test";

export type DeployEnvironmentInfo = {
  value: DeployEnvironment;
  label: string;
  dotClassName: string;
  branch: string;
  sonarBranches: readonly string[];
  jenkinsEnvironment: JenkinsEnvironment;
};

export const DEPLOY_ENVIRONMENTS: ReadonlyArray<DeployEnvironmentInfo> = [
  {
    value: "producao",
    label: "Produção",
    dotClassName: "bg-red-500",
    branch: "Master",
    sonarBranches: ["master", "main"],
    jenkinsEnvironment: "prod",
  },
  {
    value: "homologacao",
    label: "Homologação",
    dotClassName: "bg-amber-400",
    branch: "Homolog",
    sonarBranches: ["homolog"],
    jenkinsEnvironment: "homolog",
  },
  {
    value: "qa",
    label: "QA",
    dotClassName: "bg-green-500",
    branch: "QA",
    sonarBranches: ["testes", "test", "teste", "develop"],
    jenkinsEnvironment: "test",
  },
];

export function getJenkinsEnvironmentForDeploy(
  env: DeployEnvironment
): JenkinsEnvironment {
  return (
    DEPLOY_ENVIRONMENTS.find((e) => e.value === env)?.jenkinsEnvironment ??
    "prod"
  );
}

export function getSonarBranchesForEnvironment(env: DeployEnvironment): readonly string[] {
  return (
    DEPLOY_ENVIRONMENTS.find((e) => e.value === env)?.sonarBranches ?? []
  );
}
