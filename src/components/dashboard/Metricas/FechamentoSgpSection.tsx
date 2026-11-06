"use client";

import { usePeriodoSgp } from "@/hooks/usePeriodosSgp";
import type { FechamentoSituacao } from "@/types/sgpMetricas";
import AcompanhamentoFechamentoCard from "./AcompanhamentoFechamentoCard";
import FechamentoPorDreCard from "./FechamentoPorDreCard";

type Props = {
  readonly systemName?: string;
};

const GRAFICOS_POR_DRE: ReadonlyArray<{
  titulo: string;
  situacao: FechamentoSituacao;
  legenda: string;
  cor: string;
}> = [
  {
    titulo: "Fechamentos Não iniciados por DRE",
    situacao: "naoIniciados",
    legenda: "Não iniciados",
    cor: "#1E3A8A",
  },
  {
    titulo: "Fechamentos Processados com sucesso por DRE",
    situacao: "processadoSucesso",
    legenda: "Processado com sucesso",
    cor: "#075A3E",
  },
  {
    titulo: "Fechamentos Processados com pendências por DRE",
    situacao: "processadoPendencias",
    legenda: "Processado com pendências",
    cor: "#9C6507",
  },
  {
    titulo: "Fechamentos Processados com erros por DRE",
    situacao: "processadoErro",
    legenda: "Processado com erros",
    cor: "#970C0C",
  },
];

export default function FechamentoSgpSection({ systemName }: Props) {
  const { periodo, setPeriodo, opcoes } = usePeriodoSgp(systemName ?? "");

  return (
    <>
      <AcompanhamentoFechamentoCard
        systemName={systemName}
        periodo={periodo}
        opcoes={opcoes}
        onPeriodoChange={setPeriodo}
      />
      <div className="grid grid-cols-2 gap-4">
        {GRAFICOS_POR_DRE.map((grafico) => (
          <FechamentoPorDreCard
            key={grafico.situacao}
            systemName={systemName}
            periodo={periodo}
            {...grafico}
          />
        ))}
      </div>
    </>
  );
}
