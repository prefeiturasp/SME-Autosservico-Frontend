"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BIMESTRE_OPTIONS } from "@/types/bimestreOption";

type Props = {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

export default function BimestreSelect({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[220px]", className)}
        aria-label="Selecionar bimestre"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BIMESTRE_OPTIONS.map((bimestre) => (
          <SelectItem key={bimestre.value} value={bimestre.value}>
            {bimestre.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
