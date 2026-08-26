import { useQuery } from "@tanstack/react-query";
import type { UsersByPageResponse } from "@/types/usersByPage";
import {
  DEFAULT_ANALYTICS_PERIOD,
  type AnalyticsPeriod,
} from "@/types/analyticsPeriod";

type Options = {
  systemName: string;
  period?: AnalyticsPeriod;
  coordenadoria?: string;
};

const MOCK_PAGES: UsersByPageResponse["pages"] = [
  { path: "/Sorteios e Plateia", currentUsers: 7672, averageUsers: 7672 },
  { path: "/Página Inicial", currentUsers: 7062, averageUsers: 7672 },
  { path: "/Benefícios", currentUsers: 3556, averageUsers: 9565 },
  { path: "/Descontos, Cortesias e Livros", currentUsers: 2316, averageUsers: 6173 },
  { path: "/login", currentUsers: 1830, averageUsers: 6140 },
  { path: "/Meus Agendamentos", currentUsers: 1492, averageUsers: 4890 },
  { path: "/Eventos Culturais", currentUsers: 1218, averageUsers: 3774 },
  { path: "/Perfil", currentUsers: 987, averageUsers: 2510 },
  { path: "/Notificações", currentUsers: 742, averageUsers: 1988 },
  { path: "/Ajuda", currentUsers: 513, averageUsers: 1305 },
];

const MOCK_PAGES_CODAE: UsersByPageResponse["pages"] = [
  { path: "/Página Inicial", currentUsers: 6820, averageUsers: 7150 },
  { path: "/Lançamento de Medição Inicial", currentUsers: 5340, averageUsers: 5680 },
  { path: "/Solicitação de Alimentação", currentUsers: 4210, averageUsers: 4590 },
  { path: "/Fichas Técnicas", currentUsers: 3175, averageUsers: 3420 },
  { path: "/Acompanhamento de Medição Inicial", currentUsers: 2680, averageUsers: 2950 },
  { path: "/Cronogramas de Entrega", currentUsers: 1840, averageUsers: 2100 },
  { path: "/Consulta Dieta Especial", currentUsers: 1290, averageUsers: 1560 },
];

export function useUsersByPage({
  systemName,
  period = DEFAULT_ANALYTICS_PERIOD,
  coordenadoria,
}: Options) {
  return useQuery<UsersByPageResponse>({
    queryKey: ["users-by-page", systemName, period, coordenadoria],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        system: systemName,
        pages: coordenadoria === "CODAE" ? MOCK_PAGES_CODAE : MOCK_PAGES,
      };
    },
  });
}
