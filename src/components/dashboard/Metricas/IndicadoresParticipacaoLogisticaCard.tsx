"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIndicadoresParticipacaoLogistica } from "@/hooks/useIndicadoresParticipacaoLogistica";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import StatItemBox from "./StatItemBox";
import UesParticipantesPorDreCard from "./UesParticipantesPorDreCard";
import VivenciasComRefeicaoCard from "./VivenciasComRefeicaoCard";

type Props = {
    readonly systemName?: string;
    readonly className?: string;
};

const FIRST_ROW_SIZE = 4;
const SKELETON_ROW_1 = ["skeleton-1", "skeleton-2", "skeleton-3", "skeleton-4"];
const SKELETON_ROW_2 = ["skeleton-5", "skeleton-6", "skeleton-7"];

function SkeletonBox({ id }: { readonly id: string }) {
    return (
        <div
            key={id}
            className="space-y-2 rounded-md border border-[#D8D8D8] p-2"
        >
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}

export default function IndicadoresParticipacaoLogisticaCard({
    systemName,
    className,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } =
        useIndicadoresParticipacaoLogistica({
            systemName: systemName ?? "",
        });

    const renderIndicadores = () => {
        if (isLoading || isFetching) {
            return (
                <>
                    <div className="grid grid-cols-4 gap-3">
                        {SKELETON_ROW_1.map((key) => (
                            <SkeletonBox key={key} id={key} />
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {SKELETON_ROW_2.map((key) => (
                            <SkeletonBox key={key} id={key} />
                        ))}
                    </div>
                </>
            );
        }

        if (isError || !data) {
            return (
                <div>
                    <div className="text-sm text-muted-foreground">
                        Não foi possível carregar os indicadores de participação
                        e logística.
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

        const firstRow = data.items.slice(0, FIRST_ROW_SIZE);
        const secondRow = data.items.slice(FIRST_ROW_SIZE);

        return (
            <>
                <div className="grid grid-cols-4 gap-3">
                    {firstRow.map((item) => (
                        <StatItemBox key={item.label} item={item} />
                    ))}
                </div>
                {secondRow.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {secondRow.map((item) => (
                            <StatItemBox key={item.label} item={item} />
                        ))}
                    </div>
                )}
            </>
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
                <CardTitle className="text-sm font-bold text-[#111827]">
                    Indicadores de participação e logística
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4">
                {systemName ? (
                    <div className="space-y-4">
                        {renderIndicadores()}
                        <div className="grid grid-cols-2 gap-4">
                            <VivenciasComRefeicaoCard bare systemName={systemName} />
                            <UesParticipantesPorDreCard
                                bare
                                systemName={systemName}
                            />
                        </div>
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
