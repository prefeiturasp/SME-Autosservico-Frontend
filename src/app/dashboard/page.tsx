"use client";
import  CardWrapperInfoAmbientes from "@/components/dashboard/CardWrapperInfoAmbientes";
import Producao from "@/components/dashboard/DisponibilidadeDosAmbientes/Producao";
import useDashboardStore from "@/states/dashboard";

export default function Dashboard() {

    const activeProject = useDashboardStore((state) => state.activeProject);
    const projectNameFrontEnd = activeProject?.zabbixQueryFrontend?.trim();
    const projectNameBackEnd = activeProject?.zabbixQueryBackend?.trim();

    return (
        <div className="border-b bg-background px-6 py-4">
            <div className="flex space-x-4 mb-6">
                <CardWrapperInfoAmbientes title = "Disponibilidade do ambiente" className="max-w-sm mb-5">
                    <Producao projectName={projectNameFrontEnd ?? ""} />
                </CardWrapperInfoAmbientes>

                <CardWrapperInfoAmbientes title = "Saúde do servidor (Workloads)" className="max-w-sm mb-5">
                    <Producao title="API Service" projectName={projectNameBackEnd ?? ""} />
                </CardWrapperInfoAmbientes>
            </div>
        </div>
    );
}
