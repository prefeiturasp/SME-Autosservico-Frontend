export type DbCheckConfig = {
  label: string;
  hostid: string;
  key: string;
  dbType: "mysql" | "postgresql" | "sqlserver";
  role?: "escrita" | "leitura";
  isOk: (lastvalue: string) => boolean;
};

const mysqlPing = (lastvalue: string) => lastvalue === "1";
const psqlRunning = (lastvalue: string) => lastvalue === "0";
const sqlServerRunning = (lastvalue: string) => lastvalue === "0";

const DATABASE_CONFIG: Record<string, DbCheckConfig[]> = {
  "Portal Educação": [
    { label: "MySQL", hostid: "10641", key: "mysql.ping", dbType: "mysql", isOk: mysqlPing },
  ],
  "Portal CEU": [
    { label: "MySQL", hostid: "10641", key: "mysql.ping", dbType: "mysql", isOk: mysqlPing },
  ],
  Intranet: [
    { label: "MySQL", hostid: "10641", key: "mysql.ping", dbType: "mysql", isOk: mysqlPing },
  ],
  "Rolê Agroecológico": [
    { label: "MySQL", hostid: "10641", key: "mysql.ping", dbType: "mysql", isOk: mysqlPing },
  ],
  Plateia: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  "Plateia App": [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  SigPAE: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  Cdep: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  "Currículo da Cidade": [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  IDEP: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  "Conecta Formação": [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  SigEscola: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  GIPE: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  Sigla: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  "Bens Físicos": [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  Limpeza: [
    { label: "PostgreSQL", hostid: "10605", key: "psql.running", dbType: "postgresql", isOk: psqlRunning },
  ],
  "Novo SGP": [
    { label: "PostgreSQL (Escrita)", hostid: "10747", key: "psql.running", dbType: "postgresql", role: "escrita", isOk: psqlRunning },
    { label: "PostgreSQL (Leitura)", hostid: "10745", key: "psql.running", dbType: "postgresql", role: "leitura", isOk: psqlRunning },
  ],
  "Serap Estudantes": [
    { label: "PostgreSQL (Escrita)", hostid: "10673", key: "psql.running", dbType: "postgresql", role: "escrita", isOk: psqlRunning },
    { label: "PostgreSQL (Leitura)", hostid: "10674", key: "psql.running", dbType: "postgresql", role: "leitura", isOk: psqlRunning },
  ],
  Serap: [
    { label: "SQL Server", hostid: "10711", key: 'service.info["MSSQL$SME_PRD",state]', dbType: "sqlserver", isOk: sqlServerRunning },
  ],
  Escolhas: [],
};

export function getDatabaseConfigForSystem(systemName: string): DbCheckConfig[] | null {
  const config = DATABASE_CONFIG[systemName];
  if (config === undefined) return null;
  if (config.length === 0) return null;
  return config;
}

export function systemHasNoDatabase(systemName: string): boolean {
  return systemName in DATABASE_CONFIG && DATABASE_CONFIG[systemName].length === 0;
}
