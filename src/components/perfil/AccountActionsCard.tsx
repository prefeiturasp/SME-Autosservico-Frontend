"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

type AccountActionsCardProps = Readonly<{
    onAlterarSenha?: () => void;
}>;

export function AccountActionsCard({ onAlterarSenha }: AccountActionsCardProps) {
    const handleEncerrarSessao = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-6 shadow-sm">
            <button
                type="button"
                onClick={onAlterarSenha}
                className="text-sm font-semibold text-sky-600 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                data-testid="btn-alterar-senha"
            >
                Alterar senha
            </button>

            <button
                type="button"
                onClick={handleEncerrarSessao}
                className="inline-flex items-center gap-2 text-sm font-semibold text-red-600 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                data-testid="btn-encerrar-sessao"
            >
                <LogOut className="size-4" aria-hidden="true" />
                Encerrar sessão
            </button>
        </div>
    );
}
