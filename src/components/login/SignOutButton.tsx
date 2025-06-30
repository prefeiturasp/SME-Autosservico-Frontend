"use client";

import { signOut } from "next-auth/react";
import { Button } from "../ui/button";

export default function SignOutButton() {
    return (
        <>
            <Button
                variant="destructive"
                className="w-full rounded-full text-primary text-[16px] font-[700] md:h-[45px] md:pb-0 inline-block align-middle"
                onClick={() => signOut({ callbackUrl: "/" })}
            >
                Sair
            </Button>
        </>
    );
}
