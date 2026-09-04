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
    readonly columns: number;
    readonly action?: React.ReactNode;
    readonly className?: string;
};

const GRID_COLUMNS_CLASS: Record<number, string> = {
    3: "grid grid-cols-3 gap-3",
    4: "grid grid-cols-4 gap-3",
};

const SKELETON_KEYS = [
    "skeleton-1",
    "skeleton-2",
    "skeleton-3",
    "skeleton-4",
    "skeleton-5",
    "skeleton-6",
    "skeleton-7",
    "skeleton-8",
];

export default function StatsGridCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    items,
    columns,
    action,
    className,
}: Props) {
    const gridClass = GRID_COLUMNS_CLASS[columns] ?? GRID_COLUMNS_CLASS[4];

    const renderContent = () => {
        if (!systemName) {
            return <MetricasMessage>Selecione um projeto</MetricasMessage>;
        }

        if (isLoading) {
            return (
                <div className={gridClass}>
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
            <div className={gridClass}>
                {items.map((item) => (
                    <StatItemBox key={item.label} item={item} />
                ))}
            </div>
        );
    };

    return (
        <MetricasCardShell title={title} action={action} className={className}>
            {renderContent()}
        </MetricasCardShell>
    );
}
