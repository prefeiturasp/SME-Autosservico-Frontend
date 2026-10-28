import type { MetricTrend } from "@/types/metric";
import type { AnalistaTableRow, TableRow } from "@/types/metricas";

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
            // Nulos quando não há ocorrência finalizada; tendência ausente
            // quando não há base de comparação nos últimos 60 dias.
            tempoMedioResolucaoDias: number | null;
            tendenciaResolucao?: MetricTrend;
            tendenciaResolucaoLabel?: string;
            tempoMedioPrimeiraTratativaDias: number | null;
            tendenciaPrimeiraTratativa?: MetricTrend;
            tendenciaPrimeiraTratativaLabel?: string;
        };
        prazosMovimentacoes: {
            // Dentro/fora do prazo: sem SLA no GIPE, o Backend manda null.
            dentroDoPrazo: number | null;
            foraDoPrazo: number | null;
            semMovimentacao7Dias: number;
            mediaMovimentacoesPorOcorrencia: number | null;
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
        // A cor de cada perfil é decisão de UI: o hook resolve.
        porTipoDePerfil: { label: string; percentage: number }[];
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
