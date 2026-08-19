import MetricasSectionHeader from "./MetricasSectionHeader";
import OrdemInscricaoPorDreCard from "./OrdemInscricaoPorDreCard";
import OrdemInscricaoPorGanhadorCard from "./OrdemInscricaoPorGanhadorCard";
import OrdemInscricaoPorTipoCard from "./OrdemInscricaoPorTipoCard";
import OrdemInscricaoStatusGeralCard from "./OrdemInscricaoStatusGeralCard";

type Props = {
  readonly systemName?: string;
};

export default function OrdemInscricaoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Ordem de inscrição" />
      <div className="space-y-4">
        <OrdemInscricaoStatusGeralCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <OrdemInscricaoPorTipoCard systemName={systemName} />
          <OrdemInscricaoPorGanhadorCard systemName={systemName} />
        </div>
        <OrdemInscricaoPorDreCard systemName={systemName} />
      </div>
    </section>
  );
}
