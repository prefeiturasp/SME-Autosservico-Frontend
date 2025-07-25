import { SidebarItem } from "@/states/dashboard";

import SidebarAscom from "@/assets/icons/SidebarAscom";
import SidebarCoceu from "@/assets/icons/SidebarCoceu";
import SidebarCodae from "@/assets/icons/SidebarCodae";
import SidebarCoped from "@/assets/icons/SidebarCoped";
import SidebarCoplan from "@/assets/icons/SidebarCoplan";
import SidebarCotic from "@/assets/icons/SidebarCotic";


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
        subTitle: "NNN Coordenadoria dos Centros Educacionais Unificados",
        url: "#",
        icon: SidebarCoceu,
    },
    {
        title: "GIPE",
        subTitle: "Gabinete Integrado de Proteção Escolar",
        url: "#",
        icon: SidebarCotic,
    },
];
