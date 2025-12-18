// src/hooks/useZabbixStatus.ts (sem mudanças de lógica)
import { useQuery } from "@tanstack/react-query";
import type { ZabbixStatus } from "@/types/zabbix";

type Options = {
    endpoint: string; // agora: `/api/zabbix/status/<preset>`
    keyPrefix: string;
    projectName: string;
    host?: string;
};

export function useZabbixStatus({
    endpoint,
    keyPrefix,
    projectName,
    host,
}: Options) {
    return useQuery<ZabbixStatus>({
        queryKey: [keyPrefix, projectName, host],
        enabled: !!projectName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const qs = new URLSearchParams({
                project: projectName,
                ...(host ? { host } : {}),
            });
            const res = await fetch(`${endpoint}?${qs.toString()}`, {
                cache: "no-store",
            });
            if (!res.ok) throw new Error("Falha ao buscar status");
            return res.json();
        },
    });
}
