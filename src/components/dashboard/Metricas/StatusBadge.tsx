import type { TomControleAcessos } from "@/lib/sgpControleAcessos";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

type Props = {
    readonly tom: TomControleAcessos;
    readonly label: string;
};

const TOM_CLASSES: Record<TomControleAcessos, string> = {
    success: "bg-[#D1FAE5] text-[#075A3E]",
    warning: "bg-[#FEF3C7] text-[#9C6507]",
    danger: "bg-[#FCE7E7] text-[#970C0C]",
    muted: "bg-[#F3F4F6] text-[#6B7280]",
};

export default function StatusBadge({ tom, label }: Props) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
                TOM_CLASSES[tom],
            )}
        >
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
        </span>
    );
}
