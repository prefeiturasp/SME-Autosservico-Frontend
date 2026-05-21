import {
    Globe,
    MessageCircle,
    Utensils,
    Shield,
    Users,
    BookOpen,
    ClipboardList,
    Building2,
    type LucideIcon,
} from "lucide-react";
import type { CoordenadoriaAcesso } from "@/types/coordenadoriaAcesso";

const COORDENADORIA_ICONS: Record<string, LucideIcon> = {
    ASCOM: MessageCircle,
    CODAE: Utensils,
    COPED: BookOpen,
    COPLAN: ClipboardList,
    COTIC: Globe,
    COGEP: Users,
    GIPE: Shield,
};

type AreasAcessoCardProps = Readonly<{
    coordenadorias: CoordenadoriaAcesso[];
}>;

function CoordenadoriaIcon({ sigla }: { readonly sigla: string }) {
    const Icon = COORDENADORIA_ICONS[sigla.toUpperCase()] ?? Building2;
    return <Icon className="size-6 text-blue-900" strokeWidth={2} aria-hidden="true" />;
}

export function AreasAcessoCard({ coordenadorias }: AreasAcessoCardProps) {
    if (coordenadorias.length === 0) {
        return (
            <section className="rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-foreground">Áreas de acesso</h2>
                <p className="text-sm text-muted-foreground">Nenhuma área de acesso disponível.</p>
            </section>
        );
    }

    return (
        <section className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-foreground">Áreas de acesso</h2>

            <ul className="flex flex-col gap-3">
                {coordenadorias.map((coord) => (
                    <li
                        key={coord.sigla}
                        className="flex flex-col gap-3 rounded-lg bg-zinc-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-100">
                                <CoordenadoriaIcon sigla={coord.sigla} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground">{coord.sigla}</p>
                                <p className="text-xs text-muted-foreground">{coord.descricao}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {coord.areas.map((area) => (
                                <span
                                    key={`${coord.sigla}-${area}`}
                                    className="inline-flex items-center rounded-md bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700"
                                >
                                    {area}
                                </span>
                            ))}
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}
