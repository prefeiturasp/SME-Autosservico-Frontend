// src/states/gipe.ts
import { create } from "zustand";

// Primeiro ano com ocorrências no GIPE (homologação tem desde jan/2025).
export const PRIMEIRO_ANO_GIPE = 2025;

export const anoCorrente = () => new Date().getFullYear();

type State = {
    // Ano letivo da aba Métricas do GIPE: filtra ocorrências e
    // produtividade; KPIs e usuários são a fotografia do momento.
    anoLetivo: number;
    setAnoLetivo: (ano: number) => void;
};

export const useGipeFiltros = create<State>((set) => ({
    anoLetivo: anoCorrente(),
    setAnoLetivo: (anoLetivo) => set({ anoLetivo }),
}));
