import "server-only";
import { zabbixRpc } from "@/lib/zabbix.server";
import { zabbixStatusFromTriggers, type Trigger } from "./_helpers/zabbixStatus";
import type { ZabbixStatus } from "@/types/zabbix";

const DEFAULT_HOST = process.env.ZABBIX_DEFAULT_HOST ?? "Zabbix server";

export async function getDisponibilidadeDosAmbientesProducao(
  projectName: string,
  host = DEFAULT_HOST
): Promise<ZabbixStatus> {
  const params = {
    filter: { host: [host], description: [projectName] },
    output: "extend" as const,
  };

  const triggers = await zabbixRpc<Trigger[]>("trigger.get", params, 2);
  return zabbixStatusFromTriggers(triggers);
}
