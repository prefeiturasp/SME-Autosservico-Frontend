import ConvocacaoStatusGeralCard from "./ConvocacaoStatusGeralCard";
import MetricasSectionHeader from "./MetricasSectionHeader";

type Props = {
  readonly systemName?: string;
};

export default function ConvocacaoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Convocação" />
      <div className="space-y-4">
        <ConvocacaoStatusGeralCard systemName={systemName} />
      </div>
    </section>
  );
}
