"use client";
import CardWrapperInfoAmbientes from "@/components/dashboard/CardWrapperInfoAmbientes";
import Producao from "@/components/dashboard/DisponibilidadeDosAmbientes/Producao";
import Filas from "@/components/dashboard/SaudeDosServidores/Filas";
import DatabaseStatusCard from "@/components/dashboard/DatabaseStatusCard";
import JenkinsJob from "@/components/dashboard/JenkinsJob";
import AzureDevOpsBacklog from "@/components/dashboard/AzureDevOpsBacklog";
import PeakHoursChart from "@/components/dashboard/PeakHoursChart";
import AverageSessionCard from "@/components/dashboard/AverageSessionCard";
import ActiveUsersCard from "@/components/dashboard/ActiveUsersCard";
import DeviceDistributionCard from "@/components/dashboard/DeviceDistributionCard";
import UsersByPageCard from "@/components/dashboard/UsersByPageCard";
import PeakUsageTodayCard from "@/components/dashboard/PeakUsageTodayCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useDashboardStore from "@/states/dashboard";

type FullWidthSectionProps = {
    readonly id?: string;
    readonly title: string;
    readonly tooltip: React.ReactNode;
    readonly children: React.ReactNode;
};

function FullWidthSection({ id, title, tooltip, children }: FullWidthSectionProps) {
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
    const projectName = activeProject?.nome?.trim() ?? "";
    const projectNameFrontEnd = activeProject?.zabbixQueryFrontend?.trim() ?? "";
    const projectNameBackEnd = activeProject?.zabbixQueryBackend?.trim() ?? "";
    const projectNameFilasRabbitMQ = activeProject?.zabbixQueryFilasRabbitMQ?.trim() ?? "";
    const jenkinsSubprojects = activeProject?.jenkinsSubprojects ?? [];

    return (
        <div className="border-b bg-background px-6 py-4">
            <Tabs defaultValue="operacional">
                <TabsList className="mb-6 px-1">
                    <TabsTrigger value="operacional">Operacional</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="operacional">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <div id="onboarding-lancamentos" className="col-span-2">
                            <JenkinsJob project={projectName} subprojects={jenkinsSubprojects} />
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
                                        Essa seção monitora se o sistema está funcionando e acessível aos usuários.
                                        Disponibilidade significa que o sistema está no ar e pronto para uso, sem interrupções.
                                    </p>
                                    <p>
                                        Os ambientes podem estar Disponível, Indisponível ou em Alerta.
                                    </p>
                                </>
                            }
                        >
                            <Producao
                                className="bg-[#F5F5F5] p-3"
                                projectName={projectNameFrontEnd}
                            />
                        </CardWrapperInfoAmbientes>

                        <CardWrapperInfoAmbientes
                            id="onboarding-saude-servidor"
                            title="Saúde do servidor (Workloads)"
                            className="max-w-sm"
                            tooltipContent={
                                <>
                                    <p className="mb-4">
                                        A saúde de servidores e workloads apontam o estado de funcionamento, desempenho e
                                        estabilidade dos recursos computacionais que suportam aplicações e serviços de um sistema.
                                    </p>
                                    <p>
                                        O objetivo é garantir que os sistemas estejam disponíveis, performando bem e livres de falhas críticas.
                                    </p>
                                </>
                            }
                        >
                            <Filas
                                title="Fila"
                                className="mb-5 bg-[#F5F5F5] p-3"
                                projectName={projectNameFilasRabbitMQ}
                            />
                            <Producao
                                title="API Service"
                                className="bg-[#F5F5F5] p-3"
                                projectName={projectNameBackEnd}
                            />
                        </CardWrapperInfoAmbientes>

                        <CardWrapperInfoAmbientes
                            id="onboarding-banco-dados"
                            title="Banco de dados"
                            className="max-w-sm"
                            tooltipContent={
                                <>
                                    <p className="mb-4">
                                        Essa seção acompanha a comunicação do sistema com
                                        os bancos de dados e informações das aplicações.
                                    </p>
                                    <p>
                                        Visa garantir que o banco esteja funcionando bem,
                                        acessível e respondendo corretamente às consultas
                                        das aplicações.
                                    </p>
                                </>
                            }
                        >
                            <DatabaseStatusCard systemName={projectName} className="bg-[#F5F5F5] p-3" />
                        </CardWrapperInfoAmbientes>
                    </div>

                    <FullWidthSection
                        id="onboarding-bugs"
                        title="Bugs"
                        tooltip={
                            <p>
                                Ao final da página será possível visualizar o registro dos bugs e
                                correções necessárias para o sistema, suas tratativas e andamento para
                                resolução.
                            </p>
                        }
                    >
                        <AzureDevOpsBacklog className="p-[2px]" project={projectName} />
                    </FullWidthSection>
                </TabsContent>

                <TabsContent value="analytics">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <ActiveUsersCard systemName={projectName} />
                        <AverageSessionCard systemName={projectName} />
                        <PeakUsageTodayCard systemName={projectName} />
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-4">
                        <UsersByPageCard systemName={projectName} className="col-span-2" />
                        <DeviceDistributionCard systemName={projectName} className="col-span-2" />
                    </div>
                    <FullWidthSection
                        title="Horários de pico"
                        tooltip={
                            <p>
                                Essa seção mostra os horários com maior volume de acessos ao sistema,
                                permitindo identificar os picos de uso ao longo do dia.
                            </p>
                        }
                    >
                        <PeakHoursChart systemName={projectName} className="p-[2px]" />
                    </FullWidthSection>
                </TabsContent>
            </Tabs>
        </div>
    );
}
