import EscolhasStatusGeralCard from "./EscolhasStatusGeralCard";
import MetricasSectionHeader from "./MetricasSectionHeader";
import PercentualVagasPreenchidasCard from "./PercentualVagasPreenchidasCard";

type Props = {
  readonly systemName?: string;
};

export default function EscolhasSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Escolhas" />
      <div className="space-y-4">
        <EscolhasStatusGeralCard systemName={systemName} />
        <PercentualVagasPreenchidasCard systemName={systemName} />
      </div>
    </section>
  );
}
