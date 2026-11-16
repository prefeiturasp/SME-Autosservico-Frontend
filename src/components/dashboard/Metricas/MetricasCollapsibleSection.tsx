"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  readonly title: string;
  readonly defaultOpen?: boolean;
  readonly className?: string;
  readonly children: React.ReactNode;
};

export default function MetricasCollapsibleSection({
  title,
  defaultOpen = true,
  className,
  children,
}: Props) {
  const [aberta, setAberta] = useState(defaultOpen);
  const conteudoId = useId();

  return (
    <section className={cn("mb-8", className)}>
      <h2 className="mb-4 border-b border-[#1E3A8A] pb-2">
        <button
          type="button"
          aria-expanded={aberta}
          aria-controls={conteudoId}
          onClick={() => setAberta((atual) => !atual)}
          className="flex w-full items-center justify-between text-lg font-bold text-[#1E3A8A]"
        >
          {title}
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-5 w-5 transition-transform",
              aberta ? "rotate-0" : "-rotate-90",
            )}
          />
        </button>
      </h2>
      <div id={conteudoId} hidden={!aberta} className="space-y-4">
        {children}
      </div>
    </section>
  );
}
