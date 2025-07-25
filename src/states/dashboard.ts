// src/states/dashboard.ts
import { create } from "zustand";

export interface SidebarItem {
  title: string;
  subTitle: string;
  url: string;
}

type State = {
  activeItem: SidebarItem | null;
};

type Action = {
  setActiveItem: (item: State["activeItem"]) => void;
  clearActiveItem: () => void;
};

// Item inicial (ASCOM)
const initialActiveItem: SidebarItem = {
  title: "ASCOM",
  subTitle: "Assessoria de comunicação",
  url: "#"
};

export default create<State & Action>((set) => ({
  // Estado inicial
  activeItem: initialActiveItem,

  // Ações
  setActiveItem: (activeItem: State["activeItem"]) => set({ activeItem }),
  clearActiveItem: () => set({ activeItem: null }),
}));
