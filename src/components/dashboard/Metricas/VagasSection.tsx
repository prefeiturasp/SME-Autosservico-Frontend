import FluxoDeVagasCard from "./FluxoDeVagasCard";
import MetricasSectionHeader from "./MetricasSectionHeader";

type Props = {
  readonly systemName?: string;
};

export default function VagasSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Vagas" />
      <div className="space-y-4">
        <FluxoDeVagasCard systemName={systemName} />
      </div>
    </section>
  );
}
