"use client";

import { usePrestacaoDeContas } from "@/hooks/usePrestacaoDeContas";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import MetricasCardShell from "./MetricasCardShell";
import MetricasErrorState from "./MetricasErrorState";
import MetricasMessage from "./MetricasMessage";
import MetricasStatSkeletonBox from "./MetricasStatSkeletonBox";
import StatItemBox from "./StatItemBox";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly className?: string;
};

const DESTAQUE_SKELETON_KEYS = ["destaque-skeleton-1", "destaque-skeleton-2"];
const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

export default function PrestacaoDeContasCard({
  systemName,
  filtros,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    usePrestacaoDeContas({
      systemName: systemName ?? "",
      filtros,
    });

  const renderContent = () => {
    if (!systemName) {
      return <MetricasMessage>Selecione um projeto</MetricasMessage>;
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {DESTAQUE_SKELETON_KEYS.map((key) => (
              <MetricasStatSkeletonBox key={key} />
            ))}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {SKELETON_KEYS.map((key) => (
              <MetricasStatSkeletonBox key={key} />
            ))}
          </div>
        </div>
      );
    }

    if (isError || !data) {
      return (
        <MetricasErrorState
          message="Não foi possível carregar a prestação de contas."
          onRetry={() => refetch()}
        />
      );
    }

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {data.destaque.map((item) => (
            <StatItemBox key={item.label} item={item} />
          ))}
        </div>
        <div className="grid grid-cols-4 gap-3">
          {data.items.map((item) => (
            <StatItemBox key={item.label} item={item} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <MetricasCardShell title="Prestação de contas" className={className}>
      {renderContent()}
    </MetricasCardShell>
  );
}
