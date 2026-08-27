"use client";

import type { TableRow } from "@/types/metricas";
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
    readonly rows?: TableRow[];
    readonly firstColumnLabel: string;
    readonly secondColumnLabel: string;
    readonly action?: React.ReactNode;
    readonly initialVisibleRows?: number;
    readonly expandLabel?: string;
    readonly collapseLabel?: string;
    readonly bare?: boolean;
    readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function MetricasTableCard({
    title,
    systemName,
    isLoading,
    isError,
    onRetry,
    errorMessage = "Não foi possível carregar os dados.",
    rows,
    firstColumnLabel,
    secondColumnLabel,
    action,
    initialVisibleRows,
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

        if (isError || !rows) {
            return (
                <MetricasErrorState message={errorMessage} onRetry={onRetry} />
            );
        }

        const canExpand =
            initialVisibleRows !== undefined &&
            rows.length > initialVisibleRows;
        const visibleRows =
            expanded || initialVisibleRows === undefined
                ? rows
                : rows.slice(0, initialVisibleRows);

        return (
            <div className="overflow-hidden rounded-md border border-[#D8D8D8]">
                {bare && (
                    <div className="px-3 pt-3 text-sm font-bold text-[#111827]">
                        {title}
                    </div>
                )}
                <div className="px-3">
                    <table className="w-full table-fixed border-collapse">
                        <thead>
                            <tr className="border-b border-[#D8D8D8] text-sm text-[#111827]">
                                <th
                                    scope="col"
                                    className="pt-3 pb-2 text-left font-medium text-[#111827]"
                                >
                                    {firstColumnLabel}
                                </th>
                                <th
                                    scope="col"
                                    className="w-25 pt-3 pb-2 text-right font-medium text-[#111827]"
                                >
                                    {secondColumnLabel}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <tr key={row.label}>
                                    <td className="py-3 align-middle text-xs font-normal text-[#111827]">
                                        {row.label}
                                    </td>
                                    <td className="py-3 align-middle text-right text-sm font-medium text-[#111827]">
                                        {ptBrFormatter.format(row.value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
