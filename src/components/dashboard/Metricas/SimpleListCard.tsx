"use client";

import { useState } from "react";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasExpandToggle from "./MetricasExpandToggle";
import MetricasMessage from "./MetricasMessage";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
    readonly title: string;
    readonly systemName?: string;
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly onRetry?: () => void;
    readonly errorMessage?: string;
    readonly items?: string[];
    readonly action?: React.ReactNode;
    readonly initialVisibleItems?: number;
    readonly expandLabel?: string;
    readonly collapseLabel?: string;
    readonly bare?: boolean;
    readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

export default function SimpleListCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    items,
    action,
    initialVisibleItems,
    expandLabel = "Ver mais",
    collapseLabel = "Ver menos",
    bare,
    className,
}: Props) {
    const [expanded, setExpanded] = useState(false);

    const renderContent = () => {
        if (!systemName) {
            return <MetricasMessage>Selecione um projeto</MetricasMessage>;
        }

        if (isLoading) {
            return (
                <div className="space-y-3">
                    {SKELETON_KEYS.map((key) => (
                        <Skeleton key={key} className="h-5 w-full" />
                    ))}
                </div>
            );
        }

        if (isError || !items) {
            return (
                <MetricasErrorState message={errorMessage} onRetry={onRetry} />
            );
        }

        const canExpand =
            initialVisibleItems !== undefined &&
            items.length > initialVisibleItems;
        const visibleItems =
            expanded || initialVisibleItems === undefined
                ? items
                : items.slice(0, initialVisibleItems);

        return (
            <div className="overflow-hidden rounded-md border border-[#D8D8D8]">
                {bare && (
                    <div className="px-3 py-3 text-sm font-bold text-[#111827]">
                        {title}
                    </div>
                )}
                <div className="px-3">
                    {visibleItems.map((item) => (
                        <div
                            key={item}
                            className="py-2 text-xs font-normal text-[#111827]"
                        >
                            {item}
                        </div>
                    ))}
                </div>
                {canExpand && (
                    <MetricasExpandToggle
                        expanded={expanded}
                        onToggle={() => setExpanded((prev) => !prev)}
                        expandLabel={expandLabel}
                        collapseLabel={collapseLabel}
                    />
                )}
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
