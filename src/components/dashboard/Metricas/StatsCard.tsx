"use client";

import type { StatItem } from "@/types/metricas";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasMessage from "./MetricasMessage";
import MetricasStatSkeletonBox from "./MetricasStatSkeletonBox";
import StatItemBox from "./StatItemBox";

type Props = {
    readonly title: string;
    readonly systemName?: string;
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly onRetry?: () => void;
    readonly errorMessage?: string;
    readonly items?: StatItem[];
    readonly action?: React.ReactNode;
    readonly bare?: boolean;
    readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export default function StatsCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    items,
    action,
    bare,
    className,
}: Props) {
    const renderContent = () => {
        if (!systemName) {
            return <MetricasMessage>Selecione um projeto</MetricasMessage>;
        }

        if (isLoading) {
            return (
                <div className="flex gap-3" data-testid="stats-card-items">
                    {SKELETON_KEYS.map((key) => (
                        <MetricasStatSkeletonBox key={key} />
                    ))}
                </div>
            );
        }

        if (isError || !items) {
            return (
                <MetricasErrorState message={errorMessage} onRetry={onRetry} />
            );
        }

        return (
            <div className="flex gap-3" data-testid="stats-card-items">
                {items.map((item) => (
                    <StatItemBox key={item.label} item={item} />
                ))}
            </div>
        );
    };

    return (
        <MetricasCardShell
            title={title}
            action={action}
            bare={bare}
            className={className}
        >
            {renderContent()}
        </MetricasCardShell>
    );
}
