import MetricasSectionHeader from "./MetricasSectionHeader";
import OcorrenciasTratadasPorAnalistaCard from "./OcorrenciasTratadasPorAnalistaCard";
import OcorrenciasTratadasPorDreCard from "./OcorrenciasTratadasPorDreCard";
import ProdutividadeTotaisCard from "./ProdutividadeTotaisCard";

type Props = {
  readonly systemName?: string;
};

export default function ProdutividadeSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Produtividade" />
      <div className="space-y-4">
        <ProdutividadeTotaisCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <OcorrenciasTratadasPorAnalistaCard systemName={systemName} />
          <OcorrenciasTratadasPorDreCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
