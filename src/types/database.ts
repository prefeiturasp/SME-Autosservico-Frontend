export type DatabaseInstanceStatus = {
  label: string;
  dbType: "mysql" | "postgresql" | "sqlserver";
  available: boolean;
  role?: "escrita" | "leitura";
};

export type DatabaseStatusResponse = {
  system: string;
  hasDatabase: boolean;
  instances: DatabaseInstanceStatus[];
};
