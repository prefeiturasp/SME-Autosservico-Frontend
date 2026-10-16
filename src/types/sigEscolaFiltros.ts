export type SigEscolaFiltroModo = "periodo" | "intervalo";

export type SigEscolaFiltros = {
    modo: SigEscolaFiltroModo;
    periodo: string;
    dataInicio: string;
    dataFim: string;
    dre: string;
    ue: string;
};
