"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { ProfileBreakdownBlock } from "@/types/metricas";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasMessage from "./MetricasMessage";

type Props = {
    readonly title: string;
    readonly systemName?: string;
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly onRetry?: () => void;
    readonly errorMessage?: string;
    readonly blocks?: ProfileBreakdownBlock[];
    readonly action?: React.ReactNode;
    readonly bare?: boolean;
    readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function ProfileBreakdownCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    blocks,
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {SKELETON_KEYS.map((key) => (
                        <div key={key} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    ))}
                </div>
            );
        }

        if (isError || !blocks) {
            return (
                <MetricasErrorState message={errorMessage} onRetry={onRetry} />
            );
        }

        return (
            <div className="overflow-hidden rounded-md border border-[#D8D8D8] p-3">
                {bare && (
                    <div className="mb-3 text-sm font-bold text-[#111827]">
                        {title}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    {blocks.map((block) => (
                        <div key={block.title}>
                            <h3 className="py-2 mb-2 text-sm font-medium text-[#111827] border-b border-[#D8D8D8]">
                                {block.title}
                            </h3>
                            <div>
                                {block.rows.map((row) => (
                                    <div
                                        key={row.label}
                                        className="flex items-center justify-between py-2"
                                    >
                                        <span className="text-xs text-[#111827]">
                                            {row.label}
                                        </span>
                                        <span className="text-sm font-medium text-[#111827]">
                                            {ptBrFormatter.format(row.value)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
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
