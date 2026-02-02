import { create } from "zustand";

export type TourStep = {
    id: string;
    targetId: string;
    title: string;
    description: string;
    placement: "top" | "bottom" | "left" | "right";
    spotlightWidth?: number;
    spotlightHeight?: number;
    centered?: boolean;
};

export const TOUR_STEPS: TourStep[] = [
    {
        id: "area-coordenadoria",
        targetId: "onboarding-page-title",
        title: "Área ou Coordenadoria",
        description:
            "No topo da página você visualiza o nome da sua área ou coordenadoria.",
        placement: "right",
        spotlightHeight: 225,
    },
    {
        id: "sistema",
        targetId: "onboarding-page-title",
        title: "Sistema",
        description:
            "No seletor você pode escolher de qual sistema deseja visualizar as informações.",
        placement: "bottom",
        spotlightHeight: 225,
    },
    {
        id: "lancamento-versoes",
        targetId: "onboarding-lancamentos",
        title: "Lançamento de Versões",
        description:
            "Nesta área você poderá visualizar as últimas versões publicadas e/ou previstas para publicação.",
        placement: "bottom",
    },
    {
        id: "disponibilidade-ambientes",
        targetId: "onboarding-disponibilidade",
        title: "Disponibilidade dos ambientes",
        description:
            "Nesta seção estarão visíveis as informações de disponibilidade dos ambientes de Produção, Homologação, Testes e Desenvolvimento.",
        placement: "right",
        centered: true,
    },
    {
        id: "saude-servidor",
        targetId: "onboarding-saude-servidor",
        title: "Saúde do servidor (Workloads)",
        description:
            "Nesta seção será possível acompanhar a saúde dos recursos computacionais para disponibilização do sistema, servidores, filas de publicação, comunicação com APIs, entre outros itens.",
        placement: "right",
        centered: true,
    },
    {
        id: "bugs",
        targetId: "onboarding-bugs",
        title: "Bugs",
        description:
            "Ao final da página será possível visualizar o registro dos bugs e correções necessárias para o sistema, suas tratativas e andamento para resolução.",
        placement: "top",
    },
];

type OnboardingState = {
    isWelcomeModalOpen: boolean;
    hasCompletedOnboarding: boolean;
    isTourActive: boolean;
    currentStepIndex: number;
};

type OnboardingActions = {
    openWelcomeModal: () => void;
    closeWelcomeModal: () => void;
    startTour: () => void;
    nextStep: () => void;
    prevStep: () => void;
    closeTour: () => void;
    completeOnboarding: () => void;
};

export const ONBOARDING_STORAGE_KEY = "autosservico-onboarding-completed";

export const useOnboardingStore = create<OnboardingState & OnboardingActions>(
    (set, get) => ({
        isWelcomeModalOpen: false,
        hasCompletedOnboarding: false,
        isTourActive: false,
        currentStepIndex: 0,

        openWelcomeModal: () => set({ isWelcomeModalOpen: true }),
        closeWelcomeModal: () => set({ isWelcomeModalOpen: false }),

        startTour: () => {
            set({ isWelcomeModalOpen: false, isTourActive: true, currentStepIndex: 0 });
        },

        nextStep: () => {
            const { currentStepIndex } = get();
            if (currentStepIndex < TOUR_STEPS.length - 1) {
                set({ currentStepIndex: currentStepIndex + 1 });
            } else {
                get().completeOnboarding();
            }
        },

        prevStep: () => {
            const { currentStepIndex } = get();
            if (currentStepIndex > 0) {
                set({ currentStepIndex: currentStepIndex - 1 });
            }
        },

        closeTour: () => {
            set({ isTourActive: false, currentStepIndex: 0 });
            get().completeOnboarding();
        },

        completeOnboarding: () => {
            if (typeof window !== "undefined") {
                localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
            }
            set({
                hasCompletedOnboarding: true,
                isWelcomeModalOpen: false,
                isTourActive: false,
            });
        },
    })
);
