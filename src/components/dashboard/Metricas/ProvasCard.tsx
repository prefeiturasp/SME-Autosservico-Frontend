"use client";

import { useState } from "react";
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
import { useProvas } from "@/hooks/useProvas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";
import type { StatVariant } from "@/types/metricas";
import BimestreSelect from "./BimestreSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const VARIANT_COLORS: Record<StatVariant, string> = {
  neutral: "#3B82F6",
  success: "#075A3E",
  warning: "#9C6507",
  danger: "#970C0C",
  muted: "#111827",
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];

const ptBrFormatter = new Intl.NumberFormat("pt-BR");
const percentFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export default function ProvasCard({ systemName, className }: Props) {
  const [bimestre, setBimestre] = useState<string>(DEFAULT_BIMESTRE);
  const { data, isLoading, isFetching, isError, refetch } = useProvas({
    systemName: systemName ?? "",
    bimestre,
  });

  const renderContent = () => {
    if (!systemName) {
      return <div className="text-sm text-muted-foreground">Selecione um projeto</div>;
    }

    if (isLoading || isFetching) {
      return (
        <div className="space-y-4">
          <div className="flex gap-3">
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="flex-1 space-y-2 rounded-md border border-[#D8D8D8] p-2"
              >
                <Skeleton className="h-7 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <Skeleton className="h-[18px] w-full" />
        </div>
      );
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar os dados de provas.
          </div>
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div className="flex gap-3">
          {data.items.map((item) => (
            <div
              key={item.label}
              className="flex-1 space-y-1 rounded-md border border-[#D8D8D8] p-2"
            >
              <div
                className="text-2xl font-medium"
                style={{ color: VARIANT_COLORS[item.variant] }}
              >
                {ptBrFormatter.format(item.value)}
              </div>
              <div className="text-sm font-normal text-[#6B7280]">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div
            className="h-[18px] flex-1 overflow-hidden rounded-full bg-[#E5E7EB]"
            aria-hidden="true"
          >
            <div
              data-testid="provas-progress-fill"
              className="h-full rounded-full bg-[#1E3A8A]"
              style={{ width: `${data.progressPercentage}%` }}
            />
          </div>
          <span className="text-sm font-bold text-[#1E3A8A]">
            {percentFormatter.format(data.progressPercentage)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <Card
      className={cn(
        "rounded-md border-0 shadow-[3px_4px_6px_0px_#0000001A] gap-3 py-4 px-1",
        className,
      )}
    >
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-sm font-bold text-[#111827]">Provas</CardTitle>
        <CardAction>
          <BimestreSelect value={bimestre} onChange={setBimestre} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-4">{renderContent()}</CardContent>
    </Card>
  );
}
