"use client";
import { SessionProvider } from "next-auth/react";
import "@/styles/globals.scss";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar/app-sidebar";
import { PageHeader } from "@/components/dashboard/page-header";
import { SelectSistemas } from "@/components/dashboard/SelectSistemas";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SessionProvider
            refetchInterval={5 * 60} // 5 minutos
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
        >
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <SidebarTrigger className="md:hidden" />
                    <PageHeader />
                    <SelectSistemas />
                    {children}
                </SidebarInset>
            </SidebarProvider>
        </SessionProvider>
    );
}
