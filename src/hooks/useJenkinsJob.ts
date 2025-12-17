import { useQuery } from "@tanstack/react-query";
import type { JenkinsJobSummary } from "@/types/jenkins";

type Options = {
    endpoint: string; // `/api/zabbix/jenkins/job`
    keyPrefix: string;
    projectName: string; // Jenkins fullName, ex: "SME-NovoSGP-Docs/master"
};

export function useJenkinsJob({ endpoint, keyPrefix, projectName }: Options) {
    return useQuery<JenkinsJobSummary>({
        queryKey: [keyPrefix, projectName],
        enabled: !!projectName,
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const qs = new URLSearchParams({ project: projectName });
            const res = await fetch(`${endpoint}?${qs.toString()}`, { cache: "no-store" });
            if (!res.ok) throw new Error("Falha ao buscar dados do Jenkins");
            return res.json();
        },
    });
}

