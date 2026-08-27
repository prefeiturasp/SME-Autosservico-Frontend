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
import type { StatItem } from "@/types/metricas";
import { RotateCcw } from "lucide-react";
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
            return (
                <div className="text-sm text-muted-foreground">
                    Selecione um projeto
                </div>
            );
        }

        if (isLoading) {
            return (
                <div className="flex gap-3" data-testid="stats-card-items">
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
            );
        }

        if (isError || !items) {
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

        return (
            <div className="flex gap-3" data-testid="stats-card-items">
                {items.map((item) => (
                    <StatItemBox key={item.label} item={item} />
                ))}
            </div>
        );
    };

    if (bare) {
        return <>{renderContent()}</>;
    }

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
