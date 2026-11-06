export type GranularidadeAcessos = "hora" | "dia" | "mes" | "ano";

export type TempoEsperaEstimado = {
  mediaSegundos: number | null;
  posicaoMedia: number | null;
  testes: number;
  atingiuLimiteTeste: boolean;
};

export type ControleAcessosSgpResponse = {
  atualizadoEm: string | null;
  limiteConexoes: number | null;
  conectados: number | null;
  emFila: number | null;
  filaIniciadaEm: string | null;
  tempoEspera: TempoEsperaEstimado | null;
};

export type PontoSerieAcessos = {
  label: string;
  total: number;
  emFilaMax: number;
  filaAtiva: boolean;
};

export type SerieAcessosSgpResponse = {
  granularidade: GranularidadeAcessos;
  pontos: PontoSerieAcessos[];
};
