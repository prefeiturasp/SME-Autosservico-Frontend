import MetricasSectionHeader from "./MetricasSectionHeader";
import PerfisMaisUtilizadosCard from "./PerfisMaisUtilizadosCard";
import TotalDeUsuariosCard from "./TotalDeUsuariosCard";
import UsuariosPorDreCard from "./UsuariosPorDreCard";
import UsuariosPorTipoDePerfilCard from "./UsuariosPorTipoDePerfilCard";
import UsuariosPorUnidadeEducacionalCard from "./UsuariosPorUnidadeEducacionalCard";

type Props = {
  readonly systemName?: string;
};

export default function UsuariosSection({ systemName }: Props) {
  return (
    <section className="mb-8">
      <MetricasSectionHeader title="Usuários" />
      <div className="space-y-4">
        <TotalDeUsuariosCard systemName={systemName} />
        <div className="grid grid-cols-2 gap-4">
          <UsuariosPorTipoDePerfilCard systemName={systemName} />
          <PerfisMaisUtilizadosCard systemName={systemName} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <UsuariosPorDreCard systemName={systemName} />
          <UsuariosPorUnidadeEducacionalCard systemName={systemName} />
        </div>
      </div>
    </section>
  );
}
