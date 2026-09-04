import ConvocacoesPorAnoCard from "./ConvocacoesPorAnoCard";
import ConvocacoesPorCargoCard from "./ConvocacoesPorCargoCard";
import ConvocacoesPorConcursoCard from "./ConvocacoesPorConcursoCard";
import ConvocacoesPorDreCard from "./ConvocacoesPorDreCard";
import MetricasSectionHeader from "./MetricasSectionHeader";

type Props = {
  readonly systemName?: string;
};

export default function GestaoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Gestão" />
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <ConvocacoesPorConcursoCard systemName={systemName} />
          <ConvocacoesPorCargoCard systemName={systemName} />
          <ConvocacoesPorAnoCard systemName={systemName} />
          <ConvocacoesPorDreCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
