import AcessoAtivoSigEscolaCard from "./AcessoAtivoSigEscolaCard";
import PrestacaoDeContasCard from "./PrestacaoDeContasCard";
import UesAptasPrestarContasSigEscolaCard from "./UesAptasPrestarContasSigEscolaCard";
import UsuariosUnicosSigEscolaCard from "./UsuariosUnicosSigEscolaCard";

type Props = {
  readonly systemName?: string;
};

export default function SigEscolaSection({ systemName }: Props) {
  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <AcessoAtivoSigEscolaCard systemName={systemName} />
        <UsuariosUnicosSigEscolaCard systemName={systemName} />
        <UesAptasPrestarContasSigEscolaCard systemName={systemName} />
      </div>
      <PrestacaoDeContasCard systemName={systemName} />
    </div>
  );
}
