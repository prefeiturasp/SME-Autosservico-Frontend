"use client";

import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
    readonly title: string;
    readonly action?: React.ReactNode;
    readonly bare?: boolean;
    readonly className?: string;
    readonly children: React.ReactNode;
};

export default function MetricasCardShell({
    title,
    action,
    bare,
    className,
    children,
}: Props) {
    if (bare) {
        return <>{children}</>;
    }

    return (
        <Card
            className={cn(
                "rounded-md border-0 shadow-[3px_4px_6px_0px_#0000001A] gap-3 py-4 px-1",
                className,
            )}
        >
            <CardHeader className="pb-1 px-4">
                <CardTitle className="text-sm font-bold text-[#111827]">
                    {title}
                </CardTitle>
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>
            <CardContent className="px-4">{children}</CardContent>
        </Card>
    );
}
