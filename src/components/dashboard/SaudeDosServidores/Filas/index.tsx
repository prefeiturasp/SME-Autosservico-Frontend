"use client";

import ZabbixStatusCard from "@/components/dashboard/ZabbixStatusCard";
import { useZabbixStatus } from "@/hooks/useZabbixStatus";

type FilasProps = {
    readonly projectName: string;
    readonly title?: string;
    readonly className?: string;
};

export default function Filas({
    title = "Fila",
    className,
    projectName,
}: FilasProps) {
    const query = useZabbixStatus({
        endpoint: "/api/zabbix/status/filas",
        keyPrefix: "zabbix-status-filas",
        projectName: projectName ?? "",
    });

    return (
        <ZabbixStatusCard
            title={title}
            className={className}
            projectName={projectName}
            query={query}
        />
    );
}
