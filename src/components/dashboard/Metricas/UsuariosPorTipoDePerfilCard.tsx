"use client";

import { RotateCcw } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUsuariosPorTipoDePerfil } from "@/hooks/useUsuariosPorTipoDePerfil";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function UsuariosPorTipoDePerfilCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useUsuariosPorTipoDePerfil({
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
      return <Skeleton className="mx-auto h-40 w-40 rounded-full" />;
    }

    if (isError || !data) {
      return (
        <div>
          <div className="text-sm text-muted-foreground">
            Não foi possível carregar os usuários por tipo de perfil.
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

    const chartData = data.items.map((item) => ({
      name: item.label,
      value: item.percentage,
      fill: item.color,
    }));

    return (
      <>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-sm text-gray-600">
          {data.items.map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <span>
                <span className="font-bold text-[#111827]">{item.label}</span>{" "}
                <span className="text-[#6B7280]">{item.percentage}%</span>
              </span>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <Card className={cn("rounded-md shadow-sm gap-3 py-4 px-1", className)}>
      <CardHeader className="pb-1 px-4">
        <CardTitle className="text-base font-bold">
          Usuários por tipo de perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
