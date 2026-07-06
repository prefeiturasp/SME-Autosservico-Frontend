"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/Sidebar/app-sidebar";
import { SessionGuard } from "@/components/dashboard/SessionGuard";

type PerfilShellProps = Readonly<{
    children: React.ReactNode;
    session: Session | null;
}>;

export function PerfilShell({ children, session }: PerfilShellProps) {
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
                        {children}
                    </SidebarInset>
                </SidebarProvider>
            </SessionGuard>
        </SessionProvider>
    );
}
