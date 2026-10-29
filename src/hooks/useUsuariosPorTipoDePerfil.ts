import type { ProfileDistributionResponse } from "@/types/metricas";
import { useGipeMetricasQuery } from "./_helpers/gipeMetricas";

type Options = {
  systemName: string;
};

// A cor é decisão de UI (discovery do GIPE, §8): fixa por perfil, para o
// mesmo perfil manter a cor ao trocar de ano. Rótulos vindos do Backend.
const CORES_PERFIL: Record<string, string> = {
  "Diretor de Escola": "#3B82F6",
  "Assistente de direção": "#1E3A8A",
  "Ponto focal": "#F59E0B",
  "Ponto focal admin": "#A16207",
  GIPE: "#10B981",
  "GIPE admin": "#065F46",
};

// Perfis que o painel não previa (ex.: "Diretor de Escola admin").
const CORES_RESERVA = ["#8B5CF6", "#EC4899", "#6B7280"];

export function useUsuariosPorTipoDePerfil({ systemName }: Options) {
  return useGipeMetricasQuery(
    systemName,
    (data): ProfileDistributionResponse => {
      let reserva = 0;
      return {
        items: data.usuarios.porTipoDePerfil.map((perfil) => ({
          ...perfil,
          color:
            CORES_PERFIL[perfil.label] ??
            CORES_RESERVA[reserva++ % CORES_RESERVA.length],
        })),
      };
    },
  );
}
