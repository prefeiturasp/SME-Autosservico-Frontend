import AcessoAtivoBensFisicosCard from "./AcessoAtivoBensFisicosCard";
import BaixasFisicasCard from "./BaixasFisicasCard";
import CadastroDeBensCard from "./CadastroDeBensCard";
import MovimentacoesTransferenciasCard from "./MovimentacoesTransferenciasCard";
import UesAptasPrestarContasCard from "./UesAptasPrestarContasCard";
import UsuariosUnicosBensFisicosCard from "./UsuariosUnicosBensFisicosCard";

type Props = {
  readonly systemName?: string;
};

export default function BensFisicosSection({ systemName }: Props) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <AcessoAtivoBensFisicosCard systemName={systemName} />
        <UsuariosUnicosBensFisicosCard systemName={systemName} />
        <UesAptasPrestarContasCard systemName={systemName} />
      </div>
      <CadastroDeBensCard systemName={systemName} />
      <BaixasFisicasCard systemName={systemName} />
      <MovimentacoesTransferenciasCard systemName={systemName} />
    </div>
  );
}
