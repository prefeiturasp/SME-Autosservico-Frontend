"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DRE_OPTIONS } from "@/types/dreOption";

type Props = {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

export default function DreSelect({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[200px]", className)}
        aria-label="Filtrar por DRE"
      >
        <SelectValue className="min-w-0 flex-1 truncate text-left" />
      </SelectTrigger>
      <SelectContent>
        {DRE_OPTIONS.map((dre) => (
          <SelectItem key={dre.value} value={dre.value}>
            {dre.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
