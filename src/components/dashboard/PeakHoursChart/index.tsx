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

const SKELETON_BARS: ReadonlyArray<{ id: string; height: number }> = [
  { id: "01h", height: 60 },
  { id: "02h", height: 70 },
  { id: "03h", height: 50 },
  { id: "04h", height: 80 },
  { id: "05h", height: 95 },
  { id: "06h", height: 115 },
  { id: "07h", height: 140 },
  { id: "08h", height: 160 },
  { id: "09h", height: 170 },
  { id: "10h", height: 175 },
  { id: "11h", height: 180 },
  { id: "12h", height: 165 },
  { id: "13h", height: 175 },
  { id: "14h", height: 178 },
  { id: "15h", height: 182 },
  { id: "16h", height: 170 },
  { id: "17h", height: 162 },
  { id: "18h", height: 150 },
  { id: "19h", height: 130 },
  { id: "20h", height: 110 },
  { id: "21h", height: 90 },
  { id: "22h", height: 75 },
  { id: "23h", height: 62 },
  { id: "24h", height: 52 },
];

function LoadingSkeleton({ className }: { readonly className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="flex items-end gap-1">
        {SKELETON_BARS.map((bar) => (
          <Skeleton
            key={bar.id}
            className="flex-1"
            style={{ height: `${bar.height}px` }}
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
