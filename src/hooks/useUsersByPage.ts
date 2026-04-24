import { useQuery } from "@tanstack/react-query";
import type { UsersByPageResponse } from "@/types/usersByPage";

type Options = {
  systemName: string;
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

export function useUsersByPage({ systemName }: Options) {
  return useQuery<UsersByPageResponse>({
    queryKey: ["users-by-page", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        system: systemName,
        pages: MOCK_PAGES,
      };
    },
  });
}
