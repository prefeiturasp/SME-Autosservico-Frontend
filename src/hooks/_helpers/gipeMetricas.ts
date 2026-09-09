import { useQuery } from "@tanstack/react-query";
import type { GipeMetricasResponse } from "@/types/gipeMetricas";

// Payload único simulando o formato real de backend (1 endpoint por sistema,
// ver exemplo do SGP): todos os hooks de card do GIPE usam a MESMA queryKey
// e reformatam o pedaço que precisam via `select`, então quando o mock virar
// fetch real só essa função muda — nenhum card precisa ser alterado.
const MOCK_GIPE_METRICAS: GipeMetricasResponse = {
  kpis: {
    acessoAtivo: {
      valor: 2146,
      tendencia: "above",
      tendenciaLabel: "453 novos nos últimos 30 dias",
    },
    usuariosUnicos: {
      valor: 1242,
      tendencia: "below",
      tendenciaLabel: "12% abaixo da média diária",
    },
    acessosHoje: {
      valor: 623,
      tendencia: "on-average",
      tendenciaLabel: "Média dos últimos 30 dias",
    },
  },
  ocorrencias: {
    statusGeral: {
      cadastrados: 1284,
      abertas: 186,
      emAndamento: 312,
      finalizadas: 786,
    },
    tempoResposta: {
      tempoMedioResolucaoDias: 6.4,
      tendenciaResolucao: "above",
      tendenciaResolucaoLabel: "14% mais rápido nos últimos 30 dias",
      tempoMedioPrimeiraTratativaDias: 1.2,
      tendenciaPrimeiraTratativa: "below",
      tendenciaPrimeiraTratativaLabel: "2% mais lento nos últimos 30 dias",
    },
    prazosMovimentacoes: {
      dentroDoPrazo: 903,
      foraDoPrazo: 98,
      semMovimentacao7Dias: 47,
      mediaMovimentacoesPorOcorrencia: 3.8,
    },
    porDre: [
      { label: "Butantã", value: 168 },
      { label: "Capela do Socorro", value: 148 },
      { label: "Freguesia/Brasilândia", value: 124 },
      { label: "Guaianases", value: 110 },
      { label: "Ipiranga", value: 97 },
      { label: "Campo Limpo", value: 84 },
      { label: "Itaquera", value: 71 },
      { label: "Jaçanã/Tremembé", value: 63 },
    ],
    porUnidadeEducacional: [
      { label: "CEI PARC. PAU BRASIL", value: 34 },
      { label: "CEI PARC. JD. ARPOADOR", value: 29 },
      { label: "CEMEI MORUMBI", value: 26 },
      { label: "CEMEI IRAPARÁ", value: 22 },
      { label: "EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA", value: 19 },
      { label: "EMEI JARDIM CELESTE", value: 15 },
      { label: "EMEF VILA NOVA", value: 11 },
    ],
    porCategoria: {
      patrimoniais: 280,
      interpessoais: 726,
    },
    porTipoPatrimonial: [
      { label: "Dano material", value: 86 },
      { label: "Depredação ou vandalismo", value: 64 },
      { label: "Ocorrência com câmera/Smart Sampa", value: 38 },
      { label: "Furto", value: 28 },
      { label: "Invasão", value: 22 },
      { label: "Outros", value: 14 },
    ],
    porTipoInterpessoal: [
      { label: "Agressão verbal", value: 214 },
      { label: "Agressão física", value: 176 },
      { label: "Bullying", value: 153 },
      { label: "Ameaça externa", value: 74 },
      { label: "Ocorrência com objeto sem ameaça", value: 45 },
      { label: "Outros", value: 64 },
    ],
    porMes: [
      { label: "Fevereiro/26", valor: 214, pico: false },
      { label: "Março/26", valor: 386, pico: true },
      { label: "Abril/26", valor: 198, pico: false },
      { label: "Maio/26", valor: 176, pico: false },
      { label: "Junho/26", valor: 258, pico: false },
      { label: "Julho/26", valor: 232, pico: false },
    ],
    porPeriodoLetivo: [
      { label: "1º Bimestre", value: 298 },
      { label: "2º Bimestre", value: 342 },
      { label: "3º Bimestre", value: 386 },
      { label: "4º Bimestre", value: 258 },
      { label: "Geral", value: 1284 },
    ],
    tratadasPorAnalista: [
      { analista: "Ana Luzia Souza", ocorrenciasTratadas: 180, tempoMedio: "4,8 dias" },
      { analista: "Juliana Prado", ocorrenciasTratadas: 144, tempoMedio: "5,6 dias" },
      { analista: "Vitor Barbosa", ocorrenciasTratadas: 138, tempoMedio: "6,2 dias" },
      { analista: "Tamires Serra", ocorrenciasTratadas: 128, tempoMedio: "7,1 dias" },
      {
        analista: "Pedro Henrique Costa",
        ocorrenciasTratadas: 95,
        tempoMedio: "7,9 dias",
      },
      { analista: "Rafael Nogueira", ocorrenciasTratadas: 82, tempoMedio: "8,4 dias" },
      { analista: "Camila Duarte", ocorrenciasTratadas: 67, tempoMedio: "9,1 dias" },
    ],
    tratadasPorDre: [
      { label: "Butantã", value: 152 },
      { label: "Capela do Socorro", value: 134 },
      { label: "Freguesia/Brasilândia", value: 128 },
      { label: "Guaianases", value: 98 },
      { label: "Ipiranga", value: 87 },
      { label: "Campo Limpo", value: 74 },
      { label: "Itaquera", value: 61 },
      { label: "Jaçanã/Tremembé", value: 53 },
    ],
  },
  usuarios: {
    cadastrados: 2146,
    porTipoDePerfil: [
      { label: "Diretor", percentage: 28, color: "#3B82F6" },
      { label: "Assistente de direção", percentage: 5, color: "#1E3A8A" },
      { label: "Ponto focal", percentage: 12, color: "#F59E0B" },
      { label: "Ponto focal admin", percentage: 18, color: "#A16207" },
      { label: "GIPE", percentage: 15, color: "#10B981" },
      { label: "GIPE admin", percentage: 22, color: "#065F46" },
    ],
    perfisMaisUtilizados: [
      { label: "Diretor", value: 681 },
      { label: "GIPE admin", value: 598 },
      { label: "Ponto focal admin", value: 467 },
      { label: "GIPE", value: 342 },
      { label: "Ponto focal", value: 244 },
      { label: "Assistente de direção", value: 130 },
    ],
    porDre: [
      { label: "Butantã", value: 248 },
      { label: "Capela do Socorro", value: 210 },
      { label: "Freguesia/Brasilândia", value: 186 },
      { label: "Guaianases", value: 164 },
      { label: "Ipiranga", value: 142 },
      { label: "Campo Limpo", value: 121 },
      { label: "Itaquera", value: 98 },
      { label: "Jaçanã/Tremembé", value: 84 },
    ],
    porUnidadeEducacional: [
      { label: "CEI PARC. PAU BRASIL", value: 23 },
      { label: "CEI PARC. JD. ARPOADOR", value: 18 },
      { label: "CEMEI MORUMBI", value: 15 },
      { label: "CEMEI IRAPARÁ", value: 14 },
      { label: "EMEF ADALGIZA SEGURADO DA SILVEIRA PROFA", value: 12 },
      { label: "EMEI JARDIM CELESTE", value: 9 },
      { label: "EMEF VILA NOVA", value: 7 },
    ],
  },
  produtividade: {
    encaminhamentosRealizados: 2870,
    anexosEnviados: 4512,
    atualizacoesNasOcorrencias: 6238,
  },
};

async function fetchGipeMetricas(): Promise<GipeMetricasResponse> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return MOCK_GIPE_METRICAS;
}

export function useGipeMetricasQuery<T>(
  systemName: string,
  select: (data: GipeMetricasResponse) => T,
) {
  return useQuery({
    queryKey: ["gipe-metricas", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: fetchGipeMetricas,
    select,
  });
}
