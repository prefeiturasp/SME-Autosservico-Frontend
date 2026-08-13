"use client";

import { RotateCcw } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUsersByProfile } from "@/hooks/useUsersByProfile";
import type { UsersByProfileResponse } from "@/types/metricas";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

type ProfileKey = keyof UsersByProfileResponse;

const PROFILE_CONFIG: Record<ProfileKey, { label: string; color: string }> = {
  codae: { label: "CODAE", color: "#2563EB" },
  dre: { label: "DRE", color: "#F59E0B" },
  ue: { label: "UE", color: "#10B981" },
};

const PROFILE_ORDER: ProfileKey[] = ["codae", "dre", "ue"];

export default function UsersByProfileCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUsersByProfile({
    systemName: systemName ?? "",
  });

  const content = () => {
    if (!systemName) {
      return <div className="text-sm text-muted-foreground">Selecione um projeto</div>;
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
          <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
            <RotateCcw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      );
    }

    const chartData = PROFILE_ORDER.map((key) => ({
      key,
      name: PROFILE_CONFIG[key].label,
      value: data[key],
      fill: PROFILE_CONFIG[key].color,
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
        <div className="flex items-center justify-center gap-4 pt-2 text-sm text-gray-600">
          {PROFILE_ORDER.map((key) => (
            <div key={key} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: PROFILE_CONFIG[key].color }}
              />
              <span>
                <span className="font-bold text-[#111827]">
                  {PROFILE_CONFIG[key].label}
                </span>{" "}
                <span className="text-[#6B7280]">{data[key]}%</span>
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
        <CardTitle className="text-base font-bold">Usuários por tipo de perfil</CardTitle>
      </CardHeader>
      <CardContent className="px-4">{content()}</CardContent>
    </Card>
  );
}
