"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PERIODO_LETIVO_OPTIONS } from "@/types/periodoLetivoOption";

type Props = {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

export default function PeriodoLetivoSelect({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[160px]", className)}
        aria-label="Selecionar período"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIODO_LETIVO_OPTIONS.map((periodo) => (
          <SelectItem key={periodo.value} value={periodo.value}>
            {periodo.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
