import { formatDDMMYYYY_HHMM_FromSeconds } from "@/lib/utils";
import type { ZabbixStatus } from "@/types/zabbix";

const RECENT_WINDOW_MS = Number(process.env.ZABBIX_RECENT_WINDOW_MS ?? 24 * 60 * 60 * 1000);

export type Trigger = { lastchange: string; value: string };

/** Converte triggers em um ZabbixStatus, mantendo seu comportamento atual. */
export function zabbixStatusFromTriggers(triggers: Trigger[] | undefined): ZabbixStatus {
  // Sem triggers => disponível & sem incidentes
  if (!triggers?.length) {
    return { available: true, incidents_recent: false, message: "Sem incidentes recentes" };
  }

  const now = Date.now();

  // Incidentes ativos
  const active = triggers.filter((t) => t.value === "1");
  if (active.length > 0) {
    const lastActiveSec = Math.max(...active.map((t) => Number(t.lastchange) || 0));
    return {
      available: false,
      incidents_recent: true,
      message: "Há incidentes ativos",
      lastIncidentAt: formatDDMMYYYY_HHMM_FromSeconds(lastActiveSec),
    };
  }

  // Incidentes recentes por janela configurável
  const recent = triggers.filter((t) => now - Number(t.lastchange) * 1000 <= RECENT_WINDOW_MS);
  const hasRecent = recent.length > 0;
  const lastRecentSec = hasRecent ? Math.max(...recent.map((t) => Number(t.lastchange) || 0)) : undefined;

  return {
    available: true,
    incidents_recent: hasRecent,
    message: hasRecent ? "Houve incidentes recentes" : "Sem incidentes recentes",
    lastIncidentAt: hasRecent ? formatDDMMYYYY_HHMM_FromSeconds(lastRecentSec) : undefined,
  };
}
