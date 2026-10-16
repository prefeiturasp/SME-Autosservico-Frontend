"use client";
import useDashboardStore from "@/states/dashboard";

export function PageHeader() {

    const activeItem = useDashboardStore((state) => state.activeItem);

    if (!activeItem) return null;

    return (
        <div className="bg-background px-6 py-4">
            <h1
                id="onboarding-page-title"
                className="text-2xl font-bold text-foreground w-fit"
            >
                {activeItem.subTitle} [{activeItem.title}]
            </h1>
        </div>
    );
}
