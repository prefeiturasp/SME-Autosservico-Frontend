"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MetricasStatSkeletonBox() {
    return (
        <div className="flex-1 space-y-2 rounded-md border border-[#D8D8D8] p-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
}
