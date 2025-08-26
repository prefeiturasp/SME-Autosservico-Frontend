"use client"

import useDashboardStore from "@/states/dashboard";

export const DisponibilidadeDosAmbientesProducao = () => {

    const activeProject = useDashboardStore((state) => state.activeProject);

    return (
        <div>
            <p>{activeProject?.nome}</p>
            <p>Frontend Query: {activeProject?.zabbixQueryFrontend}</p>
            <p>Backend Query: {activeProject?.zabbixQueryBackend}</p>
        </div>
    );
};
