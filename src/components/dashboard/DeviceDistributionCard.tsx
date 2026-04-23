"use client";

import {
  AlertCircle,
  Monitor,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDeviceDistribution } from "@/hooks/useDeviceDistribution";
import type { DeviceType } from "@/types/deviceDistribution";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const DEVICE_CONFIG: Record<
  DeviceType,
  { label: string; Icon: typeof Monitor; color: string }
> = {
  desktop: { label: "Desktop", Icon: Monitor, color: "#1F3D73" },
  mobile: { label: "Mobile", Icon: Smartphone, color: "#4A90D9" },
  tablet: { label: "Tablet", Icon: Tablet, color: "#5BC0BE" },
};

const DEVICE_ORDER: DeviceType[] = ["desktop", "mobile", "tablet"];

function DeviceRow({
  device,
  percentage,
}: {
  readonly device: DeviceType;
  readonly percentage: number;
}) {
  const { label, Icon, color } = DEVICE_CONFIG[device];
  const safePercentage = Math.max(0, Math.min(100, percentage));

  return (
    <div className="flex items-center gap-4 py-3 first:pt-0">
      <div className="flex flex-1 items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F4F6]">
          <Icon className="h-5 w-5 text-[#6B7280]" aria-hidden="true" />
        </span>
        <span className="text-sm">{label}</span>
      </div>
      <div
        className="flex w-44 items-center gap-3"
        aria-label={`${label}: ${safePercentage}% dos acessos`}
      >
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-[#E5E7EB]"
          aria-hidden="true"
        >
          <div
            data-testid={`device-bar-fill-${device}`}
            className="h-full rounded-full"
            style={{ width: `${safePercentage}%`, backgroundColor: color }}
          />
        </div>
        <span className="w-10 text-right text-sm font-bold" aria-hidden="true">
          {safePercentage}%
        </span>
      </div>
    </div>
  );
}

function WarningAlert({ message }: { readonly message: string }) {
  return (
    <div
      role="alert"
      className="mt-6 flex items-center gap-3 rounded-md border border-[#F59E0B] bg-[#FEF3C7] px-4 py-3 text-sm text-[#92400E]"
    >
      <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

export default function DeviceDistributionCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useDeviceDistribution({ systemName: systemName ?? "" });

  const content = () => {
    if (!systemName) {
      return (
        <div className="text-sm text-muted-foreground">Selecione um projeto</div>
      );
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar a distribuição de dispositivos.
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
        <div className="divide-y border-b divide-[#E5E7EB] border-[#E5E7EB]">
          {DEVICE_ORDER.map((device) => (
            <DeviceRow
              key={device}
              device={device}
              percentage={data[device]}
            />
          ))}
        </div>
        {data.warning && <WarningAlert message={data.warning} />}
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">Tipo de dispositivo</CardTitle>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
