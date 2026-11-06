import { cn } from "@/lib/utils";
import type { GranularidadeAcessos } from "@/types/sgpControleAcessos";

type Props = {
    readonly value: GranularidadeAcessos;
    readonly onChange: (next: GranularidadeAcessos) => void;
    readonly className?: string;
};

const OPCOES: ReadonlyArray<{ value: GranularidadeAcessos; label: string }> = [
    { value: "hora", label: "Hora" },
    { value: "dia", label: "Dia" },
    { value: "mes", label: "Mês" },
    { value: "ano", label: "Ano" },
];

export default function GranularidadeAcessosSwitcher({
    value,
    onChange,
    className,
}: Props) {
    return (
        <fieldset className={cn("inline-flex items-center gap-2", className)}>
            <legend className="sr-only">
                Selecionar granularidade do gráfico
            </legend>
            {OPCOES.map((opcao) => {
                const isSelected = opcao.value === value;
                return (
                    <label
                        key={opcao.value}
                        className={cn(
                            "inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-xs font-medium transition-colors focus-within:ring-2 focus-within:ring-[#2563EB]",
                            isSelected
                                ? "border-[#1E4D8C] bg-[#1E4D8C] text-white"
                                : "border-[#E2E8F0] bg-white text-[#111827] hover:bg-gray-50",
                        )}
                    >
                        <input
                            type="radio"
                            name="granularidade-acessos-sgp"
                            value={opcao.value}
                            checked={isSelected}
                            onChange={() => onChange(opcao.value)}
                            className="sr-only"
                        />
                        {opcao.label}
                    </label>
                );
            })}
        </fieldset>
    );
}
