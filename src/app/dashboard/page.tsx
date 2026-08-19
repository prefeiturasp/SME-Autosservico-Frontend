"use client";
import ActiveUsersCard from "@/components/dashboard/ActiveUsersCard";
import AverageSessionCard from "@/components/dashboard/AverageSessionCard";
import AzureDevOpsBacklog from "@/components/dashboard/AzureDevOpsBacklog";
import CardWrapperInfoAmbientes from "@/components/dashboard/CardWrapperInfoAmbientes";
import DatabaseStatusCard from "@/components/dashboard/DatabaseStatusCard";
import EnvironmentHeader from "@/components/dashboard/DeployHealth/EnvironmentHeader";
import SonarQualityIndicatorsCard from "@/components/dashboard/DeployHealth/SonarQuality/SonarQualityIndicatorsCard";
import DeviceDistributionCard from "@/components/dashboard/DeviceDistributionCard";
import Producao from "@/components/dashboard/DisponibilidadeDosAmbientes/Producao";
import JenkinsJob from "@/components/dashboard/JenkinsJob";
import AccessComparisonCard from "@/components/dashboard/Metricas/AccessComparisonCard";
import ActiveUsersMetricCard from "@/components/dashboard/Metricas/ActiveUsersMetricCard";
import AlimentacaoTerceirizadaSection from "@/components/dashboard/Metricas/AlimentacaoTerceirizadaSection";
import LogisticaSection from "@/components/dashboard/Metricas/LogisticaSection";
import OportunidadesRecrutamentoSection from "@/components/dashboard/Metricas/OportunidadesRecrutamentoSection";
import OrdemInscricaoSection from "@/components/dashboard/Metricas/OrdemInscricaoSection";
import SorteiosSection from "@/components/dashboard/Metricas/SorteiosSection";
import TodayAccessCard from "@/components/dashboard/Metricas/TodayAccessCard";
import UniqueUsersPerDayCard from "@/components/dashboard/Metricas/UniqueUsersPerDayCard";
import UsersByProfileCard from "@/components/dashboard/Metricas/UsersByProfileCard";
import PeakHoursChart from "@/components/dashboard/PeakHoursChart";
import PeakUsageTodayCard from "@/components/dashboard/PeakUsageTodayCard";
import Releases from "@/components/dashboard/Releases";
import Filas from "@/components/dashboard/SaudeDosServidores/Filas";
import UsersByPageCard from "@/components/dashboard/UsersByPageCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAnalyticsOnboarding } from "@/hooks/useAnalyticsOnboarding";
import { useDeployHealthOnboarding } from "@/hooks/useDeployHealthOnboarding";
import useDashboardStore from "@/states/dashboard";
import {
    DEFAULT_ACCESS_COMPARISON_PERIOD,
    type AccessComparisonPeriod,
} from "@/types/accessComparisonPeriod";
import type { DashboardTab } from "@/types/analyticsPeriod";
import type { DeployEnvironment } from "@/types/deployEnvironment";
import { useEffect, useState } from "react";

const SISTEMAS_COM_METRICAS = new Set(["SigPAE", "Intranet"]);

type FullWidthSectionProps = {
    readonly id?: string;
    readonly title: string;
    readonly tooltip: React.ReactNode;
    readonly children: React.ReactNode;
};

function FullWidthSection({
    id,
    title,
    tooltip,
    children,
}: FullWidthSectionProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            <CardWrapperInfoAmbientes
                id={id}
                title={title}
                className="col-span-4 gap-2 py-2"
                tooltipContent={tooltip}
            >
                {children}
            </CardWrapperInfoAmbientes>
        </div>
    );
}

