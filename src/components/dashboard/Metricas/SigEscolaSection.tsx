"use client";

import type { Dispatch, SetStateAction } from "react";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import AcessoAtivoSigEscolaCard from "./AcessoAtivoSigEscolaCard";
import PlanoAnualDeAtividadesCard from "./PlanoAnualDeAtividadesCard";
import PrestacaoDeContasCard from "./PrestacaoDeContasCard";
import SigEscolaFiltrosBar from "./SigEscolaFiltrosBar";
import SituacaoPatrimonialCard from "./SituacaoPatrimonialCard";
import TotalAcessosHojeSigEscolaCard from "./TotalAcessosHojeSigEscolaCard";
import UsuariosUnicosSigEscolaCard from "./UsuariosUnicosSigEscolaCard";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly onFiltrosChange: Dispatch<SetStateAction<SigEscolaFiltros>>;
};

export default function SigEscolaSection({
  systemName,
  filtros,
  onFiltrosChange,
}: Props) {
  return (
    <div className="mb-8 space-y-4">
      <SigEscolaFiltrosBar value={filtros} onChange={onFiltrosChange} />
      <div className="grid grid-cols-3 gap-4">
        <AcessoAtivoSigEscolaCard systemName={systemName} filtros={filtros} />
        <UsuariosUnicosSigEscolaCard
          systemName={systemName}
          filtros={filtros}
        />
        <TotalAcessosHojeSigEscolaCard
          systemName={systemName}
          filtros={filtros}
        />
      </div>
      <PlanoAnualDeAtividadesCard systemName={systemName} filtros={filtros} />
      <PrestacaoDeContasCard systemName={systemName} filtros={filtros} />
      <SituacaoPatrimonialCard systemName={systemName} filtros={filtros} />
    </div>
  );
}
