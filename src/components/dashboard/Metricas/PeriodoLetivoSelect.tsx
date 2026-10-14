"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = {
  readonly value: string;
  readonly options: ReadonlyArray<string>;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

export default function PeriodoLetivoSelect({ value, options, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[160px]", className)}
        aria-label="Selecionar período"
      >
        <SelectValue placeholder="Período corrente" />
      </SelectTrigger>
      <SelectContent>
        {options.map((periodo) => (
          <SelectItem key={periodo} value={periodo}>
            {`Período ${periodo}`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
