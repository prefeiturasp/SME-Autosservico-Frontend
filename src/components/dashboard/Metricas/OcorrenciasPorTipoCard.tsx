"use client";

import MetricasCardShell from "./MetricasCardShell";
import MetricasMessage from "./MetricasMessage";
import OcorrenciaInterpessoalCard from "./OcorrenciaInterpessoalCard";
import OcorrenciaPatrimonialCard from "./OcorrenciaPatrimonialCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OcorrenciasPorTipoCard({ systemName, className }: Props) {
  return (
    <MetricasCardShell title="Ocorrências por tipo" className={className}>
      {systemName ? (
        <div className="grid grid-cols-2 gap-4">
          <OcorrenciaPatrimonialCard bare systemName={systemName} />
          <OcorrenciaInterpessoalCard bare systemName={systemName} />
        </div>
      ) : (
        <MetricasMessage>Selecione um projeto</MetricasMessage>
      )}
    </MetricasCardShell>
  );
}