export default function Dashboard() {
    const activeProject = useDashboardStore((state) => state.activeProject);
    const setActiveTab = useDashboardStore((state) => state.setActiveTab);
    const activePeriod = useDashboardStore((state) => state.activePeriod);
    const projectName = activeProject?.nome?.trim() ?? "";
    const projectNameFrontEnd =
        activeProject?.zabbixQueryFrontend?.trim() ?? "";
    const projectNameBackEnd = activeProject?.zabbixQueryBackend?.trim() ?? "";
    const projectNameFilasRabbitMQ =
        activeProject?.zabbixQueryFilasRabbitMQ?.trim() ?? "";
    const jenkinsSubprojects = activeProject?.jenkinsSubprojects ?? [];
    const [deployEnvironment, setDeployEnvironment] =
        useState<DeployEnvironment>("producao");
    const [accessComparisonPeriod, setAccessComparisonPeriod] =
        useState<AccessComparisonPeriod>(DEFAULT_ACCESS_COMPARISON_PERIOD);
    const [activeTabValue, setActiveTabValue] = useState("operacional");
    const { triggerDeployTour } = useDeployHealthOnboarding();
    const { triggerAnalyticsTour } = useAnalyticsOnboarding();

    const showMetricas = SISTEMAS_COM_METRICAS.has(projectName);
    const isSigPaeMetricas = projectName === "SigPAE";
    const isIntranetMetricas = projectName === "Intranet";

    useEffect(() => {
        if (!showMetricas && activeTabValue === "metricas") {
            setActiveTabValue("operacional");
        }
    }, [showMetricas, activeTabValue]);

    return (
        <div className="bg-background px-6 py-4">
            <Tabs
                defaultValue="operacional"
                value={activeTabValue}
                onValueChange={(value) => {
                    setActiveTabValue(value);
                    setActiveTab(value as DashboardTab);
                    if (value === "saude-deploy") triggerDeployTour();
                    if (value === "analytics") triggerAnalyticsTour();
                }}
            >
                <TabsList className="mb-6 px-1">
                    <TabsTrigger value="operacional">Operacional</TabsTrigger>
                    {showMetricas && (
                        <TabsTrigger value="metricas">Métricas</TabsTrigger>
                    )}
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    <TabsTrigger value="saude-deploy">
                        Saúde do deploy
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="operacional">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div
                            id="onboarding-lancamentos"
                            className="col-span-2"
                        >
                            <Releases
                                project={projectName}
                                subprojects={jenkinsSubprojects}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <CardWrapperInfoAmbientes
                            id="onboarding-disponibilidade"
                            title="Disponibilidade do ambiente"
                            className="max-w-sm"
                            tooltipContent={
                                <>
                                    <p className="mb-4">
                                        Essa seção monitora se o sistema está
                                        funcionando e acessível aos usuários.
                                        Disponibilidade significa que o sistema
                                        está no ar e pronto para uso, sem
                                        interrupções.
                                    </p>
                                    <p>
                                        Os ambientes podem estar Disponível,
                                        Indisponível ou em Alerta.
                                    </p>
                                </>
                            }
                        >
                            <Producao
                                className="bg-[#F5F5F5] p-3"
                                projectName={projectNameFrontEnd}
                                unmonitoredLabel={
                                    projectName ? "Sem monitoramento" : undefined
                                }
                            />
                        </CardWrapperInfoAmbientes>

                        <CardWrapperInfoAmbientes
                            id="onboarding-saude-servidor"
                            title="Saúde do servidor (Workloads)"
                            className="max-w-sm"
                            tooltipContent={
                                <>
                                    <p className="mb-4">
                                        A saúde de servidores e workloads
                                        apontam o estado de funcionamento,
                                        desempenho e estabilidade dos recursos
                                        computacionais que suportam aplicações e
                                        serviços de um sistema.
                                    </p>
                                    <p>
                                        O objetivo é garantir que os sistemas
                                        estejam disponíveis, performando bem e
                                        livres de falhas críticas.
                                    </p>
                                </>
                            }
                        >
                            <Filas
                                title="Fila"
                                className="mb-5 bg-[#F5F5F5] p-3"
                                projectName={projectNameFilasRabbitMQ}
                                unmonitoredLabel={
                                    projectName ? "Sem fila" : undefined
                                }
                            />
                            <Producao
                                title="API Service"
                                className="bg-[#F5F5F5] p-3"
                                projectName={projectNameBackEnd}
                                unmonitoredLabel={
                                    projectName ? "Sem API" : undefined
                                }
                            />
                        </CardWrapperInfoAmbientes>

                        <CardWrapperInfoAmbientes
                            id="onboarding-banco-dados"
                            title="Banco de dados"
                            className="max-w-sm"
                            tooltipContent={
                                <>
                                    <p className="mb-4">
                                        Essa seção acompanha a comunicação do
                                        sistema com os bancos de dados e
                                        informações das aplicações.
                                    </p>
                                    <p>
                                        Visa garantir que o banco esteja
                                        funcionando bem, acessível e respondendo
                                        corretamente às consultas das
                                        aplicações.
                                    </p>
                                </>
                            }
                        >
                            <DatabaseStatusCard
                                systemName={projectName}
                                className="bg-[#F5F5F5] p-3"
                            />
                        </CardWrapperInfoAmbientes>
                    </div>

                    <FullWidthSection
                        id="onboarding-bugs"
                        title="Bugs"
                        tooltip={
                            <p>
                                Ao final da página será possível visualizar o
                                registro dos bugs e correções necessárias para o
                                sistema, suas tratativas e andamento para
                                resolução.
                            </p>
                        }
                    >
                        <AzureDevOpsBacklog
                            className="p-[2px]"
                            project={projectName}
                        />
                    </FullWidthSection>
                </TabsContent>

                {showMetricas && (
                    <TabsContent value="metricas">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <ActiveUsersMetricCard systemName={projectName} />
                            <UniqueUsersPerDayCard systemName={projectName} />
                            <TodayAccessCard systemName={projectName} />
                        </div>
                        {isSigPaeMetricas && (
                            <>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <UsersByProfileCard systemName={projectName} />
                                    <AccessComparisonCard
                                        systemName={projectName}
                                        period={accessComparisonPeriod}
                                        onPeriodChange={setAccessComparisonPeriod}
                                    />
                                </div>
                                <AlimentacaoTerceirizadaSection
                                    systemName={projectName}
                                />
                                <LogisticaSection systemName={projectName} />
                            </>
                        )}
                        {isIntranetMetricas && (
                            <>
                                <SorteiosSection systemName={projectName} />
                                <OrdemInscricaoSection systemName={projectName} />
                                <OportunidadesRecrutamentoSection
                                    systemName={projectName}
                                />
                            </>
                        )}
                    </TabsContent>
                )}

                <TabsContent value="analytics">
                    <div
                        id="onboarding-analytics-kpis"
                        className="grid grid-cols-3 gap-4 mb-4"
                    >
                        <ActiveUsersCard
                            systemName={projectName}
                            period={activePeriod}
                        />
                        <AverageSessionCard
                            systemName={projectName}
                            period={activePeriod}
                        />
                        <PeakUsageTodayCard
                            systemName={projectName}
                            period={activePeriod}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div
                            id="onboarding-analytics-users-by-page"
                            className="col-span-2"
                        >
                            <UsersByPageCard
                                systemName={projectName}
                                period={activePeriod}
                            />
                        </div>
                        <div
                            id="onboarding-analytics-device-distribution"
                            className="col-span-2"
                        >
                            <DeviceDistributionCard
                                systemName={projectName}
                                period={activePeriod}
                            />
                        </div>
                    </div>
                    <FullWidthSection
                        id="onboarding-analytics-peak-hours"
                        title="Horários de pico"
                        tooltip={
                            <p>
                                Essa seção mostra os horários com maior volume
                                de acessos ao sistema, permitindo identificar os
                                picos de uso ao longo do dia.
                            </p>
                        }
                    >
                        <PeakHoursChart
                            systemName={projectName}
                            period={activePeriod}
                            className="p-[2px]"
                        />
                    </FullWidthSection>
                </TabsContent>

                <TabsContent value="saude-deploy">
                    <EnvironmentHeader
                        value={deployEnvironment}
                        onChange={setDeployEnvironment}
                    />
                    <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-4">
                        <div
                            id="onboarding-lancamentos"
                            className="lg:col-span-1"
                        >
                            <JenkinsJob
                                project={projectName}
                                subprojects={jenkinsSubprojects}
                                environment={deployEnvironment}
                            />
                        </div>
                        <div
                            id="onboarding-sonar-quality"
                            className="lg:col-span-3"
                        >
                            <SonarQualityIndicatorsCard
                                projectName={projectName}
                                sonarProjectKey={activeProject?.sonarProjectKey}
                                zabbixQueryJenkinsJob={
                                    activeProject?.zabbixQueryJenkinsJob
                                }
                                environment={deployEnvironment}
                            />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
