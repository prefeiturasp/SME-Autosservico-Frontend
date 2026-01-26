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
import { WelcomeModal } from "@/components/dashboard/Onboarding/WelcomeModal";
import { TourOverlay } from "@/components/dashboard/Onboarding/TourOverlay";

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
                    <div id="onboarding-header-section">
                        <PageHeader />
                        <SelectSistemas />
                    </div>
                    {children}
                </SidebarInset>
                <WelcomeModal />
                <TourOverlay />
            </SidebarProvider>
        </SessionProvider>
    );
}
