"use client";

import { signOut } from "next-auth/react";
import { Button, ButtonProps } from "../ui/button";
import { ReactNode } from "react";

interface SignOutButtonProps {
    variant?: ButtonProps["variant"];
    className?: string;
    children?: ReactNode;
    callbackUrl?: string;
}

export default function SignOutButton({
    variant = "destructive",
    className = "",
    children = "Sair",
    callbackUrl = "/",
}: Readonly<SignOutButtonProps>) {

    const handleSignOut = () => {
        signOut({ callbackUrl });
    };

    return (
        <Button
            variant={variant}
            className={className}
            onClick={handleSignOut}
            type="button"
            aria-label="Fazer logout do sistema"
            data-testid="btn-logout"
        >
            {children}
        </Button>
    );
}
