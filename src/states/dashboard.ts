// src/states/dashboard.ts
import { create } from "zustand";

export interface SidebarItem {
    title: string;
    subTitle: string;
    url: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

type State = {
    activeItem: SidebarItem | null;
};

type Action = {
    setActiveItem: (item: SidebarItem | null) => void;
    clearActiveItem: () => void;
};

// Inicialmente nulo (vamos setar depois com base no allowedSquads)
export default create<State & Action>((set) => ({
    activeItem: null,

    setActiveItem: (activeItem) => set({ activeItem }),
    clearActiveItem: () => set({ activeItem: null }),
}));
