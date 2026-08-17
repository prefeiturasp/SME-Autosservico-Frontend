import { useQuery } from "@tanstack/react-query";
import type { UsersByProfileResponse } from "@/types/metricas";

type Options = {
  systemName: string;
};

const MOCK_RESPONSE: UsersByProfileResponse = {
  codae: 10,
  dre: 15,
  ue: 75,
};

export function useUsersByProfile({ systemName }: Options) {
  return useQuery<UsersByProfileResponse>({
    queryKey: ["users-by-profile", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_RESPONSE;
    },
  });
}
