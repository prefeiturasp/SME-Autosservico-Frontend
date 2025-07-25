"use client";
import React, { useEffect, useMemo } from "react";

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
import { useAllowedSquads } from "@/hooks/useAllowedSquads";
import { CustomTrigger } from "./custom-trigger";
import { COORDENADORIAS } from "./coordenadorias";

import LogoutIcon from "@/assets/icons/Logout";
import { Button } from "../../ui/button";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();

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

    const handleItemClick = (item: (typeof COORDENADORIAS)[0]) => {
        setActiveItem({
            title: item.title,
            subTitle: item.subTitle,
            url: item.url,
            icon: item.icon
        });
    };

    return (
        <Sidebar
            collapsible="icon"
            data-testid="sidebar-root"
            {...props}
            className="!rounded-xl m-2 ollyver"
        >
            <SidebarHeader>
                <CustomTrigger />
            </SidebarHeader>
            <SidebarContent>
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
                                        onClick={() => handleItemClick(item)}
                                        //className="px-5 rounded-sm h-auto bg-[#3B82F6] text-white hover:bg-[rgba(59,130,246,0.5)] hover:text-white"
                                        className={`px-5 rounded-sm h-auto transition-colors
                                            ${
                                                activeItem?.title === item.title
                                                    ? "bg-[#3B82F6] text-white"
                                                    : "hover:bg-[rgba(59,130,246,0.5)] hover:text-white"
                                            }
                                        `}
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
                    {open && <span>Sair</span>} <LogoutIcon />
                </Button>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
