"use client";

import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UseQueryResult } from "@tanstack/react-query";
import type { JenkinsBuildInfo } from "@/types/jenkins";
import type { JenkinsBranchBuildMetrics, JenkinsMetricsApiResponse } from "@/types/jenkins-metrics";

type Props = {
  readonly title?: string;
  readonly className?: string;
  readonly projectName?: string;
  readonly query: UseQueryResult<JenkinsMetricsApiResponse, unknown>;
  readonly emptyProjectHint?: string;
  readonly contentOnly?: boolean;
};

function formatBuildTime(build: JenkinsBuildInfo | undefined): string {
  if (!build) return "-";

  const buildDate = new Date(build.timestampMs);
  const today = new Date();
  const isToday =
    buildDate.getDate() === today.getDate() &&
    buildDate.getMonth() === today.getMonth() &&
    buildDate.getFullYear() === today.getFullYear();

  const hours = String(buildDate.getHours()).padStart(2, "0");
  const minutes = String(buildDate.getMinutes()).padStart(2, "0");
  if (isToday) return `Hoje ${hours}:${minutes}`;

  const day = String(buildDate.getDate()).padStart(2, "0");
  const month = String(buildDate.getMonth() + 1).padStart(2, "0");
  return `${day}/${month} ${hours}:${minutes}`;
}

function statusLabel(metrics: JenkinsBranchBuildMetrics): string {
  switch (metrics.status) {
    case "SUCCESS":
      return "Sucesso";
    case "FAILURE":
      return "Falha";
    case "IN_PROGRESS":
      return "Em andamento";
    case "UNSTABLE":
      return "Instável";
    case "ABORTED":
      return "Abortado";
    default:
      return "Desconhecido";
  }
}

function statusClasses(metrics: JenkinsBranchBuildMetrics): string {
  switch (metrics.status) {
    case "SUCCESS":
      return "bg-[#D7F8E7] text-[#047857]";
    case "FAILURE":
      return "bg-[#FEE2E2] text-[#B91C1C]";
    case "IN_PROGRESS":
      return "bg-[#FEF3C7] text-[#92400E]";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

function BuildNumber({ build }: { readonly build?: JenkinsBuildInfo }) {
  if (!build) return null;
  return <span className="ml-1 text-[11px] font-medium text-[#A7AEBB]">#{build.number}</span>;
}

function MetricRow({
  label,
  value,
  valueClassName,
  build,
}: {
  readonly label: string;
  readonly value: string;
  readonly valueClassName?: string;
  readonly build?: JenkinsBuildInfo;
}) {
  return (
    <div className="flex h-[31px] items-center justify-between border-t border-[#E5E7EB] text-[15px] leading-none">
      <span className="min-w-0 text-[#4B5563]">{label}</span>
      <span className={cn("min-w-0 text-right font-medium text-[#111827]", valueClassName)}>
        {value}
        <BuildNumber build={build} />
      </span>
    </div>
  );
}

function JenkinsBranchBuildsContent({ metrics }: { readonly metrics: JenkinsBranchBuildMetrics }) {
  const status = statusLabel(metrics);
  const currentBuild = metrics.lastBuild;
  let currentBuildState = "-";
  if (currentBuild?.status === "IN_PROGRESS") {
    currentBuildState = "em andamento";
  } else if (currentBuild) {
    currentBuildState = "concluído";
  }

  return (
    <>
      <div className={cn("mb-4 inline-flex h-[28px] items-center rounded-full px-4 text-sm font-semibold", statusClasses(metrics))}>
        {metrics.status === "SUCCESS" && <Check className="mr-2 h-4 w-4" />}
        {status}
      </div>

      <div>
        <div className="flex h-[31px] items-center justify-between text-[15px] leading-none">
          <span className="text-[#4B5563]">Estabilidade</span>
          <div className="flex items-center gap-2">
            <div className="h-1 w-12 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#36C38A]"
                style={{ width: `${metrics.stabilityPercent}%` }}
              />
            </div>
            <span className="w-10 text-right font-medium text-[#111827]">
              {metrics.stabilityPercent}%
            </span>
          </div>
        </div>

        <MetricRow
          label="Último sucesso"
          value={formatBuildTime(metrics.lastSuccessfulBuild)}
          valueClassName="text-[#047857]"
          build={metrics.lastSuccessfulBuild}
        />
        <MetricRow
          label="Última falha"
          value={formatBuildTime(metrics.lastFailedBuild)}
          valueClassName="text-[#B91C1C]"
          build={metrics.lastFailedBuild}
        />
        <MetricRow label="Build atual" value={currentBuild?.duration ?? "-"} />
        <MetricRow label="Iniciado em" value={currentBuildState} build={currentBuild} valueClassName="text-[#6B7280]" />
      </div>
    </>
  );
}

export default function JenkinsBranchBuildsCard({
  title = "Jenkins - Branches e Builds",
  className,
  projectName,
  query,
  emptyProjectHint = "Selecione um projeto",
  contentOnly = false,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = query;
  const cardClasses = contentOnly
    ? ""
    : "bg-white rounded-[5px] shadow-[3px_4px_6px_0px_rgba(0,0,0,0.1)] p-5 min-h-[493px]";

  if (!projectName) {
    return (
      <div className={cn(cardClasses, className)}>
        {!contentOnly && <div className="mb-4 text-[15px] font-bold text-[#111827]">{title}</div>}
        <div className="text-center text-sm text-[#6B7280]">{emptyProjectHint}</div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className={cn(cardClasses, className)}>
        {!contentOnly && <div className="mb-4 text-[15px] font-bold text-[#111827]">{title}</div>}
        <Skeleton className="mb-5 h-7 w-24 rounded-full" />
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={cn(cardClasses, className)}>
        {!contentOnly && <div className="mb-4 text-[15px] font-bold text-[#111827]">{title}</div>}
        <div className="mb-4 text-sm text-[#6B7280]">Não foi possível carregar os dados.</div>
        <Button onClick={() => refetch()} variant="secondary" size="sm">
          <RotateCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!data.found) {
    return (
      <div className={cn(cardClasses, className)}>
        {!contentOnly && <div className="mb-4 text-[15px] font-bold text-[#111827]">{title}</div>}
        <div className="text-sm text-[#6B7280]">{data.message}</div>
      </div>
    );
  }

  return (
    <div className={cn(cardClasses, className)}>
      {!contentOnly && <div className="mb-4 text-[15px] font-bold text-[#111827]">{title}</div>}
      <JenkinsBranchBuildsContent metrics={data.data} />
    </div>
  );
}
