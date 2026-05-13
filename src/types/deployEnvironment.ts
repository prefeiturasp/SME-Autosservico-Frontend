export type DeployEnvironment = "producao" | "homologacao" | "qa";

export type DeployEnvironmentInfo = {
  value: DeployEnvironment;
  label: string;
  dotClassName: string;
  branch: string;
  sonarBranches: readonly string[];
};

export const DEPLOY_ENVIRONMENTS: ReadonlyArray<DeployEnvironmentInfo> = [
  {
    value: "producao",
    label: "Produção",
    dotClassName: "bg-red-500",
    branch: "Master",
    sonarBranches: ["master", "main"],
  },
  {
    value: "homologacao",
    label: "Homologação",
    dotClassName: "bg-amber-400",
    branch: "Homolog",
    sonarBranches: ["homolog"],
  },
  {
    value: "qa",
    label: "QA",
    dotClassName: "bg-green-500",
    branch: "QA",
    sonarBranches: ["test"],
  },
];

export function getSonarBranchesForEnvironment(env: DeployEnvironment): readonly string[] {
  return (
    DEPLOY_ENVIRONMENTS.find((e) => e.value === env)?.sonarBranches ?? []
  );
}
