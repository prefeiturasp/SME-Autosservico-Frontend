import type {
    ActiveAccessUsersResponse,
    StatsCardResponse,
    TableRow,
    UniqueUsersPerDayResponse,
} from "@/types/metricas";

export type BensFisicosMetricasResponse = {
    acessoAtivo: ActiveAccessUsersResponse;
    usuariosUnicos: UniqueUsersPerDayResponse;
    cadastroDeBens: StatsCardResponse;
    bensPorUnidade: TableRow[];
    baixasFisicas: StatsCardResponse;
    movimentacoes: StatsCardResponse;
};
