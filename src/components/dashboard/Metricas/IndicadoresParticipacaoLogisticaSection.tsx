import IndicadoresParticipacaoLogisticaCard from "./IndicadoresParticipacaoLogisticaCard";

type Props = {
  readonly systemName?: string;
};

export default function IndicadoresParticipacaoLogisticaSection({
  systemName,
}: Props) {
  return (
    <div className="mb-8">
      <IndicadoresParticipacaoLogisticaCard systemName={systemName} />
    </div>
  );
}
