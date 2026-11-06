"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";

type Props = {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly options: ReadonlyArray<PeriodoSgpOption>;
  readonly className?: string;
};

const GRUPOS = [
  { segmento: "fundamental_medio", titulo: "Fundamental e Médio" },
  { segmento: "eja", titulo: "EJA" },
] as const;

export default function PeriodoSgpSelect({
  value,
  onChange,
  options,
  className,
}: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[260px]", className)}
        aria-label="Selecionar período"
      >
        <SelectValue placeholder="Carregando períodos..." />
      </SelectTrigger>
      <SelectContent>
        {GRUPOS.map(({ segmento, titulo }) => {
          // Mais recentes primeiro.
          const opcoes = options
            .filter((opcao) => opcao.segmento === segmento)
            .reverse();
          if (opcoes.length === 0) return null;
          return (
            <SelectGroup key={segmento}>
              <SelectLabel>{titulo}</SelectLabel>
              {opcoes.map((opcao) => (
                <SelectItem key={opcao.value} value={opcao.value}>
                  {opcao.label}
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}
