import { auth } from "@/lib/auth";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return <DashboardShell session={session}>{children}</DashboardShell>;
}
