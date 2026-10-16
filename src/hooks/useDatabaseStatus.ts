import { useQuery } from "@tanstack/react-query";
import type { DatabaseStatusResponse } from "@/types/database";

type Options = {
  systemName: string;
};

export function useDatabaseStatus({ systemName }: Options) {
  return useQuery<DatabaseStatusResponse>({
    queryKey: ["database-status", systemName],
    enabled: !!systemName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const qs = new URLSearchParams({ system: systemName });
      const res = await fetch(`/api/zabbix/database?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Falha ao buscar status do banco de dados");
      return res.json();
    },
  });
}
