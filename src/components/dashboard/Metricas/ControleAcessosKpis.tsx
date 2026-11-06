"use client";

import { Info } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useControleAcessosSgp } from "@/hooks/useControleAcessosSgp";
import {
  resumirControleAcessos,
  type IndicadorControleAcessos,
  type TomControleAcessos,
} from "@/lib/sgpControleAcessos";
import StatusBadge from "./StatusBadge";

type Props = {
  readonly systemName?: string;
};

const COR_VALOR: Record<TomControleAcessos, string> = {
  success: "text-[#3B82F6]",
  muted: "text-[#3B82F6]",
  warning: "text-[#9C6507]",
  danger: "text-[#970C0C]",
};

const LIMITACOES_TEMPO_ESPERA =
  "Estimativa pelo teste sintético de login, que roda a cada 10 minutos com " +
  "um único usuário: é a média dos testes da última hora que entraram na " +
  "fila, não a média dos usuários reais. O teste desiste em 10 minutos, " +
  "então nos picos a média fica subestimada.";

function InfoTempoEspera() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="cursor-help text-[#6B7280]"
          aria-label="Como o tempo de espera é estimado"
        >
          <Info className="h-4 w-4" aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="bottom"
        className="max-w-xs border-none bg-[#111827] p-3 text-white"
      >
        <TooltipArrow className="text-[#111827]" width={12} height={6} />
        <div className="text-xs leading-relaxed">{LIMITACOES_TEMPO_ESPERA}</div>
      </TooltipContent>
    </Tooltip>
  );
}

export default function ControleAcessosKpis({ systemName }: Props) {
  const { data, isLoading, isError, refetch } = useControleAcessosSgp({
    systemName: systemName ?? "",
  });
  const resumo = data ? resumirControleAcessos(data) : undefined;
  const errorMessage = isError
    ? "Não foi possível carregar o controle de acessos."
    : "Aguardando os dados do controle de acessos.";

  const card = (
    title: string,
    indicador: IndicadorControleAcessos | undefined,
    extra?: React.ReactNode,
  ) => (
    <MetricCard
      title={title}
      systemName={systemName}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage={errorMessage}
      value={indicador?.valor}
      valueDetail={indicador?.detalhe}
      valueClassName={indicador && COR_VALOR[indicador.tom]}
      badge={
        indicador && (
          <span className="inline-flex items-center gap-2">
            <StatusBadge tom={indicador.tomBadge} label={indicador.badge} />
            {extra}
          </span>
        )
      }
    />
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      {card("Limite de Conexões (sem fila)", resumo?.limite)}
      {card("Usuários conectados agora", resumo?.conectados)}
      {card("Usuários em fila de espera", resumo?.fila)}
      {card(
        "Tempo médio de espera na fila",
        resumo?.tempoEspera,
        <InfoTempoEspera />,
      )}
    </div>
  );
}
