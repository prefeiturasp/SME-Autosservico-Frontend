import { zabbixRpc } from "@/lib/zabbix.server";
import { getDatabaseConfigForSystem, systemHasNoDatabase } from "./databaseConfig";
import type { DatabaseStatusResponse } from "@/types/database";

type ZabbixItem = {
  itemid: string;
  lastvalue: string;
  [key: string]: unknown;
};

export async function fetchDatabaseStatus(systemName: string): Promise<DatabaseStatusResponse> {
  if (systemHasNoDatabase(systemName)) {
    return { system: systemName, hasDatabase: false, instances: [] };
  }

  const configs = getDatabaseConfigForSystem(systemName);

  if (!configs) {
    return { system: systemName, hasDatabase: false, instances: [] };
  }

  const results = await Promise.all(
    configs.map(async (cfg) => {
      try {
        const items = await zabbixRpc<ZabbixItem[]>("item.get", {
          hostids: cfg.hostid,
          search: { key_: cfg.key },
          output: ["itemid", "lastvalue"],
        });

        const lastvalue =
          cfg.dbType === "mysql" ? "0" : (items?.[0]?.lastvalue ?? "");
        return {
          label: cfg.label,
          dbType: cfg.dbType,
          available: cfg.isOk(lastvalue),
          ...(cfg.role ? { role: cfg.role } : {}),
        };
      } catch {
        return {
          label: cfg.label,
          dbType: cfg.dbType,
          available: false,
          ...(cfg.role ? { role: cfg.role } : {}),
        };
      }
    })
  );

  return {
    system: systemName,
    hasDatabase: true,
    instances: results,
  };
}
