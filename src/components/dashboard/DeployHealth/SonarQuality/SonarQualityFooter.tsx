import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  readonly acceptedIssues: number;
  readonly uncoveredLines: number;
  readonly className?: string;
};

function formatThousand(value: number): string {
  if (value < 1000) return value.toLocaleString("pt-BR");
  const inK = value / 1000;
  const rounded = Math.round(inK * 10) / 10;
  return `${rounded.toLocaleString("pt-BR")}k`;
}

export default function SonarQualityFooter({
  acceptedIssues,
  uncoveredLines,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-[#475569]">
        {acceptedIssues.toLocaleString("pt-BR")} problemas aceitos
      </span>
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
        <AlertTriangle className="h-4 w-4" aria-hidden="true" />
        {formatThousand(uncoveredLines)} linhas sem cobertura
      </span>
    </div>
  );
}
