"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function SessionGuard({ children }: Readonly<{ children: React.ReactNode }>) {
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            signOut({ callbackUrl: "/?expired=true" });
        }
    }, [status]);

    if (status === "loading" || status === "unauthenticated") {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    return <>{children}</>;
}
