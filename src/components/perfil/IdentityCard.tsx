import { Check } from "lucide-react";

type IdentityCardProps = Readonly<{
    nomeCompleto: string;
    cargo: string;
    coordenadoria: string;
    contaAtiva: boolean;
    ultimoAcesso: string;
    tempoSessao: string;
}>;

export function IdentityCard({
    nomeCompleto,
    cargo,
    coordenadoria,
    contaAtiva,
    ultimoAcesso,
    tempoSessao,
}: IdentityCardProps) {
    return (
        <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-foreground">{nomeCompleto}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{cargo}</p>
                <p className="text-sm text-muted-foreground">{coordenadoria}</p>

                {contaAtiva && (
                    <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                        <Check className="size-4" aria-hidden="true" />
                        Conta ativa
                    </span>
                )}
            </div>

            <hr className="my-6 border-zinc-200" />

            <dl className="space-y-4 text-center">
                <div>
                    <dt className="text-sm text-muted-foreground">Último acesso</dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{ultimoAcesso}</dd>
                </div>
                <div>
                    <dt className="text-sm text-muted-foreground">Tempo de sessão</dt>
                    <dd className="mt-1 text-sm font-semibold text-foreground">{tempoSessao}</dd>
                </div>
            </dl>
        </div>
    );
}
