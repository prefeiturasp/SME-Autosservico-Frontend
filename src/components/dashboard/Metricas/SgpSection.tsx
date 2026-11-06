import FrequenciasLancadasCard from "./FrequenciasLancadasCard";
import SondagensRealizadasCard from "./SondagensRealizadasCard";
import ConselhoDeClasseCard from "./ConselhoDeClasseCard";
import FechamentoSgpSection from "./FechamentoSgpSection";
import MetricasCollapsibleSection from "./MetricasCollapsibleSection";

type Props = {
  readonly systemName?: string;
};

export default function SgpSection({ systemName }: Props) {
  return (
    <div className="mb-8">
      <MetricasCollapsibleSection title="Fechamento">
        <FechamentoSgpSection systemName={systemName} />
        <ConselhoDeClasseCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <FrequenciasLancadasCard systemName={systemName} />
          <SondagensRealizadasCard systemName={systemName} />
        </div>
      </MetricasCollapsibleSection>
    </div>
  );
}
