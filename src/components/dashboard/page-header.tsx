// src/components/dashboard/page-header.tsx
"use client";
import useDashboardStore from "@/states/dashboard"; // default import

export function PageHeader() {
    // Usando seu padrão
    const activeItem = useDashboardStore((state) => state.activeItem);

    if (!activeItem) return null;

    return (
        <div className="border-b bg-background px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">
                {activeItem.subTitle} [{activeItem.title}]
            </h1>
        </div>
    );
}
