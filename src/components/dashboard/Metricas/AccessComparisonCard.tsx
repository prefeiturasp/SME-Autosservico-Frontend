"use client";

import { RotateCcw } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccessComparison } from "@/hooks/useAccessComparison";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonChart from "./AccessComparisonChart";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";

type Props = {
  readonly systemName?: string;
  readonly period: AccessComparisonPeriod;
  readonly onPeriodChange: (next: AccessComparisonPeriod) => void;
  readonly className?: string;
};

export default function AccessComparisonCard({
  systemName,
  period,
  onPeriodChange,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAccessComparison({
    systemName: systemName ?? "",
    period,
  });

  const content = () => {
    if (!systemName) {
      return <div className="text-sm text-muted-foreground">Selecione um projeto</div>;
    }

    if (isLoading || isFetching) {
      return <Skeleton className="h-[220px] w-full" />;
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar o comparativo de acessos.
          </div>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <>
        <AccessComparisonChart buckets={data.buckets} />
        <div className="flex items-center justify-start gap-4 pt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#1E3A8A]" />
            <span>{`${period === "trimestre" ? "Mês" : "Período"} de pico`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#D1D5DB]" />
            <span>Fora do pico</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">
          Comparativo de acessos de usuários
        </CardTitle>
        <CardAction>
          <AccessComparisonPeriodSwitcher value={period} onChange={onPeriodChange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
