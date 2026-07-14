"use client";

import ZabbixStatusCard from "@/components/dashboard/ZabbixStatusCard";
import { useZabbixStatus } from "@/hooks/useZabbixStatus";

type ProducaoProps = {
    readonly projectName: string;
    readonly title?: string;
    readonly className?: string;
    readonly unmonitoredLabel?: string;
};

export default function Producao({
    title = "Produção",
    className,
    projectName,
    unmonitoredLabel,
}: ProducaoProps) {
    const query = useZabbixStatus({
        endpoint: "/api/zabbix/status/producao",
        keyPrefix: "zabbix-status-producao",
        projectName: projectName ?? "",
    });

    return (
        <ZabbixStatusCard
            title={title}
            className={className}
            projectName={projectName}
            query={query}
            unmonitoredLabel={unmonitoredLabel}
        />
    );
}
