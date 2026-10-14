"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ALL_UES_VALUE, type UeOption } from "@/types/ueOption";

type Props = {
  readonly value: string;
  readonly options: ReadonlyArray<UeOption>;
  readonly onChange: (next: string) => void;
  readonly className?: string;
};

const TODAS_AS_UES: UeOption = { value: ALL_UES_VALUE, label: "Todas as UEs" };

export default function UeSelect({ value, options, onChange, className }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-9 w-[220px] [&>[data-slot=select-value]]:block [&>[data-slot=select-value]]:min-w-0 [&>[data-slot=select-value]]:flex-1 [&>[data-slot=select-value]]:truncate [&>[data-slot=select-value]]:text-left",
          className,
        )}
        aria-label="Filtrar por UE"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[TODAS_AS_UES, ...options].map((ue) => (
          <SelectItem key={ue.value} value={ue.value}>
            {ue.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
