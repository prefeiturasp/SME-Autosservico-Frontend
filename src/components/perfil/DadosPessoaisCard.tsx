import { Pencil } from "lucide-react";

type Field = Readonly<{
    label: string;
    value: string;
}>;

type DadosPessoaisCardProps = Readonly<{
    nomeCompleto: string;
    cpf: string;
    email: string;
    cargo: string;
    coordenadoria: string;
    onEditar?: () => void;
}>;

function FieldItem({ label, value }: Field) {
    return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-sm font-semibold text-foreground break-words">{value}</p>
        </div>
    );
}

export function DadosPessoaisCard({
    nomeCompleto,
    cpf,
    email,
    cargo,
    coordenadoria,
    onEditar,
}: DadosPessoaisCardProps) {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <header className="mb-6 flex items-start justify-between">
                <h2 className="text-base font-bold text-foreground">Dados pessoais</h2>
                <button
                    type="button"
                    onClick={onEditar}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 underline-offset-4 hover:underline focus:outline-none focus-visible:underline"
                    data-testid="btn-editar-dados"
                    aria-label="Editar dados pessoais"
                >
                    <Pencil className="size-4" aria-hidden="true" />
                    Editar
                </button>
            </header>

            <div className="grid grid-cols-1 gap-x-8 gap-y-5 md:grid-cols-2">
                <FieldItem label="Nome completo" value={nomeCompleto} />
                <FieldItem label="CPF" value={cpf} />
                <FieldItem label="E-mail" value={email} />
                <div className="hidden md:block" aria-hidden="true" />
                <FieldItem label="Cargo" value={cargo} />
                <FieldItem label="Coordenadoria" value={coordenadoria} />
            </div>
        </section>
    );
}
