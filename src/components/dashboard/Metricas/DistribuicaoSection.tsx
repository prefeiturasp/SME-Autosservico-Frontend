import MetricasSectionHeader from "./MetricasSectionHeader";
import OcorrenciasPorCategoriaCard from "./OcorrenciasPorCategoriaCard";
import OcorrenciasPorDreCard from "./OcorrenciasPorDreCard";
import OcorrenciasPorMesCard from "./OcorrenciasPorMesCard";
import OcorrenciasPorPeriodoLetivoCard from "./OcorrenciasPorPeriodoLetivoCard";
import OcorrenciasPorTipoCard from "./OcorrenciasPorTipoCard";
import OcorrenciasPorUnidadeEducacionalCard from "./OcorrenciasPorUnidadeEducacionalCard";

type Props = {
  readonly systemName?: string;
};

export default function DistribuicaoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Distribuição" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <OcorrenciasPorDreCard systemName={systemName} />
          <OcorrenciasPorUnidadeEducacionalCard systemName={systemName} />
        </div>
        <OcorrenciasPorCategoriaCard systemName={systemName} />
        <OcorrenciasPorTipoCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <OcorrenciasPorMesCard systemName={systemName} />
          <OcorrenciasPorPeriodoLetivoCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
