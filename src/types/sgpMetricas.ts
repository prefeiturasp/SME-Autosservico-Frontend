import type { StatItem } from "@/types/metricas";

export type SgpSegmento = "fundamental_medio" | "eja";

export type SgpFiltroPeriodo = {
  anoLetivo: number;
  segmento: SgpSegmento;
  semestre: number | null;
  bimestre: number;
};

export type PeriodoSgpOption = {
  value: string;
  label: string;
  segmento: SgpSegmento;
};

export type FechamentoSituacao =
  | "naoIniciados"
  | "processadoSucesso"
  | "processadoPendencias"
  | "processadoErro";

export type FechamentoPorDre = {
  dre: string;
  previsto: number;
} & Record<FechamentoSituacao, number>;

export type AcompanhamentoFechamentoResponse = {
  itens: StatItem[];
  porDre: FechamentoPorDre[];
};
