import MetricasSectionHeader from "./MetricasSectionHeader";
import OportunidadesStatusGeralCard from "./OportunidadesStatusGeralCard";

type Props = {
  readonly systemName?: string;
};

export default function OportunidadesRecrutamentoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Oportunidades e recrutamento" />
      <OportunidadesStatusGeralCard systemName={systemName} />
    </section>
  );
}
