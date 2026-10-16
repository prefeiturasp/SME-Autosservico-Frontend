import { useQuery } from "@tanstack/react-query";
import type { BacklogResponse } from "@/types/backlog";

export type BacklogFilters = {
  workItemTypes?: string[];
  states?: string[];
  iterationPaths?: string[];
};

type Options = {
  endpoint: string;
  keyPrefix: string;
  projectName: string;
  filters?: BacklogFilters;
};

export function useAzureDevOpsBacklog({
  endpoint,
  keyPrefix,
  projectName,
  filters,
}: Options) {
  return useQuery<BacklogResponse>({
    queryKey: [keyPrefix, projectName, filters],
    enabled: !!projectName,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const params: Record<string, string> = {
        project_name: projectName,
      };

      if (filters?.workItemTypes?.length) {
        params.work_item_types = filters.workItemTypes.join(",");
      }
      if (filters?.states?.length) {
        params.states = filters.states.join(",");
      }
      if (filters?.iterationPaths?.length) {
        params.iteration_paths = filters.iterationPaths.join(",");
      }

      const qs = new URLSearchParams(params);
      const res = await fetch(`${endpoint}?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Falha ao buscar backlog");
      return res.json();
    },
  });
}

