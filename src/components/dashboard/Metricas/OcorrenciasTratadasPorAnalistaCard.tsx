"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOcorrenciasTratadasPorAnalista } from "@/hooks/useOcorrenciasTratadasPorAnalista";
import { useState } from "react";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasExpandToggle from "./MetricasExpandToggle";
import MetricasMessage from "./MetricasMessage";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3"];
const INITIAL_VISIBLE_ROWS = 5;
const TITLE = "Ocorrências tratadas por analista";

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function OcorrenciasTratadasPorAnalistaCard({
  systemName,
  className,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, isFetching, isError, refetch } =
    useOcorrenciasTratadasPorAnalista({
      systemName: systemName ?? "",
    });

  const renderContent = () => {
    if (!systemName) {
      return <MetricasMessage>Selecione um projeto</MetricasMessage>;
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-3">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-5 w-full" />
          ))}
        </div>
      );
    }

    if (isError || !data) {
      return (
        <MetricasErrorState
          message="Não foi possível carregar as ocorrências tratadas por analista."
          onRetry={() => refetch()}
        />
      );
    }

    const canExpand = data.length > INITIAL_VISIBLE_ROWS;
    const visibleRows = expanded ? data : data.slice(0, INITIAL_VISIBLE_ROWS);

    return (
      <div className="overflow-hidden rounded-md border border-[#D8D8D8]">
        <div className="px-3">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="border-b border-[#D8D8D8] text-sm text-[#111827]">
                <th
                  scope="col"
                  className="pt-3 pb-2 text-left font-medium text-[#111827]"
                >
                  Analista
                </th>
                <th
                  scope="col"
                  className="w-32 pt-3 pb-2 text-right font-medium text-[#111827]"
                >
                  Ocorrências tratadas
                </th>
                <th
                  scope="col"
                  className="w-25 pt-3 pb-2 text-right font-medium text-[#111827]"
                >
                  Tempo médio
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.analista}>
                  <td className="py-3 align-middle text-xs font-normal text-[#111827]">
                    {row.analista}
                  </td>
                  <td className="py-3 align-middle text-right text-sm font-medium text-[#111827]">
                    {ptBrFormatter.format(row.ocorrenciasTratadas)}
                  </td>
                  <td className="py-3 align-middle text-right text-sm font-medium text-[#111827]">
                    {row.tempoMedio}
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
            expandLabel="Ver mais analistas"
            collapseLabel="Ver menos analistas"
          />
        )}
      </div>
    );
  };

  return (
    <MetricasCardShell title={TITLE} className={className}>
      {renderContent()}
    </MetricasCardShell>
  );
}
