import { useQuery } from "@tanstack/react-query";
import type { JenkinsMetricsApiResponse } from "@/types/jenkins-metrics";

type Options = {
  projectName: string;
  environment?: "prod" | "homolog";
};

export function useJenkinsMetrics({ projectName, environment }: Options) {
  return useQuery<JenkinsMetricsApiResponse>({
    queryKey: ["jenkins-metrics", projectName, environment ?? "prod"],
    enabled: !!projectName,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const qs = new URLSearchParams({
        project: projectName,
        ...(environment && environment !== "prod" ? { env: environment } : {}),
      });

      const res = await fetch(`/api/jenkins/metrics?${qs.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Falha ao buscar métricas do Jenkins");
      return res.json();
    },
  });
}
