"use client";

import { RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendBadge } from "./TrendBadge";
import type { MetricTrend } from "@/types/metric";

type Props = {
  readonly title: string;
  readonly systemName?: string;
  readonly isLoading?: boolean;
  readonly isError?: boolean;
  readonly onRetry?: () => void;
  readonly errorMessage?: string;
  readonly value?: string;
  readonly trend?: MetricTrend;
  readonly trendLabel?: string;
  readonly comparison?: string;
  readonly className?: string;
};

export default function MetricCard({
  title,
  systemName,
  isLoading,
  isError,
  onRetry,
  errorMessage = "Não foi possível carregar os dados.",
  value,
  trend,
  trendLabel,
  comparison,
  className,
}: Props) {
  const renderContent = () => {
    if (!systemName) {
      return <div className="text-sm text-muted-foreground">Selecione um projeto</div>;
    }

    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-6 w-52" />
        </div>
      );
    }

    if (isError || value === undefined) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">{errorMessage}</div>
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="secondary"
              size="sm"
              className="mt-3"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Tentar novamente
            </Button>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="text-3xl font-bold text-[#2563EB]">{value}</div>
        <div className="mt-4 flex items-center gap-3">
          {trend && trendLabel && <TrendBadge trend={trend} label={trendLabel} />}
          {comparison && (
            <span className="text-sm text-muted-foreground">{comparison}</span>
          )}
        </div>
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4">{renderContent()}</CardContent>
    </Card>
  );
}
