"use client";

import { RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePeakHours } from "@/hooks/usePeakHours";
import Chart from "./Chart";

type Props = {
  readonly systemName: string;
  readonly className?: string;
};

function LoadingSkeleton({ className }: { readonly className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-end gap-1">
        {Array.from({ length: 24 }).map((value) => (
          <Skeleton
            key={value?.toString() ?? ""}
            className="flex-1"
            style={{ height: `${Math.random() * 120 + 40}px` }}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export default function PeakHoursChart({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePeakHours({
    systemName,
  });

  if (!systemName) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-sm text-muted-foreground">Selecione um projeto</p>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return <LoadingSkeleton className={className} />;
  }

  if (isError || !data) {
    return (
      <div className={cn("text-center py-12", className)}>
        <p className="text-sm text-muted-foreground">
          Não foi possível carregar os horários de pico.
        </p>
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
    <div className={cn(className)}>
      <Chart data={data.data} peakHour={data.peakHour} />
    </div>
  );
}
