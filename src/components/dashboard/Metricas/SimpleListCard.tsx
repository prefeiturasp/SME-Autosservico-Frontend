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
import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

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
            return (
                <div className="text-sm text-muted-foreground">
                    Selecione um projeto
                </div>
            );
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
                    <div className="mx-3 flex justify-center border-t border-[#D8D8D8] py-3">
                        <button
                            type="button"
                            onClick={() => setExpanded((prev) => !prev)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#111827] hover:underline"
                        >
                            <ChevronDown
                                className={cn(
                                    "h-3.5 w-3.5 transition-transform",
                                    expanded && "rotate-180",
                                )}
                                aria-hidden="true"
                            />
                            {expanded ? collapseLabel : expandLabel}
                        </button>
                    </div>
                )}
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
