"use client";
import useDashboardStore from "@/states/dashboard";

export function PageHeader() {

    const activeItem = useDashboardStore((state) => state.activeItem);

    if (!activeItem) return null;

    return (
        <div className="bg-background px-6 py-4">
            <h1 className="text-2xl font-bold text-foreground">
                {activeItem.subTitle} [{activeItem.title}]
            </h1>
        </div>
    );
}
