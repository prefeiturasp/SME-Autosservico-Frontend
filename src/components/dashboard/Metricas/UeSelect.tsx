"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UE_OPTIONS } from "@/types/ueOption";

type Props = {
  readonly value: string;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

export default function UeSelect({ value, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn("h-9 w-[220px]", className)}
        aria-label="Filtrar por UE"
      >
        <SelectValue className="min-w-0 flex-1 truncate text-left" />
      </SelectTrigger>
      <SelectContent>
        {UE_OPTIONS.map((ue) => (
          <SelectItem key={ue.value} value={ue.value}>
            {ue.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
