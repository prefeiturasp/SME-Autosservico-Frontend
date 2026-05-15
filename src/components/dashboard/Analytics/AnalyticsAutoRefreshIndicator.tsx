"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { ANALYTICS_QUERY_KEYS } from "./analyticsQueryKeys";

type Props = {
  readonly intervalSeconds?: number;
  readonly className?: string;
};

const DEFAULT_INTERVAL_SECONDS = 60;

function formatCountdown(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  if (minutes === 0) return `${remaining}s`;
  return `${minutes}m ${String(remaining).padStart(2, "0")}s`;
}

export default function AnalyticsAutoRefreshIndicator({
  intervalSeconds = DEFAULT_INTERVAL_SECONDS,
  className,
}: Props) {
  const queryClient = useQueryClient();
  const [remaining, setRemaining] = useState(intervalSeconds);

  useEffect(() => {
    setRemaining(intervalSeconds);
    const tick = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          ANALYTICS_QUERY_KEYS.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: [key] });
          });
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [intervalSeconds, queryClient]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-2.5 py-1 text-xs text-[#475569]",
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-[#22C55E]"
        aria-hidden
      />
      <span className="whitespace-nowrap">
        Atualiza em{" "}
        <span className="inline-block w-8 text-center font-semibold tabular-nums text-[#0F172A]">
          {formatCountdown(remaining)}
        </span>
      </span>
    </div>
  );
}
