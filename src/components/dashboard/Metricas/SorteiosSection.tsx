import MetricasSectionHeader from "./MetricasSectionHeader";
import SorteiosPorDreCard from "./SorteiosPorDreCard";
import SorteiosPorGanhadorCard from "./SorteiosPorGanhadorCard";
import SorteiosPorTipoCard from "./SorteiosPorTipoCard";
import SorteiosStatusGeralCard from "./SorteiosStatusGeralCard";

type Props = {
  readonly systemName?: string;
};

export default function SorteiosSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Sorteios" />
      <div className="space-y-4">
        <SorteiosStatusGeralCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <SorteiosPorTipoCard systemName={systemName} />
          <SorteiosPorGanhadorCard systemName={systemName} />
        </div>
        <SorteiosPorDreCard systemName={systemName} />
      </div>
    </section>
  );
}
