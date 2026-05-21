"use client";

import { useSession } from "next-auth/react";
import { HelpCircle } from "lucide-react";
import { IdentityCard } from "@/components/perfil/IdentityCard";
import { AccountActionsCard } from "@/components/perfil/AccountActionsCard";
import { DadosPessoaisCard } from "@/components/perfil/DadosPessoaisCard";
import { AreasAcessoCard } from "@/components/perfil/AreasAcessoCard";
import { useAreasAcesso } from "@/hooks/useAreasAcesso";
import { formatCpfMasked } from "@/lib/utils";

const SITUACAO_USUARIO_ATIVO = 1;
const EMPTY_FIELD = "—";

export default function PerfilPage() {
    const { data: session } = useSession();
    const coordenadoriasAcesso = useAreasAcesso();

    const nomeCompleto = session?.user?.name ?? EMPTY_FIELD;
    const contaAtiva = session?.user?.situacaoUsuario === SITUACAO_USUARIO_ATIVO;
    const cpf = formatCpfMasked(session?.user?.cpf) ?? EMPTY_FIELD;
    const email = session?.user?.email ?? EMPTY_FIELD;

    return (
        <div className="px-6 py-6">
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Meu perfil</h1>
                <button
                    type="button"
                    className="rounded-full p-1 text-sky-600 transition-colors hover:bg-sky-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                    aria-label="Ajuda"
                    data-testid="btn-ajuda-perfil"
                >
                    <HelpCircle className="size-6" aria-hidden="true" />
                </button>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <aside className="flex flex-col gap-6 lg:col-span-1">
                    <IdentityCard
                        nomeCompleto={nomeCompleto}
                        cargo={EMPTY_FIELD}
                        coordenadoria={EMPTY_FIELD}
                        contaAtiva={contaAtiva}
                        ultimoAcesso={EMPTY_FIELD}
                        tempoSessao={EMPTY_FIELD}
                    />
                    <AccountActionsCard />
                </aside>

                <div className="flex flex-col gap-6 lg:col-span-2">
                    <DadosPessoaisCard
                        nomeCompleto={nomeCompleto}
                        cpf={cpf}
                        email={email}
                        cargo={EMPTY_FIELD}
                        coordenadoria={EMPTY_FIELD}
                    />
                    <AreasAcessoCard coordenadorias={coordenadoriasAcesso} />
                </div>
            </div>
        </div>
    );
}
