"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
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
    readonly progressPercentage?: number;
    readonly action?: React.ReactNode;
    readonly bare?: boolean;
    readonly className?: string;
};

const PROGRESS_COLOR_OVER_LIMIT = "#F59E0B";
const PROGRESS_COLOR_WITHIN_LIMIT = "#3B82F6";
const PROGRESS_SCALE_OVER_LIMIT = 120;
const PROGRESS_OVER_SEGMENT_UNITS = 10;

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const percentFormatter = new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

export default function ProgressStatsCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    items,
    progressPercentage,
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
                <div className="space-y-4">
                    <div className="flex gap-3">
                        {SKELETON_KEYS.map((key) => (
                            <MetricasStatSkeletonBox key={key} />
                        ))}
                    </div>
                    <Skeleton className="h-[18px] w-full" />
                </div>
            );
        }

        if (isError || !items || progressPercentage === undefined) {
            return (
                <MetricasErrorState message={errorMessage} onRetry={onRetry} />
            );
        }

        const isOverLimit = progressPercentage > 100;
        const trackScale = isOverLimit ? PROGRESS_SCALE_OVER_LIMIT : 100;
        const baseWidth = (
            (Math.min(progressPercentage, 100) / trackScale) *
            100
        ).toFixed(2);
        const overWidth = isOverLimit
            ? ((PROGRESS_OVER_SEGMENT_UNITS / trackScale) * 100).toFixed(2)
            : "0";
        const percentColor = isOverLimit
            ? PROGRESS_COLOR_OVER_LIMIT
            : PROGRESS_COLOR_WITHIN_LIMIT;

        return (
            <div>
                <div className="flex gap-3">
                    {items.map((item) => (
                        <StatItemBox key={item.label} item={item} />
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-[18px] flex-1 overflow-hidden rounded-full bg-[#E5E7EB]"
                        aria-hidden="true"
                    >
                        <div
                            data-testid="progress-stats-fill"
                            className={cn(
                                "h-full",
                                isOverLimit ? "rounded-l-full" : "rounded-full",
                            )}
                            style={{
                                width: `${baseWidth}%`,
                                backgroundColor: "#1E3A8A",
                            }}
                        />
                        {isOverLimit && (
                            <div
                                data-testid="progress-stats-fill-over"
                                className="h-full rounded-r-full"
                                style={{
                                    width: `${overWidth}%`,
                                    backgroundColor: PROGRESS_COLOR_OVER_LIMIT,
                                }}
                            />
                        )}
                    </div>
                    <span
                        className="text-sm font-bold"
                        style={{ color: percentColor }}
                    >
                        {percentFormatter.format(progressPercentage)}%
                    </span>
                </div>
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
