"use client";

import { ArrowRight, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAverageSession } from "@/hooks/useAverageSession";
import type { AverageSessionTrend } from "@/types/averageSession";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

const TREND_CONFIG: Record<
  AverageSessionTrend,
  { label: string; Icon: typeof ArrowRight; className: string }
> = {
  "on-average": {
    label: "Na média",
    Icon: ArrowRight,
    className: "bg-[#F3F4F6] text-[#475569]",
  },
  above: {
    label: "Acima da média",
    Icon: ArrowUp,
    className: "bg-[#D1FAE5] text-[#065F46]",
  },
  below: {
    label: "Abaixo da média",
    Icon: ArrowDown,
    className: "bg-[#FEF3C7] text-[#92400E]",
  },
};

function TrendBadge({ trend }: { readonly trend: AverageSessionTrend }) {
  const { label, Icon, className } = TREND_CONFIG[trend];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
        className
      )}
      aria-label={`Tendência: ${label}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export default function AverageSessionCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAverageSession({
    systemName: systemName ?? "",
  });

  const content = () => {
    if (!systemName) {
      return (
        <div className="text-sm text-muted-foreground">Selecione um projeto</div>
      );
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-52" />
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar a média de sessão.
          </div>
          <Button
            onClick={() => refetch()}
            variant="secondary"
            size="sm"
            className="mt-3"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="text-3xl font-bold text-[#2563EB]">
          {formatDuration(data.currentSeconds)}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <TrendBadge trend={data.trend} />
          <span className="text-sm text-muted-foreground">
            média: {formatDuration(data.averageSeconds)}
          </span>
        </div>
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">Média de sessão</CardTitle>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
