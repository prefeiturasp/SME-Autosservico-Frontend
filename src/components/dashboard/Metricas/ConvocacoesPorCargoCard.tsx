"use client";

import { useConvocacoesPorCargo } from "@/hooks/useConvocacoesPorCargo";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
    readonly systemName?: string;
    readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function ConvocacoesPorCargoCard({
    systemName,
    className,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } =
        useConvocacoesPorCargo({
            systemName: systemName ?? "",
        });

    return (
        <MetricasTableCard
            title="Convocações por cargo"
            systemName={systemName}
            isLoading={isLoading || isFetching}
            isError={isError}
            onRetry={() => refetch()}
            errorMessage="Não foi possível carregar as convocações por cargo."
            rows={data}
            firstColumnLabel="Prestador"
            secondColumnLabel="Convocações"
            initialVisibleRows={INITIAL_VISIBLE_ROWS}
            className={className}
        />
    );
}
