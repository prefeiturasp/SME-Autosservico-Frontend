"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
    DialogPortal,
} from "@/components/ui/dialog";
import { useOnboarding } from "@/hooks/useOnboarding";
import { cn } from "@/lib/utils";

export function WelcomeModal() {
    const { isWelcomeModalOpen, startTour, closeWelcomeModal } = useOnboarding();

    const handleStartTour = () => {
        startTour();
    };

    return (
        <Dialog open={isWelcomeModalOpen} onOpenChange={closeWelcomeModal}>
            <DialogPortal>
                <DialogOverlay />
                <DialogPrimitive.Content
                    className={cn(
                        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-[623px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-to-left-1/2 data-[state=open]:slide-in-to-top-[48%] sm:rounded-lg"
                    )}
                >
                    <button
                        onClick={closeWelcomeModal}
                        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        aria-label="Fechar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                    <DialogHeader>
                        <DialogTitle className="text-xl font-[700] text-foreground">
                            Olá, seja bem-vindo(a) ao Autosserviço!
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 text-foreground">
                        <p>
                            Aqui você encontrará informações sobre a saúde e
                            disponibilidade dos ambientes de produção e homologação
                            de seu(s) sistema(s).
                        </p>
                        <p>
                            Com o Autosserviço buscamos promover autonomia, agilidade
                            e governança, reduzindo o tempo de resposta a incidentes
                            e permitindo que os times mantenham ambientes estáveis e
                            saudáveis com menor intervenção manual e maior
                            observabilidade.
                        </p>
                        <p>
                            Para explicar melhor alguns termos e informações,
                            preparamos um pequeno tour para apresentar o Autosserviço
                            a você. <strong>Vamos iniciar?</strong>
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-center pt-4">
                        <Button
                            onClick={handleStartTour}
                            size="lg"
                            className="bg-[#1E3A8A] hover:bg-[#1e3a8a]/90 text-white px-8 h-[29px] rounded-lg"
                        >
                            Iniciar Tour
                        </Button>
                    </DialogFooter>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
