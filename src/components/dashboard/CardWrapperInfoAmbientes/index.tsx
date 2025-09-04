"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
    title?: string;
    readonly className?: string;
    readonly children: React.ReactNode;
};

export default function CardWrapperInfoAmbientes({
    title = "Disponibilidade do ambiente",
    className,
    children,
}: Props) {
    return (
        <Card className={cn("rounded-md shadow-sm gap-3 py-3 px-1", className)}>
            <CardHeader className="pb-1 px-4">
                <CardTitle className="text-lg">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-3">
                <div className="rounded-md bg-[#F5F5F5] p-3">{children}</div>
            </CardContent>
        </Card>
    );
}
