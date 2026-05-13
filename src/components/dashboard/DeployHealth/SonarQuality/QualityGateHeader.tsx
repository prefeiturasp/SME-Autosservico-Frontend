import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QualityGateStatus } from "@/types/sonarqube";
import { formatRelativeTime } from "./formatRelativeTime";

type Props = {
  readonly status: QualityGateStatus;
  readonly failedCount: number;
  readonly lastAnalysisAt?: string;
  readonly branch?: string;
  readonly className?: string;
};

function buildFailedLabel(failedCount: number): string {
  const noun = failedCount === 1 ? "critério com falha" : "critérios com falhas";
  return `${failedCount} ${noun}`;
}

type CriteriaBadgeProps = Readonly<{
  approved: boolean;
  failedCount: number;
}>;

function CriteriaBadge({ approved, failedCount }: CriteriaBadgeProps) {
  const Icon = approved ? Check : X;
  const label = approved ? "Critérios sem falhas" : buildFailedLabel(failedCount);
  const tone = approved
    ? "bg-emerald-100 text-emerald-800"
    : "bg-red-100 text-red-800";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium",
        tone,
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function QualityGateHeader({
  status,
  failedCount,
  lastAnalysisAt,
  branch,
  className,
}: Props) {
  const approved = status === "OK";
  const statusLabel = approved ? "Aprovado" : "Reprovado";
  const statusClass = approved ? "text-emerald-600" : "text-red-600";

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col">
        <span className="text-sm text-[#475569]">Avaliação de qualidade</span>
        <span className={cn("text-4xl font-bold leading-tight", statusClass)}>
          {statusLabel}
        </span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <CriteriaBadge approved={approved} failedCount={failedCount} />
        <span className="text-xs text-[#6B7280]">
          Última análise: {formatRelativeTime(lastAnalysisAt)}
        </span>
        {branch ? (
          <span className="text-xs text-[#6B7280]">Branch: {branch}</span>
        ) : null}
      </div>
    </div>
  );
}
