import { auth } from "@/lib/auth";
import { PerfilShell } from "./PerfilShell";

export default async function PerfilLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return <PerfilShell session={session}>{children}</PerfilShell>;
}
