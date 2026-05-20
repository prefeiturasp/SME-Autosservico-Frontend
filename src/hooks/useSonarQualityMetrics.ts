import { useQuery } from "@tanstack/react-query";
import type { SonarMetricsApiResponse } from "@/types/sonarqube";
import type { DeployEnvironment } from "@/types/deployEnvironment";

type Options = {
  projectName: string;
  sonarProjectKey?: string;
  zabbixQueryJenkinsJob?: string;
  environment?: DeployEnvironment;
};

export function useSonarQualityMetrics({
  projectName,
  sonarProjectKey,
  zabbixQueryJenkinsJob,
  environment,
}: Options) {
  return useQuery<SonarMetricsApiResponse>({
    queryKey: [
      "sonar-metrics",
      projectName,
      sonarProjectKey ?? "",
      zabbixQueryJenkinsJob ?? "",
      environment ?? "",
    ],
    enabled: !!projectName,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const qs = new URLSearchParams({ projectName });
      if (sonarProjectKey) qs.set("sonarProjectKey", sonarProjectKey);
      if (zabbixQueryJenkinsJob) qs.set("zabbixQueryJenkinsJob", zabbixQueryJenkinsJob);
      if (environment) qs.set("environment", environment);

      const res = await fetch(`/api/sonarqube/metrics?${qs.toString()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Falha ao buscar métricas do SonarQube");
      return res.json();
    },
  });
}
