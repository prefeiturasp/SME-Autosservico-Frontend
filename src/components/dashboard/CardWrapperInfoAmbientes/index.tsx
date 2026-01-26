"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Lightbulb } from "lucide-react";

type Props = {
    id?: string;
    title?: string;
    tooltipContent?: React.ReactNode;
    readonly className?: string;
    readonly children: React.ReactNode;
};

export default function CardWrapperInfoAmbientes({
    id,
    title = "Disponibilidade do ambiente",
    tooltipContent,
    className,
    children,
}: Readonly<Props>) {
    return (
        <Card id={id} className={cn("rounded-md shadow-sm gap-3 py-3 px-1", className)}>
            <CardHeader className="pb-1 px-4 flex items-center justify-between">
                <CardTitle className="text-lg">
                    {title}
                </CardTitle>
                {tooltipContent ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="cursor-help"
                                aria-label={`Informações sobre ${title}`}
                            >
                                <Lightbulb className="h-6 w-6 text-[#6B7280]" />
                            </button>
                        </TooltipTrigger>
                        <TooltipContent
                            side="right"
                            sideOffset={12}
                            className="max-w-sm bg-[#111827] text-white border-none p-4 rounded-lg shadow-lg"
                        >
                            <TooltipArrow className="text-[#111827]" width={12} height={6} />
                            <div className="text-sm leading-relaxed">
                                {tooltipContent}
                            </div>
                        </TooltipContent>
                    </Tooltip>
                ) : (
                    <Lightbulb className="h-6 w-6 text-[#6B7280]" />
                )}
            </CardHeader>
            <CardContent className="px-4 pb-3">
                <div className="rounded-md ">{children}</div>
            </CardContent>
        </Card>
    );
}
