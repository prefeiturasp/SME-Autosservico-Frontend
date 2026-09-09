import type { MetricTrend } from "@/types/metric";
import type { AnalistaTableRow, ProfileDistributionItem, TableRow } from "@/types/metricas";

export type GipeMetricasKpi = {
    valor: number;
    tendencia: MetricTrend;
    tendenciaLabel: string;
};

export type GipeMetricasResponse = {
    kpis: {
        acessoAtivo: GipeMetricasKpi;
        usuariosUnicos: GipeMetricasKpi;
        acessosHoje: GipeMetricasKpi;
    };
    ocorrencias: {
        statusGeral: {
            cadastrados: number;
            abertas: number;
            emAndamento: number;
            finalizadas: number;
        };
        tempoResposta: {
            tempoMedioResolucaoDias: number;
            tendenciaResolucao: MetricTrend;
            tendenciaResolucaoLabel: string;
            tempoMedioPrimeiraTratativaDias: number;
            tendenciaPrimeiraTratativa: MetricTrend;
            tendenciaPrimeiraTratativaLabel: string;
        };
        prazosMovimentacoes: {
            dentroDoPrazo: number;
            foraDoPrazo: number;
            semMovimentacao7Dias: number;
            mediaMovimentacoesPorOcorrencia: number;
        };
        porDre: TableRow[];
        porUnidadeEducacional: TableRow[];
        porCategoria: {
            patrimoniais: number;
            interpessoais: number;
        };
        porTipoPatrimonial: TableRow[];
        porTipoInterpessoal: TableRow[];
        porMes: { label: string; valor: number; pico: boolean }[];
        porPeriodoLetivo: TableRow[];
        tratadasPorAnalista: AnalistaTableRow[];
        tratadasPorDre: TableRow[];
    };
    usuarios: {
        cadastrados: number;
        porTipoDePerfil: ProfileDistributionItem[];
        perfisMaisUtilizados: TableRow[];
        porDre: TableRow[];
        porUnidadeEducacional: TableRow[];
    };
    produtividade: {
        encaminhamentosRealizados: number;
        anexosEnviados: number;
        atualizacoesNasOcorrencias: number;
    };
};
