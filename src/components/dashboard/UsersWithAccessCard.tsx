"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActiveAccessUsers } from "@/hooks/useActiveAccessUsers";
import { cn } from "@/lib/utils";

type Props = {
    readonly systemName?: string;
    readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function UsersWithAccessCard({ systemName, className }: Props) {
    const { data, isLoading, isFetching, isError, refetch } = useActiveAccessUsers({
        systemName: systemName ?? "",
    });

    const renderContent = () => {
        if (!systemName) {
            return (
                <div className="text-sm text-muted-foreground text-center">
                    Selecione um projeto
                </div>
            );
        }

        if (isLoading || isFetching) {
            return (
                <div className="flex flex-col items-center gap-2">
                    <Skeleton className="h-9 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
            );
        }

        if (isError || !data) {
            return (
                <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                        Não foi possível carregar os usuários com acesso.
                    </div>
                    <Button
                        onClick={() => refetch()}
                        variant="secondary"
                        size="sm"
                        className="mt-3"
                    >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            );
        }

        return (
            <div className="text-center">
                <div className="text-3xl font-bold text-[#3B82F6]">
                    {ptBrFormatter.format(data.activeCount)}
                </div>
                <div className="mt-1 text-sm text-[#6B7280]">
                    usuários cadastrados com acesso ativo
                </div>
            </div>
        );
    };

    return (
        <div
            className={cn(
                "bg-white rounded-[5px] shadow-[3px_4px_6px_0px_rgba(0,0,0,0.1)] p-5",
                className,
            )}
        >
            <div className="font-bold text-[14px] text-[#111827] mb-4">
                Usuários com acesso
            </div>
            {renderContent()}
        </div>
    );
}
