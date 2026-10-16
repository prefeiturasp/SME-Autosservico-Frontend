"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import MetricasMessage from "./MetricasMessage";

type Props = {
    readonly message: string;
    readonly onRetry?: () => void;
};

export default function MetricasErrorState({ message, onRetry }: Props) {
    return (
        <div>
            <MetricasMessage>{message}</MetricasMessage>
            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            )}
        </div>
    );
}
