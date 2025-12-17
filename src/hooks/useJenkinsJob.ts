import { useQuery } from "@tanstack/react-query";
import type { JenkinsJobSummary } from "@/types/jenkins";

type Options = {
    endpoint: string; // `/api/zabbix/jenkins/job`
    keyPrefix: string;
    projectName: string; // Jenkins fullName, ex: "SME-NovoSGP-Docs/master"
    environment?: "prod" | "homolog";
};

export function useJenkinsJob({ endpoint, keyPrefix, projectName, environment }: Options) {
    return useQuery<JenkinsJobSummary>({
        queryKey: [keyPrefix, projectName, environment ?? "prod"],
        enabled: !!projectName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const qs = new URLSearchParams({
                project: projectName,
                ...(environment && environment !== "prod" ? { env: environment } : {}),
            });
            const res = await fetch(`${endpoint}?${qs.toString()}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Falha ao buscar dados do Jenkins");
            return res.json();
        },
    });
}
