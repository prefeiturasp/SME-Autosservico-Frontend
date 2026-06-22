"use client";
import React, { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";

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
import { CustomTrigger } from "./custom-trigger";
import { COORDENADORIAS } from "./coordenadorias";

import LogoutIcon from "@/assets/icons/Logout";
import SignOutButton from "@/components/login/SignOutButton";
import ProfileLink from "@/components/perfil/ProfileLink";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();
    const router = useRouter();
    const pathname = usePathname();

    const activeItem = useDashboardStore((state) => state.activeItem);
    const setActiveItem = useDashboardStore((state) => state.setActiveItem);

    const allowedSquads = useAllowedSquads();

    const allowedItems = useMemo(
        () => COORDENADORIAS.filter((item) => allowedSquads.includes(item.title)),
        [allowedSquads]
    );

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
        if (!pathname?.startsWith("/dashboard")) {
            router.push("/dashboard");
        }
    }, [setActiveItem, pathname, router]);

    if (allowedItems.length === 0) {
        return (
            <Sidebar collapsible="icon" data-testid="sidebar-root" {...props} className="m-2">
                <SidebarContent>
                    <div className="p-4 text-sm text-gray-500">
                        Nenhuma coordenadoria disponível para o seu perfil.
                    </div>
                </SidebarContent>
                <SidebarFooter>
                    <ProfileLink className="justify-start px-4" />
                    <SignOutButton
                        variant="link"
                        className="[&_svg]:size-7 text-white no-underline hover:no-underline justify-start px-4"
                    >
                        <LogoutIcon /> <span>Sair</span>
                    </SignOutButton>
                    <p className="text-center text-[10px] text-white/60 pb-1">
                        Licença AGPL V3
                    </p>
                </SidebarFooter>
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
                                        className={`px-4 rounded-sm h-[55px] transition-colors
                                            ${
                                                activeItem?.title === item.title
                                                    ? "bg-[#3B82F6] text-white"
                                                    : "hover:bg-[rgba(59,130,246,0.5)] hover:text-white"
                                            }
                                        `}
                                    >
                                        <span
                                            className="flex items-center gap-3 cursor-pointer [&_svg]:!size-6"
                                        >
                                            <item.icon className="flex-shrink-0" />
                                            {open && (
                                                <span className="font-semibold text-sm leading-tight">
                                                    {item.title}
                                                </span>
                                            )}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ProfileLink
                    className={open ? "justify-start px-4" : "justify-center"}
                    showLabel={open}
                />
                <SignOutButton
                    variant="link"
                    className={`${
                        open ? "justify-start px-4" : "justify-center"
                    } [&_svg]:size-7 text-white no-underline hover:no-underline`}
                >
                    <LogoutIcon /> {open && <span>Sair</span>}
                </SignOutButton>
                {open && (
                    <p className="text-center text-[10px] text-white/60 pb-1">
                        Licença AGPL V3
                    </p>
                )}
            </SidebarFooter>
        </Sidebar>
    );
}
