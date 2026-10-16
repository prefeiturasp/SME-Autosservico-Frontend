import { cn } from "@/lib/utils";
import type { SigEscolaFiltroModo } from "@/types/sigEscolaFiltros";

type Option = {
    value: SigEscolaFiltroModo;
    label: string;
};

const FILTRAR_POR_OPTIONS: ReadonlyArray<Option> = [
    { value: "periodo", label: "Período" },
    { value: "intervalo", label: "Intervalo de datas" },
];

type Props = {
    readonly value: SigEscolaFiltroModo;
    readonly onChange: (next: SigEscolaFiltroModo) => void;
    readonly className?: string;
    readonly name?: string;
    readonly id?: string;
};

export default function FiltrarPorSwitcher({
    value,
    onChange,
    className,
    name = "filtrar-por",
    id,
}: Props) {
    return (
        <fieldset
            id={id}
            className={cn(
                "inline-flex overflow-hidden rounded-[4px] border border-[#D8D8D8] h-[36px]",
                className,
            )}
        >
            <legend className="sr-only">Filtrar por</legend>
            {FILTRAR_POR_OPTIONS.map((option) => {
                const isSelected = option.value === value;
                return (
                    <label
                        key={option.value}
                        className={cn(
                            "inline-flex cursor-pointer items-center px-4 py-1.5 text-xs font-medium transition-colors focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:ring-inset",
                            isSelected
                                ? "bg-[#1E3A8A] text-white"
                                : "bg-white text-[#111827] hover:bg-gray-50",
                        )}
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={isSelected}
                            onChange={() => onChange(option.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                );
            })}
        </fieldset>
    );
}
