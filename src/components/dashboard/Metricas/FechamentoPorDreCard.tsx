"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAcompanhamentoFechamento } from "@/hooks/useAcompanhamentoFechamento";
import type { FechamentoSituacao } from "@/types/sgpMetricas";
import {
    Bar,
    BarChart,
    LabelList,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasMessage from "./MetricasMessage";

type Props = {
    readonly systemName?: string;
    readonly periodo: string;
    readonly titulo: string;
    readonly situacao: FechamentoSituacao;
    readonly legenda: string;
    readonly cor: string;
    readonly className?: string;
};

const PREVISTO_COLOR = "#D1D5DB";
const TICK_COLOR = "#6B7280";

const compactFormatter = new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
});
const numberFormatter = new Intl.NumberFormat("pt-BR");

type Ponto = {
    dre: string;
    previsto: number;
    valor: number;
    percentual: number;
};

type TooltipProps = {
    readonly active?: boolean;
    readonly payload?: ReadonlyArray<{ payload: Ponto }>;
    readonly legenda: string;
};

function TooltipConteudo({ active, payload, legenda }: TooltipProps) {
    const ponto = payload?.[0]?.payload;
    if (!active || !ponto) return null;
    return (
        <div className="rounded-md border border-[#D8D8D8] bg-white px-3 py-2 text-xs shadow-sm">
            <div className="font-bold text-[#111827]">{ponto.dre}</div>
            <div>Total previsto: {numberFormatter.format(ponto.previsto)}</div>
            <div>
                Total {legenda.toLowerCase()}:{" "}
                {numberFormatter.format(ponto.valor)}
            </div>
        </div>
    );
}

export default function FechamentoPorDreCard({
    systemName,
    periodo,
    titulo,
    situacao,
    legenda,
    cor,
    className,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } =
        useAcompanhamentoFechamento({ systemName: systemName ?? "", periodo });

    const content = () => {
        if (!systemName) {
            return <MetricasMessage>Selecione um projeto</MetricasMessage>;
        }
        if (isLoading || isFetching) {
            return <Skeleton className="h-[220px] w-full" />;
        }
        if (isError || !data) {
            return (
                <MetricasErrorState
                    message="Não foi possível carregar os fechamentos por DRE."
                    onRetry={() => refetch()}
                />
            );
        }
        if (data.porDre.length === 0) {
            return (
                <MetricasMessage>Sem fechamentos no período.</MetricasMessage>
            );
        }

        const pontos: Ponto[] = data.porDre.map((linha) => ({
            dre: linha.dre,
            previsto: linha.previsto,
            valor: linha[situacao],
            percentual:
                linha.previsto > 0
                    ? Math.round((linha[situacao] / linha.previsto) * 100)
                    : 0,
        }));

        return (
            <>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={pontos} barGap={2} barCategoryGap="20%">
                        <XAxis
                            dataKey="dre"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: TICK_COLOR }}
                        />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: "#F3F4F6" }}
                            content={<TooltipConteudo legenda={legenda} />}
                        />
                        <Bar
                            dataKey="previsto"
                            fill={PREVISTO_COLOR}
                            radius={[2, 2, 0, 0]}
                        >
                            <LabelList
                                dataKey="previsto"
                                position="top"
                                fontSize={10}
                                fill={TICK_COLOR}
                                formatter={(valor) =>
                                    compactFormatter.format(Number(valor))
                                }
                            />
                        </Bar>
                        <Bar dataKey="valor" fill={cor} radius={[2, 2, 0, 0]}>
                            <LabelList
                                dataKey="percentual"
                                position="top"
                                fontSize={10}
                                fill={TICK_COLOR}
                                formatter={(valor) => `${Number(valor)}%`}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center gap-4 pt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-3 w-3 rounded-sm"
                            style={{ backgroundColor: PREVISTO_COLOR }}
                        />
                        <span>Previstos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span
                            className="inline-block h-3 w-3 rounded-sm"
                            style={{ backgroundColor: cor }}
                        />
                        <span>{legenda}</span>
                    </div>
                </div>
            </>
        );
    };

    return (
        <MetricasCardShell title={titulo} className={className}>
            {content()}
        </MetricasCardShell>
    );
}
