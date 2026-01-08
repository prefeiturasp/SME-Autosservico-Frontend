"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

type Props = {
    title?: string;
    readonly className?: string;
    readonly children: React.ReactNode;
};

export default function CardWrapperInfoAmbientes({
    title = "Disponibilidade do ambiente",
    className,
    children,
}: Readonly<Props>) {
    return (
        <Card className={cn("rounded-md shadow-sm gap-3 py-3 px-1", className)}>
            <CardHeader className="pb-1 px-4 flex items-center justify-between">
                <CardTitle className="text-lg">
                    {title}
                </CardTitle>
                <Lightbulb className="h-6 w-6 text-[#6B7280]" />
            </CardHeader>
            <CardContent className="px-4 pb-3">
                <div className="rounded-md ">{children}</div>
            </CardContent>
        </Card>
    );
}
