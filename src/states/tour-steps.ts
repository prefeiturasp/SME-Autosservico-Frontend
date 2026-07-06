export type TourStep = {
    id: string;
    targetId: string;
    title: string;
    description: string;
    placement: "top" | "bottom" | "left" | "right";
    spotlightWidth?: number;
    spotlightHeight?: number;
    spotlightPadding?: number;
    spotlightPaddingY?: number;
    spotlightBorderRadius?: number;
    centered?: boolean;
};

export const TOUR_STEPS: TourStep[] = [
    {
        id: "area-coordenadoria",
        targetId: "onboarding-page-title",
        title: "Área ou Coordenadoria",
        description:
            "No topo da página você visualiza o nome da sua área ou coordenadoria.",
        placement: "right",
        spotlightHeight: 225,
    },
    {
        id: "sistema",
        targetId: "onboarding-page-title",
        title: "Sistema",
        description:
            "No seletor você pode escolher de qual sistema deseja visualizar as informações.",
        placement: "bottom",
        spotlightHeight: 225,
    },
    {
        id: "lancamento-versoes",
        targetId: "onboarding-lancamentos",
        title: "Lançamento de Versões",
        description:
            "Nesta área você poderá visualizar as últimas versões publicadas e/ou previstas para publicação.",
        placement: "bottom",
    },
    {
        id: "disponibilidade-ambientes",
        targetId: "onboarding-disponibilidade",
        title: "Disponibilidade dos ambientes",
        description:
            "Nesta seção estarão visíveis as informações de disponibilidade dos ambientes de Produção, Homologação, Testes e Desenvolvimento.",
        placement: "right",
        centered: true,
    },
    {
        id: "saude-servidor",
        targetId: "onboarding-saude-servidor",
        title: "Saúde do servidor (Workloads)",
        description:
            "Nesta seção será possível acompanhar a saúde dos recursos computacionais para disponibilização do sistema, servidores, filas de publicação, comunicação com APIs, entre outros itens.",
        placement: "right",
        centered: true,
    },
    {
        id: "banco-dados",
        targetId: "onboarding-banco-dados",
        title: "Banco de dados",
        description:
            "Essa seção acompanha a comunicação do sistema com os bancos de dados e informações das aplicações. Visa garantir que o banco esteja funcionando bem, acessível e respondendo corretamente às consultas das aplicações.",
        placement: "right",
        centered: true,
    },
    {
        id: "bugs",
        targetId: "onboarding-bugs",
        title: "Bugs",
        description:
            "Ao final da página será possível visualizar o registro dos bugs e correções necessárias para o sistema, suas tratativas e andamento para resolução.",
        placement: "top",
    },
];

export const ANALYTICS_TOUR_STEPS: TourStep[] = [
    {
        id: "analytics-period-switcher",
        targetId: "onboarding-analytics-period",
        title: "Seletor de período",
        description:
            "No seletor você pode escolher o período de análise: Hoje, 7 dias ou 30 dias. Todos os dados da tela respondem a esses filtros.",
        placement: "bottom",
        spotlightPadding: 4,
        spotlightPaddingY: 8,
        spotlightBorderRadius: 8,
    },
    {
        id: "analytics-kpis",
        targetId: "onboarding-analytics-kpis",
        title: "Principais KPIs",
        description:
            "Nesses cards você vai ver os números mais importantes: usuários ativos, média de duração de sessão e horário de pico do dia.",
        placement: "bottom",
    },
    {
        id: "analytics-users-by-page",
        targetId: "onboarding-analytics-users-by-page",
        title: "Usuários por página",
        description:
            "Veja a quantidade de usuários que acessam as páginas do sistema e compare com a média histórica.",
        placement: "right",
        centered: true,
    },
    {
        id: "analytics-device-distribution",
        targetId: "onboarding-analytics-device-distribution",
        title: "Tipo de dispositivo",
        description:
            "Veja a distribuição de acessos por desktop, mobile e tablet. O alerta aparece quando identificamos uma possível melhoria.",
        placement: "left",
        centered: true,
    },
    {
        id: "analytics-peak-hours",
        targetId: "onboarding-analytics-peak-hours",
        title: "Horários de pico",
        description:
            "Gráfico de barras com a distribuição de acessos ao longo do dia.",
        placement: "top",
    },
];

export const DEPLOY_HEALTH_TOUR_STEPS: TourStep[] = [
    {
        id: "deploy-environment-switcher",
        targetId: "onboarding-environment-switcher",
        title: "Seletor de ambiente",
        description:
            "Aqui você alterna entre os ambientes de Produção, Homologação e QA. Todos os dados correspondem ao ambiente selecionado.",
        placement: "bottom",
        spotlightPadding: 4,
        spotlightPaddingY: 8,
        spotlightBorderRadius: 8,
    },
    {
        id: "deploy-jenkins",
        targetId: "onboarding-lancamentos",
        title: "Jenkins",
        description:
            "Nessa sessão, você vai acompanhar a saúde da esteira de desenvolvimento.",
        placement: "right",
        spotlightBorderRadius: 5,
    },
    {
        id: "deploy-sonar-quality",
        targetId: "onboarding-sonar-quality",
        title: "Qualidade do código",
        description:
            "Visão geral da qualidade do código com métricas detalhadas e ratings de confiabilidade, segurança e manutenção.",
        placement: "top",
        spotlightBorderRadius: 6,
    },
];
