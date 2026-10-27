"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { anoCorrente, PRIMEIRO_ANO_GIPE, useGipeFiltros } from "@/states/gipe";
import AcessoAtivoGipeCard from "./AcessoAtivoGipeCard";
import TotalAcessosHojeGipeCard from "./TotalAcessosHojeGipeCard";
import UsuariosUnicosGipeCard from "./UsuariosUnicosGipeCard";

type Props = {
  readonly systemName?: string;
};

/** Anos com ocorrências no GIPE, do corrente ao primeiro. */
const anosDisponiveis = () =>
  Array.from(
    { length: anoCorrente() - PRIMEIRO_ANO_GIPE + 1 },
    (_, i) => anoCorrente() - i,
  );

/**
 * Topo da aba Métricas do GIPE: o filtro de ano letivo (discovery do GIPE,
 * §7) e os três KPIs de usuário do mockup. O ano vai para o store e todos
 * os hooks do GIPE passam a consultar aquele ano.
 */
export default function GipeResumoSection({ systemName }: Props) {
  const anoLetivo = useGipeFiltros((state) => state.anoLetivo);
  const setAnoLetivo = useGipeFiltros((state) => state.setAnoLetivo);

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={String(anoLetivo)}
          onValueChange={(ano) => setAnoLetivo(Number(ano))}
        >
          <SelectTrigger
            className="h-9 w-[160px]"
            aria-label="Selecionar ano letivo"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {anosDisponiveis().map((ano) => (
              <SelectItem key={ano} value={String(ano)}>
                {`Ano ${ano}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-[#6B7280]">
          O ano filtra ocorrências e produtividade, exceto anexos enviados e
          ocorrências sem movimentação há 7 dias
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <AcessoAtivoGipeCard systemName={systemName} />
        <UsuariosUnicosGipeCard systemName={systemName} />
        <TotalAcessosHojeGipeCard systemName={systemName} />
      </div>
    </div>
  );
}
