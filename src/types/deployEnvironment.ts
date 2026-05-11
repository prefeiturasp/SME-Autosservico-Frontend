export type DeployEnvironment = "producao" | "homologacao" | "qa";

export type DeployEnvironmentInfo = {
  value: DeployEnvironment;
  label: string;
  dotClassName: string;
  branch: string;
};

export const DEPLOY_ENVIRONMENTS: ReadonlyArray<DeployEnvironmentInfo> = [
  { value: "producao", label: "Produção", dotClassName: "bg-red-500", branch: "Master" },
  { value: "homologacao", label: "Homologação", dotClassName: "bg-amber-400", branch: "Homolog" },
  { value: "qa", label: "QA", dotClassName: "bg-green-500", branch: "QA" },
];
