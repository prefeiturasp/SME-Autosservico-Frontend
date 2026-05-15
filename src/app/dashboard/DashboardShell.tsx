"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
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
import { SessionGuard } from "@/components/dashboard/SessionGuard";

type DashboardShellProps = Readonly<{
    children: React.ReactNode;
    session: Session | null;
}>;

export function DashboardShell({ children, session }: DashboardShellProps) {
    return (
        <SessionProvider
            session={session}
            refetchInterval={5 * 60}
            refetchOnWindowFocus={false}
            refetchWhenOffline={false}
        >
            <SessionGuard>
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
            </SessionGuard>
        </SessionProvider>
    );
}
