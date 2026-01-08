"use client";

import { useState } from "react";
import { RotateCcw, ChevronDown, Circle, Clock, Check, Bug, ListTodo, FileText, Rocket, Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import type { BacklogResponse, WorkItem } from "@/types/backlog";

type BugStatus = "Aberto" | "Em andamento" | "Resolvido";

function getStatusFromState(state?: string): BugStatus {
    if (!state) return "Aberto";
    const normalized = state.toLowerCase();
    if (normalized.includes("resolved") || normalized.includes("closed") || normalized.includes("done") || normalized.includes("resolvido") || normalized.includes("fechado")) {
        return "Resolvido";
    }
    if (normalized.includes("active") || normalized.includes("progress") || normalized.includes("andamento") || normalized.includes("ativo")) {
        return "Em andamento";
    }
    return "Aberto";
}

function StatusBadge({ status }: { readonly status: BugStatus }) {
    const styles: Record<BugStatus, { container: string; iconColor: string }> = {
        "Aberto": {
            container: "bg-[#F5F5F5] border border-[#D8D8D8] text-[#111827]",
            iconColor: "text-[#6B7280]",
        },
        "Em andamento": {
            container: "bg-[#FEF3C7] border border-[#F59E0B] text-[#92400E]",
            iconColor: "text-[#F59E0B]",
        },
        "Resolvido": {
            container: "bg-[#22C55E] text-white",
            iconColor: "text-white",
        },
    };

    const icons: Record<BugStatus, typeof Circle> = {
        "Aberto": Circle,
        "Em andamento": Clock,
        "Resolvido": Check,
    };

    const { container, iconColor } = styles[status];
    const Icon = icons[status];

    return (
        <span className={cn("inline-flex items-center justify-start gap-1.5 rounded-full px-3 text-[12px] font-medium h-[20px] whitespace-nowrap", container)}>
            <Icon className={cn("h-3.5 w-3.5", iconColor)} />
            {status}
        </span>
    );
}

function getWorkItemTypeConfig(workItemType?: string) {
    if (!workItemType) return { color: "text-[#6B7280]", icon: FileText, label: "Item" };
    
    const normalized = workItemType.toLowerCase();
    
    if (normalized.includes("bug")) {
        return { color: "text-[#EF4444]", icon: Bug, label: "Bug" };
    }
    if (normalized.includes("task") || normalized.includes("tarefa")) {
        return { color: "text-[#3B82F6]", icon: ListTodo, label: "Tarefa" };
    }
    if (normalized.includes("product backlog item") || normalized.includes("pbi")) {
        return { color: "text-[#8B5CF6]", icon: FileText, label: "Item do Backlog" };
    }
    if (normalized.includes("user story") || normalized.includes("história")) {
        return { color: "text-[#8B5CF6]", icon: FileText, label: "História" };
    }
    if (normalized.includes("feature")) {
        return { color: "text-[#22C55E]", icon: Rocket, label: "Funcionalidade" };
    }
    if (normalized.includes("epic")) {
        return { color: "text-[#F59E0B]", icon: Flag, label: "Épico" };
    }
    
    return { color: "text-[#6B7280]", icon: FileText, label: workItemType };
}

function WorkItemTypeLabel({ workItemType }: { readonly workItemType?: string }) {
    const { color, icon: Icon, label } = getWorkItemTypeConfig(workItemType);

    return (
        <span className={cn("inline-flex items-center gap-1.5 text-[12px] font-medium", color)}>
            <Icon className="h-4 w-4" />
            {label}
        </span>
    );
}

type Props = {
    readonly title?: string;
    readonly className?: string;
    readonly projectName?: string;
    readonly query: UseQueryResult<BacklogResponse, unknown>;
    readonly emptyProjectHint?: string;
    readonly initialVisibleCount?: number;
};

export default function BacklogCard({
    title,
    className,
    projectName,
    query,
    emptyProjectHint = "Selecione um projeto",
    initialVisibleCount = 10,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } = query;
    const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

    const cardClasses = cn("bg-white rounded-[5px] p-5", className);

    if (!projectName) {
        return (
            <div className={cn(cardClasses, className)}>
                <div className="flex items-center justify-between mb-4">
                    {title && <span className="font-bold text-[14px] text-[#111827]">{title}</span>}
                </div>
                <div className="text-sm text-[#6B7280] text-center py-8">{emptyProjectHint}</div>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className={cn(cardClasses, className)}>
                <div className="flex items-center justify-between mb-4">
                    {title && <span className="font-bold text-[14px] text-[#111827]">{title}</span>}
                </div>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center">
                            <Skeleton className="h-4 w-16 mr-8" />
                            <Skeleton className="h-4 flex-1 mr-8" />
                            <Skeleton className="h-7 w-[120px] rounded-full mr-8" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={cn(cardClasses, className)}>
                <div className="flex items-center justify-between mb-4">
                    {title && <span className="font-bold text-[14px] text-[#111827]">{title}</span>}
                </div>
                <div className="text-sm text-[#6B7280] text-center py-4">
                    Não foi possível carregar os dados.
                </div>
                <div className="flex justify-center">
                    <Button onClick={() => refetch()} variant="secondary" size="sm">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    const allItems: WorkItem[] = [...data.parents, ...data.children];
    const items = allItems;

    if (items.length === 0) {
        return (
            <div className={cn(cardClasses, className)}>
                <div className="flex items-center justify-between mb-2">
                    {title && <span className="font-bold text-[14px] text-[#111827]">{title}</span>}
                </div>
                <div className="text-sm text-[#6B7280] text-center py-8">
                    Nenhum item encontrado para este projeto.
                </div>
            </div>
        );
    }

    const displayedItems = items.slice(0, visibleCount);
    const hasMore = items.length > visibleCount;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + initialVisibleCount);
    };

    return (
        <div className={cn(cardClasses, className)}>
            <div className="flex items-center justify-between mb-5">
                {title && <span className="font-bold text-[14px] text-[#111827]">{title}</span>}
            </div>

            <table className="w-full">
                <thead>
                    <tr className="border-b border-[#D8D8D8]">
                        <th className="text-left font-medium text-[14px] text-[#111827] pb-3 w-[80px]">
                            Código
                        </th>
                        <th className="text-left font-medium text-[14px] text-[#111827] pb-3">
                            Título
                        </th>
                        <th className="text-left font-medium text-[14px] text-[#111827] pb-3 w-[140px] pr-6">
                            Status
                        </th>
                        <th className="text-left font-medium text-[14px] text-[#111827] pb-3 w-[130px]">
                            Classificação
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {displayedItems.map((item) => {
                        const status = getStatusFromState(item.state);

                        return (
                            <tr key={item.id}>
                                <td className="py-4 align-middle">
                                    <span className="text-[14px] text-[#111827] font-normal">
                                        {item.id}
                                    </span>
                                </td>
                                <td className="py-4 align-middle pr-4">
                                    <span className="text-[12px] text-[#111827] font-normal">
                                        {item.title}
                                    </span>
                                </td>
                                <td className="py-4 align-middle pr-6">
                                    <StatusBadge status={status} />
                                </td>
                                <td className="py-4 align-middle">
                                    <WorkItemTypeLabel workItemType={item.work_item_type} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {hasMore && (
                <div className="border-t border-[#D8D8D8] mt-4 pt-4">
                    <button
                        onClick={handleShowMore}
                        className="w-full flex items-center justify-center gap-1 text-[12px] font-semibold text-[#111827] hover:text-[#3B82F6] transition-colors"
                    >
                        <ChevronDown className="h-4 w-4" />
                        Exibir mais
                    </button>
                </div>
            )}
        </div>
    );
}
