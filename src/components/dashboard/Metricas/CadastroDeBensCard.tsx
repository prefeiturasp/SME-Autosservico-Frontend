"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCadastroDeBens } from "@/hooks/useCadastroDeBens";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import BensCadastradosPorUnidadeCard from "./BensCadastradosPorUnidadeCard";
import StatItemBox from "./StatItemBox";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const SKELETON_KEYS = ["skeleton-1", "skeleton-2"];

export default function CadastroDeBensCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useCadastroDeBens({
    systemName: systemName ?? "",
  });

  const renderIndicadores = () => {
    if (isLoading || isFetching) {
      return SKELETON_KEYS.map((key) => (
        <div
          key={key}
          className="flex-1 space-y-2 rounded-md border border-[#D8D8D8] p-2"
        >
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      ));
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar o cadastro de bens.
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

    return data.items.map((item) => <StatItemBox key={item.label} item={item} />);
  };

  return (
    <Card
      className={cn(
        "rounded-md border-0 shadow-[3px_4px_6px_0px_#0000001A] gap-3 py-4 px-1",
        className,
      )}
    >
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-sm font-bold text-[#111827]">
          Cadastro de bens
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">
        {systemName ? (
          <div className="space-y-4">
            <div className="flex gap-3">{renderIndicadores()}</div>
            <BensCadastradosPorUnidadeCard bare systemName={systemName} />
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            Selecione um projeto
          </div>
        )}
      </CardContent>
    </Card>
  );
}
