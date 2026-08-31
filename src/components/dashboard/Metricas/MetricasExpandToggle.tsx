"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type Props = {
    readonly expanded: boolean;
    readonly onToggle: () => void;
    readonly expandLabel: string;
    readonly collapseLabel: string;
};

export default function MetricasExpandToggle({
    expanded,
    onToggle,
    expandLabel,
    collapseLabel,
}: Props) {
    return (
        <div className="mx-3 flex justify-center border-t border-[#D8D8D8] py-3">
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-2 text-xs font-semibold text-[#111827] hover:underline"
            >
                <ChevronDown
                    className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        expanded && "rotate-180",
                    )}
                    aria-hidden="true"
                />
                {expanded ? collapseLabel : expandLabel}
            </button>
        </div>
    );
}
