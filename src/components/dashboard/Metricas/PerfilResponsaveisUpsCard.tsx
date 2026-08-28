"use client";

import { usePerfilResponsaveisUps } from "@/hooks/usePerfilResponsaveisUps";
import ProfileBreakdownCard from "./ProfileBreakdownCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

export default function PerfilResponsaveisUpsCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePerfilResponsaveisUps({
    systemName: systemName ?? "",
  });

  return (
    <ProfileBreakdownCard
      title="Perfil dos responsáveis pelas UPs"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o perfil dos responsáveis pelas UPs."
      blocks={data}
      bare={bare}
      className={className}
    />
  );
}
