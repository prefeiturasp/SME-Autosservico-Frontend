import type { TableRow } from "@/types/metricas";

export type LimpezaFechamentos = {
    total: number;
    automaticoAtendido: number;
    automaticoNaoAtendido: number;
    fiscalAtendido: number;
    fiscalNaoAtendido: number;
};

export type LimpezaContratoRow = {
    termoContrato: string;
    prestador: string;
    vigencia: string;
};

export type LimpezaMetricasResponse = {
    fechamentos: LimpezaFechamentos;
    ocorrenciasPorPrestador: TableRow[];
    valoresPagosPorPrestador: TableRow[];
    contratos: LimpezaContratoRow[];
};
