import { SidebarItem } from "@/states/dashboard";

import SidebarAscom from "@/assets/icons/SidebarAscom";
import SidebarCodae from "@/assets/icons/SidebarCodae";
import SidebarCogep from "@/assets/icons/SidebarCogep";
import SidebarCoped from "@/assets/icons/SidebarCoped";
import SidebarCoplan from "@/assets/icons/SidebarCoplan";
import SidebarCotic from "@/assets/icons/SidebarCotic";
import SidebarEmforpef from "@/assets/icons/SidebarEmforpef";
import SidebarGipe from "@/assets/icons/SidebarGipe";


export const COORDENADORIAS: SidebarItem[] = [
    {
        title: "ASCOM",
        subTitle: "Assessoria de Comunicação",
        url: "#",
        icon: SidebarAscom,
    },
    {
        title: "CODAE",
        subTitle: "Coordenadoria de Alimentação Escolar",
        url: "#",
        icon: SidebarCodae,
    },
    {
        title: "COGEP",
        subTitle: "Coordenadoria de Gestão de Pessoas",
        url: "#",
        icon: SidebarCogep,
    },
    {
        title: "COPED",
        subTitle: "Coordenadoria Pedagógica",
        url: "#",
        icon: SidebarCoped,
    },
    {
        title: "COPLAN",
        subTitle: "Coordenadoria de Planejamento e Orçamento",
        url: "#",
        icon: SidebarCoplan,
    },
    {
        title: "COTIC",
        subTitle: "Coordenadoria de Tecnologia da Informação e Comunicação",
        url: "#",
        icon: SidebarCotic,
    },
    {
        title: "EMFORPEF",
        subTitle: "Escola Municipal de Formação e Aperfeiçoamento dos Profissionais da Educação",
        url: "#",
        icon: SidebarEmforpef,
    },
    {
        title: "GIPE",
        subTitle: "Gabinete Integrado de Proteção Escolar",
        url: "#",
        icon: SidebarGipe,
    },
];
