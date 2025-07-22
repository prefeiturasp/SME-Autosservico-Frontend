import "@/styles/globals.scss";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { PageHeader } from "@/components/dashboard/page-header";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <SidebarTrigger className="md:hidden" />
                <PageHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
