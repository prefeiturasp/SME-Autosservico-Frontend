"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useSerieAcessosSgp } from "@/hooks/useControleAcessosSgp";
import type {
    GranularidadeAcessos,
    PontoSerieAcessos,
} from "@/types/sgpControleAcessos";
import { useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import GranularidadeAcessosSwitcher from "./GranularidadeAcessosSwitcher";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasMessage from "./MetricasMessage";

type Props = {
    readonly systemName?: string;
    readonly className?: string;
};

const LINE_COLOR = "#3B82F6";
const FILA_COLOR = "#970C0C";
const TICK_COLOR = "#6B7280";

const compactFormatter = new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat("pt-BR");

type DotProps = {
    readonly cx?: number;
    readonly cy?: number;
    readonly payload?: PontoSerieAcessos;
};

function PontoFila({ cx, cy, payload }: DotProps) {
    if (cx === undefined || cy === undefined) return null;
    const filaAtiva = payload?.filaAtiva;
    return (
        <circle
            cx={cx}
            cy={cy}
            r={filaAtiva ? 4 : 3}
            fill={filaAtiva ? FILA_COLOR : LINE_COLOR}
            stroke="none"
        />
    );
}

type TooltipProps = {
    readonly active?: boolean;
    readonly payload?: ReadonlyArray<{ payload: PontoSerieAcessos }>;
};

function TooltipConteudo({ active, payload }: TooltipProps) {
    const ponto = payload?.[0]?.payload;
    if (!active || !ponto) return null;
    return (
        <div className="rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-xs shadow-sm">
            <div className="font-bold text-[#111827]">{ponto.label}</div>
            <div>Total de acessos: {numberFormatter.format(ponto.total)}</div>
            {ponto.filaAtiva && (
                <div className="text-[#970C0C]">
                    Fila ativa (máx. {numberFormatter.format(ponto.emFilaMax)}{" "}
                    em espera)
                </div>
            )}
        </div>
    );
}

export default function AcompanhamentoAcessosCard({
    systemName,
    className,
}: Props) {
    const [granularidade, setGranularidade] =
        useState<GranularidadeAcessos>("hora");
    const { data, isLoading, isError, refetch } = useSerieAcessosSgp({
        systemName: systemName ?? "",
        granularidade,
    });

    const content = () => {
        if (!systemName) {
            return <MetricasMessage>Selecione um projeto</MetricasMessage>;
        }
        if (isLoading) {
            return <Skeleton className="h-[220px] w-full" />;
        }
        if (isError || !data) {
            return (
                <MetricasErrorState
                    message="Não foi possível carregar o acompanhamento de acessos."
                    onRetry={() => refetch()}
                />
            );
        }
        if (data.pontos.length === 0) {
            return (
                <MetricasMessage>
                    Aguardando os dados de acessos.
                </MetricasMessage>
            );
        }

        return (
            <>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart
                        data={data.pontos}
                        margin={{ top: 8, right: 16, left: 0 }}
                    >
                        <CartesianGrid vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="label"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: TICK_COLOR }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={40}
                            tick={{ fontSize: 12, fill: TICK_COLOR }}
                            tickFormatter={(valor: number) =>
                                compactFormatter.format(valor)
                            }
                        />
                        <Tooltip content={<TooltipConteudo />} />
                        <Line
                            type="linear"
                            dataKey="total"
                            stroke={LINE_COLOR}
                            strokeWidth={2}
                            dot={<PontoFila />}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-4 bg-[#3B82F6]" />
                        <span>Total de acessos no período</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block h-0.5 w-4 border-t-2 border-dashed border-[#970C0C]" />
                        <span>Ativação da fila de espera</span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <MetricasCardShell
            title="Acompanhamento de Acessos"
            className={className}
            action={
                <GranularidadeAcessosSwitcher
                    value={granularidade}
                    onChange={setGranularidade}
                />
            }
        >
            {content()}
        </MetricasCardShell>
    );
}
