"use client";

import Link from "next/link";
import PerfilIcon from "@/assets/icons/Perfil";
import { cn } from "@/lib/utils";

interface ProfileLinkProps {
    className?: string;
    showLabel?: boolean;
}

export default function ProfileLink({
    className = "",
    showLabel = true,
}: Readonly<ProfileLinkProps>) {
    return (
        <Link
            href="/perfil"
            aria-label="Acessar meu perfil"
            data-testid="btn-perfil"
            className={cn(
                "inline-flex items-center gap-2 py-2 text-sm font-medium text-white [&_svg]:size-7",
                showLabel ? "px-4" : "px-0",
                className,
            )}
        >
            {showLabel && <span>Perfil</span>}
            <PerfilIcon />
        </Link>
    );
}
