"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { StatItem, StatVariant } from "@/types/metricas";
import { RotateCcw } from "lucide-react";

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
    readonly className?: string;
};

const VARIANT_COLORS: Record<StatVariant, string> = {
    neutral: "#3B82F6",
    success: "#075A3E",
    warning: "#9C6507",
    danger: "#970C0C",
    muted: "#6B7280",
};

const PROGRESS_COLOR_OVER_LIMIT = "#F59E0B";
const PROGRESS_COLOR_WITHIN_LIMIT = "#1E3A8A";
const PROGRESS_SCALE_OVER_LIMIT = 120;
const PROGRESS_OVER_SEGMENT_UNITS = 10;

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const ptBrFormatter = new Intl.NumberFormat("pt-BR");
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
    className,
}: Props) {
    const renderContent = () => {
        if (!systemName) {
            return (
                <div className="text-sm text-muted-foreground">
                    Selecione um projeto
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="space-y-4">
                    <div className="flex gap-3">
                        {SKELETON_KEYS.map((key) => (
                            <div
                                key={key}
                                className="flex-1 space-y-2 rounded-md border border-[#D8D8D8] p-2"
                            >
                                <Skeleton className="h-7 w-16" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                    <Skeleton className="h-[18px] w-full" />
                </div>
            );
        }

        if (isError || !items || progressPercentage === undefined) {
            return (
                <div>
                    <div className="text-sm text-muted-foreground">
                        {errorMessage}
                    </div>
                    {onRetry && (
                        <Button
                            onClick={onRetry}
                            variant="secondary"
                            size="sm"
                            className="mt-3"
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Tentar novamente
                        </Button>
                    )}
                </div>
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
                        <div
                            key={item.label}
                            className="flex-1 space-y-1 rounded-md border border-[#D8D8D8] p-2"
                        >
                            <div
                                className="text-2xl font-medium"
                                style={{ color: VARIANT_COLORS[item.variant] }}
                            >
                                {ptBrFormatter.format(item.value)}
                            </div>
                            <div className="text-sm font-normal text-[#6B7280]">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
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
                                backgroundColor: PROGRESS_COLOR_WITHIN_LIMIT,
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
        <Card
            className={cn(
                "rounded-md border-0 shadow-[3px_4px_6px_0px_#0000001A] gap-3 py-4 px-1",
                className,
            )}
        >
            <CardHeader className="pb-1 px-4">
                <CardTitle className="text-sm font-bold text-[#111827]">
                    {title}
                </CardTitle>
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>
            <CardContent className="px-4">{renderContent()}</CardContent>
        </Card>
    );
}
