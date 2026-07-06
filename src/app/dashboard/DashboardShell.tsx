"use client";

import AnalyticsFilters from "@/components/dashboard/Analytics/AnalyticsFilters";
import { AnalyticsTourOverlay } from "@/components/dashboard/Onboarding/AnalyticsTourOverlay";
import { DeployHealthTourOverlay } from "@/components/dashboard/Onboarding/DeployHealthTourOverlay";
import { TourOverlay } from "@/components/dashboard/Onboarding/TourOverlay";
import { WelcomeModal } from "@/components/dashboard/Onboarding/WelcomeModal";
import { PageHeader } from "@/components/dashboard/page-header";
import { SelectSistemas } from "@/components/dashboard/SelectSistemas";
import { SessionGuard } from "@/components/dashboard/SessionGuard";
import { AppSidebar } from "@/components/dashboard/Sidebar/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

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
                            <SelectSistemas rightSlot={<AnalyticsFilters />} />
                        </div>
                        {children}
                    </SidebarInset>
                    <WelcomeModal />
                    <TourOverlay />
                    <DeployHealthTourOverlay />
                    <AnalyticsTourOverlay />
                </SidebarProvider>
            </SessionGuard>
        </SessionProvider>
    );
}
