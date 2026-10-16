import MetricasSectionHeader from "./MetricasSectionHeader";
import PrazosMovimentacoesCard from "./PrazosMovimentacoesCard";
import TempoDeRespostaCard from "./TempoDeRespostaCard";

type Props = {
  readonly systemName?: string;
};

export default function FluxoDeAtendimentoSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Fluxo de atendimento" />
      <div className="space-y-4">
        <TempoDeRespostaCard systemName={systemName} />
        <PrazosMovimentacoesCard systemName={systemName} />
      </div>
    </section>
  );
}
