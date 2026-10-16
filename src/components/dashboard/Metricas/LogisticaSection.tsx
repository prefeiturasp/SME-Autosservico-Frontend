import CronogramasEntregasCard from "./CronogramasEntregasCard";
import FichasTecnicasProdutosCard from "./FichasTecnicasProdutosCard";
import FornecedoresDistribuidoresCard from "./FornecedoresDistribuidoresCard";
import LayoutsEmbalagensCard from "./LayoutsEmbalagensCard";
import MetricasSectionHeader from "./MetricasSectionHeader";

type Props = {
  readonly systemName?: string;
};

export default function LogisticaSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Logística" />
      <div className="space-y-4">
        <CronogramasEntregasCard systemName={systemName} />
        <FichasTecnicasProdutosCard systemName={systemName} />
        <FornecedoresDistribuidoresCard systemName={systemName} />
        <LayoutsEmbalagensCard systemName={systemName} />
      </div>
    </section>
  );
}
