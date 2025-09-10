import "server-only";
import { zabbixRpc } from "@/lib/zabbix.server";
import { formatDDMMYYYY_HHMM_FromSeconds } from "@/lib/utils";

export type ProducaoStatus = {
    available: boolean;
    incidents_recent: boolean;
    message: string;
    /** Data e hora do último incidente (dd/mm/aaaa HH:mm) quando houver ativo ou recente */
    lastIncidentAt?: string;
};

const DEFAULT_HOST = process.env.ZABBIX_DEFAULT_HOST ?? "Zabbix server";
const RECENT_WINDOW_MS = Number(
    process.env.ZABBIX_RECENT_WINDOW_MS ?? 24 * 60 * 60 * 1000
);

type Trigger = { lastchange: string; value: string };


export async function getSaudeDosServidoresFilas(
    projectName: string,
    host = DEFAULT_HOST
): Promise<ProducaoStatus> {
    const params = {
        host: host,
        output: "extend" as const, // igual ao Postman
        selectFunctions: "extend",
        filter: { description: projectName },
    };

    const triggers = await zabbixRpc<Trigger[]>("trigger.get", params, 1);

    // Sem triggers
    if (!triggers?.length) {
        return {
            available: true,
            incidents_recent: false,
            message: "Sem incidentes recentes",
        };
    }

    const now = Date.now();

    // Incidentes ativos
    const active = triggers.filter((t) => t.value === "1");
    if (active.length > 0) {
        const lastActiveSec = Math.max(
            ...active.map((t) => Number(t.lastchange) || 0)
        );
        return {
            available: false,
            incidents_recent: true,
            message: "Há incidentes ativos",
            lastIncidentAt: formatDDMMYYYY_HHMM_FromSeconds(lastActiveSec),
        };
    }

    // Houve incidentes recentes (janela configurável)
    const recent = triggers.filter(
        (t) => now - Number(t.lastchange) * 1000 <= RECENT_WINDOW_MS
    );
    const hasRecent = recent.length > 0;
    const lastRecentSec = hasRecent
        ? Math.max(...recent.map((t) => Number(t.lastchange) || 0))
        : undefined;

    return {
        available: true,
        incidents_recent: hasRecent,
        message: hasRecent
            ? "Houve incidentes recentes"
            : "Sem incidentes recentes",
        lastIncidentAt: hasRecent
            ? formatDDMMYYYY_HHMM_FromSeconds(lastRecentSec)
            : undefined,
    };
}
