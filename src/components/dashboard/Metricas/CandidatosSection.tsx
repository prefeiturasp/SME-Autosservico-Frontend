import CandidatosStatusGeralCard from "./CandidatosStatusGeralCard";
import MetricasSectionHeader from "./MetricasSectionHeader";

type Props = {
  readonly systemName?: string;
};

export default function CandidatosSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Candidatos" />
      <div className="space-y-4">
        <CandidatosStatusGeralCard systemName={systemName} />
      </div>
    </section>
  );
}
