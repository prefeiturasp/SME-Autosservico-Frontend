import ContratosCard from "./ContratosCard";
import FechamentosCard from "./FechamentosCard";
import OcorrenciasPorPrestadorCard from "./OcorrenciasPorPrestadorCard";
import ValoresPagosPorPrestadorCard from "./ValoresPagosPorPrestadorCard";

type Props = {
  readonly systemName?: string;
};

export default function LimpezaSection({ systemName }: Props) {
  return (
    <div className="mb-8 space-y-4">
      <FechamentosCard systemName={systemName} />
      <OcorrenciasPorPrestadorCard systemName={systemName} />
      <ValoresPagosPorPrestadorCard systemName={systemName} />
      <ContratosCard systemName={systemName} />
    </div>
  );
}
