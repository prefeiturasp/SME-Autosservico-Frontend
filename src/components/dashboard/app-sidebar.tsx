"use client";
import React from "react";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import useDashboardStore from "@/states/dashboard";

import SidebarAscom from "@/assets/icons/SidebarAscom";
import SidebarCoceu from "@/assets/icons/SidebarCoceu";
import SidebarCodae from "@/assets/icons/SidebarCodae";
import SidebarCoped from "@/assets/icons/SidebarCoped";
import SidebarCoplan from "@/assets/icons/SidebarCoplan";
import SidebarCotic from "@/assets/icons/SidebarCotic";
import SidebarMenuClose from "@/assets/icons/SidebarMenuClose";
import SidebarMenuOpen from "@/assets/icons/SidebarMenuOpen";
import LogoutIcon from "@/assets/icons/Logout";
import LogoDevops from "@/assets/images/logo_devops.webp";
import { Button } from "../ui/button";

const items = [
    {
        title: "ASCOM",
        subTitle: "Assessoria de comunicação",
        url: "#",
        icon: SidebarAscom,
    },
    {
        title: "COCEU",
        subTitle: "Coordenadoria dos Centros Educacionais Unificados",
        url: "#",
        icon: SidebarCoceu,
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
];

export function CustomTrigger() {
    const { toggleSidebar, open } = useSidebar();
    return (
        <div
            className={`${
                open
                    ? "flex items-center justify-between w-full px-4 py-3"
                    : "text-center"
            }`}
        >
            {open ? (
                <>
                    <div className="flex-shrink-0">
                        <Image
                            src={LogoDevops}
                            alt="Logo AutoServiço"
                            sizes="(min-width: 880px) 134w, 108w"
                            className="w-[108px] md:w-[80px]"
                            loading="lazy"
                            fetchPriority="low"
                            width={LogoDevops.width}
                            height={LogoDevops.height}
                        />
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="flex-shrink-0 p-2 rounded-md"
                    >
                        <SidebarMenuClose />
                    </button>
                </>
            ) : (
                <button onClick={toggleSidebar}>
                    <SidebarMenuOpen />
                </button>
            )}
        </div>
    );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();

    const activeItem = useDashboardStore((state) => state.activeItem);
    const setActiveItem = useDashboardStore((state) => state.setActiveItem);

    const handleItemClick = (item: (typeof items)[0]) => {
        setActiveItem({
            title: item.title,
            subTitle: item.subTitle,
            url: item.url,
        });
    };

    return (
        <Sidebar collapsible="icon" data-testid="sidebar-root" {...props}>
            <SidebarHeader>
                <CustomTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className="my-1"
                                >
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            activeItem?.title === item.title
                                        }
                                        onClick={() => handleItemClick(item)}
                                        className="px-5 rounded-sm h-auto"
                                    >
                                        <a
                                            href={item.url}
                                            className={`${
                                                open ? "!items-start" : ""
                                            } flex gap-3`}
                                        >
                                            <item.icon className="mt-1 flex-shrink-0" />
                                            <div className="flex flex-col gap-0.5 min-w-0 items-start">
                                                <span className="font-semibold text-sm leading-tight">
                                                    {item.title}
                                                </span>
                                                <span className="text-xs leading-tight">
                                                    {item.subTitle}
                                                </span>
                                            </div>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button
                    variant="link"
                    className={`${
                        open && "justify-end"
                    } [&_svg]:size-7 text-white no-underline hover:no-underline text-right`}
                >
                    {open && <span>Sair</span>}{" "}
                    <LogoutIcon/>
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
