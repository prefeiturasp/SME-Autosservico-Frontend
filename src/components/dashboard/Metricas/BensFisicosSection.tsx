import AcessoAtivoBensFisicosCard from "./AcessoAtivoBensFisicosCard";
import BaixasFisicasCard from "./BaixasFisicasCard";
import CadastroDeBensCard from "./CadastroDeBensCard";
import MovimentacoesTransferenciasCard from "./MovimentacoesTransferenciasCard";
import UsuariosUnicosBensFisicosCard from "./UsuariosUnicosBensFisicosCard";

type Props = {
  readonly systemName?: string;
};

export default function BensFisicosSection({ systemName }: Props) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <AcessoAtivoBensFisicosCard systemName={systemName} />
        <UsuariosUnicosBensFisicosCard systemName={systemName} />
      </div>
      <CadastroDeBensCard systemName={systemName} />
      <BaixasFisicasCard systemName={systemName} />
      <MovimentacoesTransferenciasCard systemName={systemName} />
    </div>
  );
}
