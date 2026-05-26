"use client";

import { useSession } from "next-auth/react";
import { IdentityCard } from "@/components/perfil/IdentityCard";
import { AccountActionsCard } from "@/components/perfil/AccountActionsCard";
import { DadosPessoaisCard } from "@/components/perfil/DadosPessoaisCard";
import { AreasAcessoCard } from "@/components/perfil/AreasAcessoCard";
import { useAreasAcesso } from "@/hooks/useAreasAcesso";
import { formatCpfMasked, formatUltimoAcesso } from "@/lib/utils";

const SITUACAO_USUARIO_ATIVO = 1;
const EMPTY_FIELD = "—";

export default function PerfilPage() {
    const { data: session } = useSession();
    const coordenadoriasAcesso = useAreasAcesso();

    const nomeCompleto = session?.user?.name ?? EMPTY_FIELD;
    const contaAtiva = session?.user?.situacaoUsuario === SITUACAO_USUARIO_ATIVO;
    const cpf = formatCpfMasked(session?.user?.cpf) ?? EMPTY_FIELD;
    const email = session?.user?.email ?? EMPTY_FIELD;
    const cargo = session?.user?.cargo ?? EMPTY_FIELD;
    const coordenadoria = session?.user?.coordenadoria ?? EMPTY_FIELD;
    const ultimoAcesso = formatUltimoAcesso(session?.user?.ultimo_acesso) ?? EMPTY_FIELD;
    const tempoSessao = session?.user?.tempo_sessao ?? EMPTY_FIELD;

    return (
        <div className="px-6 py-6">
            <header className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Meu perfil</h1>
            </header>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <aside className="flex flex-col gap-6 lg:col-span-1">
                    <IdentityCard
                        nomeCompleto={nomeCompleto}
                        cargo={cargo}
                        coordenadoria={coordenadoria}
                        contaAtiva={contaAtiva}
                        ultimoAcesso={ultimoAcesso}
                        tempoSessao={tempoSessao}
                    />
                    <AccountActionsCard />
                </aside>

                <div className="flex flex-col gap-6 lg:col-span-2">
                    <DadosPessoaisCard
                        nomeCompleto={nomeCompleto}
                        cpf={cpf}
                        email={email}
                        cargo={cargo}
                        coordenadoria={coordenadoria}
                    />
                    <AreasAcessoCard coordenadorias={coordenadoriasAcesso} />
                </div>
            </div>
        </div>
    );
}
