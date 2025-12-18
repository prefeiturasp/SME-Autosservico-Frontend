import { SidebarItem } from "@/states/dashboard";

import SidebarAscom from "@/assets/icons/SidebarAscom";
import SidebarCodae from "@/assets/icons/SidebarCodae";
import SidebarCoped from "@/assets/icons/SidebarCoped";
import SidebarCoplan from "@/assets/icons/SidebarCoplan";
import SidebarCotic from "@/assets/icons/SidebarCotic";
import SidebarCogep from "@/assets/icons/SidebarCogep";
import SidebarGipe from "@/assets/icons/SidebarGipe";


export const COORDENADORIAS: SidebarItem[] = [
    {
        title: "ASCOM",
        subTitle: "Assessoria de comunicação",
        url: "#",
        icon: SidebarAscom,
    },
    {
        title: "CODAE",
        subTitle: "Coordenadoria de alimentação escolar",
        url: "#",
        icon: SidebarCodae,
    },
    {
        title: "COPED",
        subTitle: "Coordenadoria pedagógica",
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
        title: "COGEP",
        subTitle: "Coordenadoria de Gestão de Pessoas",
        url: "#",
        icon: SidebarCogep,
    },
    {
        title: "GIPE",
        subTitle: "Gabinete Integrado de Proteção Escolar",
        url: "#",
        icon: SidebarGipe,
    },
];
