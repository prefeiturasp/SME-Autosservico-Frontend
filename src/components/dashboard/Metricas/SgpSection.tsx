import FrequenciasLancadasCard from "./FrequenciasLancadasCard";
import SondagensRealizadasCard from "./SondagensRealizadasCard";
import AcompanhamentoFechamentoCard from "./AcompanhamentoFechamentoCard";
import ConselhoDeClasseCard from "./ConselhoDeClasseCard";

type Props = {
  readonly systemName?: string;
};

export default function SgpSection({ systemName }: Props) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FrequenciasLancadasCard systemName={systemName} />
        <SondagensRealizadasCard systemName={systemName} />
      </div>
      <AcompanhamentoFechamentoCard systemName={systemName} />
      <ConselhoDeClasseCard systemName={systemName} />
    </div>
  );
}
