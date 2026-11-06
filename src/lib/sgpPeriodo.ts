import type {
  PeriodoSgpOption,
  SgpFiltroPeriodo,
  SgpSegmento,
} from "@/types/sgpMetricas";

export const SEGMENTOS_SGP: ReadonlyArray<SgpSegmento> = [
  "fundamental_medio",
  "eja",
];

// EJA é semestral, com 2 bimestres por semestre.
export const BIMESTRES_POR_SEGMENTO: Record<SgpSegmento, number> = {
  fundamental_medio: 4,
  eja: 2,
};

const BIMESTRE_POR_MES: Record<number, number> = {
  1: 1, 2: 1, 3: 1, 4: 1,
  5: 2, 6: 2, 7: 2,
  8: 3, 9: 3,
  10: 4, 11: 4, 12: 4,
};

// Mesma regra do periodo_corrente do BFF.
export function periodoCorrente(hoje = new Date()): {
  anoLetivo: number;
  bimestre: number;
} {
  return {
    anoLetivo: hoje.getFullYear(),
    bimestre: BIMESTRE_POR_MES[hoje.getMonth() + 1],
  };
}

// Formato: segmento:ano:semestre:bimestre
export function codificarPeriodoSgp(filtro: SgpFiltroPeriodo): string {
  return [
    filtro.segmento,
    filtro.anoLetivo,
    filtro.semestre ?? 0,
    filtro.bimestre,
  ].join(":");
}

export function decodificarPeriodoSgp(
  valor: string,
): SgpFiltroPeriodo | undefined {
  const [segmento, ano, semestre, bimestre] = valor.split(":");
  if (!SEGMENTOS_SGP.includes(segmento as SgpSegmento)) return undefined;
  const filtro: SgpFiltroPeriodo = {
    segmento: segmento as SgpSegmento,
    anoLetivo: Number(ano),
    semestre: segmento === "eja" ? Number(semestre) : null,
    bimestre: Number(bimestre),
  };
  const valido =
    Number.isInteger(filtro.anoLetivo) &&
    Number.isInteger(filtro.bimestre) &&
    filtro.bimestre >= 1 &&
    filtro.bimestre <= BIMESTRES_POR_SEGMENTO[filtro.segmento] &&
    (filtro.semestre === null ||
      filtro.semestre === 1 ||
      filtro.semestre === 2);
  return valido ? filtro : undefined;
}

// Ex.: "4º Bimestre de 2026" ou "EJA - 1º Bim. do 2º Sem. 2026"
export function rotuloPeriodoSgp(filtro: SgpFiltroPeriodo): string {
  if (filtro.segmento === "eja") {
    return `EJA - ${filtro.bimestre}º Bim. do ${filtro.semestre}º Sem. ${filtro.anoLetivo}`;
  }
  return `${filtro.bimestre}º Bimestre de ${filtro.anoLetivo}`;
}

// Último bimestre de Fund./Médio já iniciado. Sem opções (cache frio), o corrente.
export function periodoPadraoSgp(
  opcoes: ReadonlyArray<PeriodoSgpOption>,
  hoje = new Date(),
): string {
  const ultimo = opcoes
    .filter((opcao) => opcao.segmento === "fundamental_medio")
    .at(-1);
  if (ultimo) return ultimo.value;
  return codificarPeriodoSgp({
    ...periodoCorrente(hoje),
    segmento: "fundamental_medio",
    semestre: null,
  });
}
