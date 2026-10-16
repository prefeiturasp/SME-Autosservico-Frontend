import MetricasSectionHeader from "./MetricasSectionHeader";
import OcorrenciasStatusGeralCard from "./OcorrenciasStatusGeralCard";

type Props = {
  readonly systemName?: string;
};

export default function OcorrenciasSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Ocorrências" />
      <div className="space-y-4">
        <OcorrenciasStatusGeralCard systemName={systemName} />
      </div>
    </section>
  );
}
