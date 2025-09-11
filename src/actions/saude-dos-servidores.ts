import "server-only";
import { zabbixRpc } from "@/lib/zabbix.server";
import { zabbixStatusFromTriggers, type Trigger } from "./_helpers/zabbixStatus";
import type { ZabbixStatus } from "@/types/zabbix";

const DEFAULT_HOST = process.env.ZABBIX_DEFAULT_HOST ?? "Zabbix server";

export async function getSaudeDosServidoresFilas(
  projectName: string,
  host = DEFAULT_HOST
): Promise<ZabbixStatus> {
  const params = {
    host,
    output: "extend" as const,
    selectFunctions: "extend",
    filter: { description: projectName },
  };

  const triggers = await zabbixRpc<Trigger[]>("trigger.get", params, 1);
  return zabbixStatusFromTriggers(triggers);
}
