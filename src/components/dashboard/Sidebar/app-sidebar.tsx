"use client";
import React, { useCallback, useEffect, useMemo } from "react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar";

import useDashboardStore from "@/states/dashboard";
import { useAllowedSquads } from "@/hooks/useAllowedSquads";
import { useSession } from "next-auth/react";
import { CustomTrigger } from "./custom-trigger";
import { COORDENADORIAS } from "./coordenadorias";

import LogoutIcon from "@/assets/icons/Logout";
import SignOutButton from "@/components/login/SignOutButton";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();

    const activeItem = useDashboardStore((state) => state.activeItem);
    const setActiveItem = useDashboardStore((state) => state.setActiveItem);

    const allowedSquads = useAllowedSquads();
    const { data: session } = useSession();
    // Debug: logar AUTH_VERSION, session.user, allowedSquads e allowedItems
    // eslint-disable-next-line no-undef
    const AUTH_VERSION = process.env.NEXT_PUBLIC_AUTH_VERSION ?? "v1";
    console.log("[DEBUG] app-sidebar AUTH_VERSION (sidebar):", AUTH_VERSION);
    console.log("[DEBUG] app-sidebar session.user (sidebar):", session?.user);
    console.log("[DEBUG] app-sidebar allowedSquads (sidebar):", allowedSquads);

    const allowedItems = useMemo(
        () => COORDENADORIAS.filter((item) => allowedSquads.includes(item.title)),
        [allowedSquads]
    );

    console.log("[DEBUG] allowedItems (sidebar):", allowedItems);

    useEffect(() => {
        if (!activeItem && allowedItems.length > 0) {
            setActiveItem(allowedItems[0]);
        }
    }, [activeItem, allowedItems, setActiveItem]);

    const handleItemClick = useCallback((item: (typeof COORDENADORIAS)[0]) => {
        setActiveItem({
            title: item.title,
            subTitle: item.subTitle,
            url: item.url,
            icon: item.icon
        });
    }, [setActiveItem]);

    // Mostrar loading enquanto não tem dados
    if (allowedItems.length === 0) {
        return (
            <Sidebar collapsible="icon" data-testid="sidebar-root" {...props} className="m-2">
                <SidebarContent>
                    <div className="p-4">Carregando...</div>
                </SidebarContent>
            </Sidebar>
        );
    }


    return (
        <Sidebar
            collapsible="icon"
            data-testid="sidebar-root"
            {...props}
            className="m-2"
        >
            <SidebarHeader>
                <CustomTrigger />
            </SidebarHeader>
            <SidebarContent className="custom-scrollbar overflow-y-auto">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {allowedItems.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    className="my-1"
                                >
                                    <SidebarMenuButton
                                        asChild
                                        isActive={
                                            activeItem?.title === item.title
                                        }
                                        data-testid={`sidebar-button-${item.title.toLowerCase()}`}
                                        onClick={() => handleItemClick(item)}
                                        className={`px-4 rounded-sm h-auto transition-colors
                                            ${
                                                activeItem?.title === item.title
                                                    ? "bg-[#3B82F6] text-white"
                                                    : "hover:bg-[rgba(59,130,246,0.5)] hover:text-white"
                                            }
                                        `}
                                    >
                                        <span
                                            className={`${open ? "!items-start" : ""} flex gap-3 cursor-pointer [&_svg]:!size-6`}
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
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SignOutButton
                    variant="link"
                    className={`${
                        open && "justify-end"
                    } [&_svg]:size-7 text-white no-underline hover:no-underline text-right`}
                >
                    {open && <span>Sair</span>} <LogoutIcon />
                </SignOutButton>
            </SidebarFooter>
        </Sidebar>
    );
}
