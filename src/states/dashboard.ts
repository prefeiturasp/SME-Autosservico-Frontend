// src/states/dashboard.ts
import { create } from "zustand";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";
import {
    DEFAULT_ANALYTICS_PERIOD,
    type AnalyticsPeriod,
    type DashboardTab,
} from "@/types/analyticsPeriod";

export interface SidebarItem {
    title: string;
    subTitle: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface ProjectItem {
    id: string;
    nome: string;
    zabbixQueryFrontend: string;
    zabbixQueryFrontendHomolog?: string;
    zabbixQueryBackend: string;
    zabbixQueryFilasRabbitMQ: string;
    zabbixQueryJenkinsJob: string;
    jenkinsSubprojects?: JenkinsSubproject[];
    azureDevopsProjectName?: string;
    sonarProjectKey?: string;
}

type State = {
    activeItem: SidebarItem | null;
    activeProject: ProjectItem | null;
    activeTab: DashboardTab;
    activePeriod: AnalyticsPeriod;
};

type Action = {
    setActiveItem: (item: SidebarItem | null) => void;
    clearActiveItem: () => void;
    setActiveProject: (project: ProjectItem | null) => void;
    clearActiveProject: () => void;
    setActiveTab: (tab: DashboardTab) => void;
    setActivePeriod: (period: AnalyticsPeriod) => void;
};

// Inicialmente nulo (vamos setar depois com base no allowedSquads)
export default create<State & Action>((set) => ({
    activeItem: null,
    activeProject: null,
    activeTab: "operacional",
    activePeriod: DEFAULT_ANALYTICS_PERIOD,

    setActiveItem: (activeItem) => set({ activeItem }),
    clearActiveItem: () => set({ activeItem: null }),
    setActiveProject: (activeProject) => set({ activeProject }),
    clearActiveProject: () => set({ activeProject: null }),
    setActiveTab: (activeTab) => set({ activeTab }),
    setActivePeriod: (activePeriod) => set({ activePeriod }),
}));
