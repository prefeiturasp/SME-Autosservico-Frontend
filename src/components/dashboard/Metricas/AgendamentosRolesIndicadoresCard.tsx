"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAgendamentosRolesIndicadores } from "@/hooks/useAgendamentosRolesIndicadores";
import { cn } from "@/lib/utils";
import AgendamentosPorDreCard from "./AgendamentosPorDreCard";
import StatsCard from "./StatsCard";

type Props = {
    readonly systemName?: string;
    readonly className?: string;
};

export default function AgendamentosRolesIndicadoresCard({
    systemName,
    className,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } =
        useAgendamentosRolesIndicadores({
            systemName: systemName ?? "",
        });

    return (
        <Card
            className={cn(
                "rounded-md border-0 shadow-[3px_4px_6px_0px_#0000001A] gap-3 py-4 px-1",
                className,
            )}
        >
            <CardHeader className="pb-1 px-4">
                <CardTitle className="text-sm font-bold text-[#111827]">
                    Agendamentos e Rolês
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                {systemName ? (
                    <div className="space-y-4">
                        <StatsCard
                            bare
                            title="Agendamentos e Rolês"
                            systemName={systemName}
                            isLoading={isLoading || isFetching}
                            isError={isError}
                            onRetry={() => refetch()}
                            errorMessage="Não foi possível carregar os indicadores de agendamentos e rolês."
                            items={data?.items}
                        />
                        <AgendamentosPorDreCard bare systemName={systemName} />
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground">
                        Selecione um projeto
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
