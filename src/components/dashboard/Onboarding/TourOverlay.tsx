"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOnboarding } from "@/hooks/useOnboarding";
import { cn } from "@/lib/utils";

type TargetRect = {
    top: number;
    left: number;
    width: number;
    height: number;
};

export function TourOverlay() {
    const {
        isTourActive,
        currentStep,
        currentStepIndex,
        totalSteps,
        nextStep,
        closeTour,
    } = useOnboarding();

    const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

    const updateTargetPosition = useCallback(() => {
        if (!currentStep) return;

        const element = document.getElementById(currentStep.targetId);
        if (element) {
            const rect = element.getBoundingClientRect();
            const padding = 12;

            // Use fixed dimensions if provided, otherwise use element dimensions
            const width = currentStep.spotlightWidth ?? rect.width + padding * 2;
            const height = currentStep.spotlightHeight ?? rect.height + padding * 2;

            setTargetRect({
                top: rect.top,
                left: rect.left,
                width,
                height,
            });

            // Calculate tooltip position based on spotlight area
            const spotlightTop = rect.top - padding;
            const spotlightLeft = rect.left - padding;
            const spotlightRight = rect.left + width + padding;
            const spotlightBottom = rect.top + height + padding;

            const tooltipWidth = 320;
            const tooltipHeight = 180;
            const gap = 16;

            let top = spotlightTop;
            let left = spotlightRight + gap;

            if (currentStep.placement === "left") {
                left = spotlightLeft - tooltipWidth - gap;
            } else if (currentStep.placement === "top") {
                top = spotlightTop - 260 - 7;
                left = spotlightLeft;
            } else if (currentStep.placement === "bottom") {
                top = spotlightBottom + gap;
                left = spotlightLeft + 35;
            }

            // Centralizar verticalmente para placement left/right
            if (currentStep.centered && (currentStep.placement === "right" || currentStep.placement === "left")) {
                top = spotlightTop + (height / 2) - (tooltipHeight / 2);
            }

            // Keep tooltip within viewport
            if (left + tooltipWidth > window.innerWidth - 20) {
                left = window.innerWidth - tooltipWidth - 20;
            }
            if (left < 20) {
                left = 20;
            }

            setTooltipPosition({ top, left });
        }
    }, [currentStep]);

    useEffect(() => {
        if (!isTourActive) return;

        updateTargetPosition();

        window.addEventListener("resize", updateTargetPosition);
        window.addEventListener("scroll", updateTargetPosition);

        return () => {
            window.removeEventListener("resize", updateTargetPosition);
            window.removeEventListener("scroll", updateTargetPosition);
        };
    }, [isTourActive, currentStep, updateTargetPosition]);

    if (!isTourActive || !currentStep || !targetRect) return null;

    const padding = 12;
    const spotlightTop = targetRect.top - padding;
    const spotlightLeft = targetRect.left - padding;
    const spotlightWidth = targetRect.width + padding * 2;
    const spotlightHeight = targetRect.height + padding * 2;

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            {/* Overlay - Top */}
            <div
                className="absolute left-0 right-0 top-0 bg-black/50"
                style={{ height: spotlightTop }}
            />
            {/* Overlay - Bottom */}
            <div
                className="absolute left-0 right-0 bottom-0 bg-black/50"
                style={{ top: spotlightTop + spotlightHeight }}
            />
            {/* Overlay - Left */}
            <div
                className="absolute left-0 bg-black/50"
                style={{
                    top: spotlightTop,
                    width: spotlightLeft,
                    height: spotlightHeight,
                }}
            />
            {/* Overlay - Right */}
            <div
                className="absolute right-0 bg-black/50"
                style={{
                    top: spotlightTop,
                    left: spotlightLeft + spotlightWidth,
                    height: spotlightHeight,
                }}
            />

            {/* Tooltip */}
            <div
                className={cn(
                    "absolute bg-white rounded-lg shadow-xl p-5 w-[320px]",
                    "animate-in fade-in-0 zoom-in-95 duration-200"
                )}
                style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                }}
            >
                {/* Arrow pointing to spotlight */}
                {currentStep.placement === "right" && (
                    <div
                        className="absolute w-4 h-8 overflow-hidden"
                        style={{ left: -16, top: currentStep.centered ? "50%" : 16, transform: currentStep.centered ? "translateY(-50%)" : undefined }}
                    >
                        <div
                            className="absolute w-4 h-4 bg-white rotate-45 shadow-xl"
                            style={{ left: 8, top: 8 }}
                        />
                    </div>
                )}
                {currentStep.placement === "bottom" && (
                    <div
                        className="absolute h-4 w-8 overflow-hidden"
                        style={{ top: -16, left: 16 }}
                    >
                        <div
                            className="absolute w-4 h-4 bg-white rotate-45 shadow-xl"
                            style={{ top: 8, left: 8 }}
                        />
                    </div>
                )}
                {currentStep.placement === "left" && (
                    <div
                        className="absolute w-4 h-8 overflow-hidden"
                        style={{ right: -16, top: currentStep.centered ? "50%" : 16, transform: currentStep.centered ? "translateY(-50%)" : undefined }}
                    >
                        <div
                            className="absolute w-4 h-4 bg-white rotate-45 shadow-xl"
                            style={{ left: -8, top: 8 }}
                        />
                    </div>
                )}
                {currentStep.placement === "top" && (
                    <div
                        className="absolute h-4 w-8 overflow-hidden"
                        style={{ bottom: -16, left: 16 }}
                    >
                        <div
                            className="absolute w-4 h-4 bg-white rotate-45 shadow-xl"
                            style={{ top: -8, left: 8 }}
                        />
                    </div>
                )}
                {/* Close button */}
                <button
                    onClick={closeTour}
                    className="absolute top-3 right-3 text-[#1E3A8A] hover:text-[#1E3A8A]/80 transition-colors"
                    aria-label="Fechar tour"
                >
                    <div className="w-4 h-4 rounded-full border-[1.5px] border-[#1E3A8A] flex items-center justify-center">
                        <X className="w-2.5 h-2.5" strokeWidth={2.5} />
                    </div>
                </button>

                {/* Content */}
                <h3 className="text-lg font-semibold text-[#1E3A8A] pr-6">
                    {currentStep.title}
                </h3>
                <p className="mt-2 text-sm text-[#111827]">
                    {currentStep.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-5">
                    <span className="text-sm text-muted-foreground">
                        {currentStepIndex + 1}/{totalSteps}
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={closeTour}
                            className="px-4 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
                        >
                            Fechar
                        </Button>
                        <Button
                            size="sm"
                            onClick={nextStep}
                            className="px-4 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                        >
                            {currentStepIndex === totalSteps - 1
                                ? "Concluir"
                                : "Próximo"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
