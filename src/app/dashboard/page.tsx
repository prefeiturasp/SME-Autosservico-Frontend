"use client";
import CardWrapperInfoAmbientes from "@/components/dashboard/CardWrapperInfoAmbientes";
import Producao from "@/components/dashboard/DisponibilidadeDosAmbientes/Producao";
import Filas from "@/components/dashboard/SaudeDosServidores/Filas";
import JenkinsJob from "@/components/dashboard/JenkinsJob";
import AzureDevOpsBacklog from "@/components/dashboard/AzureDevOpsBacklog";
import useDashboardStore from "@/states/dashboard";

export default function Dashboard() {
    const activeProject = useDashboardStore((state) => state.activeProject);
    const projectNameFrontEnd = activeProject?.zabbixQueryFrontend?.trim();
    const projectNameBackEnd = activeProject?.zabbixQueryBackend?.trim();
    const projectNameFilasRabbitMQ = activeProject?.zabbixQueryFilasRabbitMQ?.trim();
    const projectName = activeProject?.nome?.trim();
    const jenkinsSubprojects = activeProject?.jenkinsSubprojects ?? [];

    return (
        <div className="border-b bg-background px-6 py-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="col-span-2">
                    <JenkinsJob
                        project={projectName ?? ""}
                        subprojects={jenkinsSubprojects}
                    />
                </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
                <CardWrapperInfoAmbientes
                    title="Disponibilidade do ambiente"
                    className="max-w-sm"
                >
                    <Producao
                        className="bg-[#F5F5F5] p-3"
                        projectName={projectNameFrontEnd ?? ""}
                    />
                </CardWrapperInfoAmbientes>

                <CardWrapperInfoAmbientes
                    title="Saúde do servidor (Workloads)"
                    className="max-w-sm"
                >
                    <Filas
                        title="Fila"
                        className="mb-5 bg-[#F5F5F5] p-3"
                        projectName={projectNameFilasRabbitMQ ?? ""}
                    />
                    <Producao
                        title="API Service"
                        className="bg-[#F5F5F5] p-3"
                        projectName={projectNameBackEnd ?? ""}
                    />
                </CardWrapperInfoAmbientes>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <CardWrapperInfoAmbientes
                    title="Bugs"
                    className="col-span-4 gap-2 py-2"
                >
                    <AzureDevOpsBacklog
                        className="p-[2px]"
                        project={projectName ?? ""}
                    />
                </CardWrapperInfoAmbientes>
            </div>
        </div>
    );
}
