"use client";

import { RotateCcw } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOcorrenciasPorMes } from "@/hooks/useOcorrenciasPorMes";
import AccessComparisonChart from "./AccessComparisonChart";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OcorrenciasPorMesCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciasPorMes({
    systemName: systemName ?? "",
  });

  const content = () => {
    if (!systemName) {
      return (
        <div className="text-sm text-muted-foreground">
          Selecione um projeto
        </div>
      );
    }

    if (isLoading || isFetching) {
      return <Skeleton className="h-[220px] w-full" />;
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar as ocorrências por mês.
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
        <AccessComparisonChart
          buckets={data.buckets}
          barCategoryGap={5}
          highlightPeakLabel
        />
        <div className="flex items-center justify-start gap-4 pt-2 text-sm text-gray-600">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#1E3A8A]" />
            <span>Mês de pico</span>
          </div>
        </div>
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">
          Ocorrências por mês
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
