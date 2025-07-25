import { describe, it, expect, beforeEach } from "vitest";
import useDashboardStore, { type SidebarItem } from "./dashboard";

// 🔹 Um item fictício para teste
const mockSidebarItem: SidebarItem = {
    title: "COPED",
    subTitle: "Coordenadoria pedagógica",
    url: "#",
    icon: () => <svg data-testid="mock-icon" />,
};

describe("useDashboardStore (Zustand)", () => {
    beforeEach(() => {
        // ✅ Reseta o estado antes de cada teste
        useDashboardStore.setState({ activeItem: null });
    });

    it("deve ter activeItem nulo inicialmente", () => {
        const state = useDashboardStore.getState();
        expect(state.activeItem).toBeNull();
    });

    it("deve atualizar o activeItem com setActiveItem", () => {
        const { setActiveItem, activeItem } = useDashboardStore.getState();
        expect(activeItem).toBeNull();

        setActiveItem(mockSidebarItem);

        const updatedState = useDashboardStore.getState();
        expect(updatedState.activeItem).toEqual(mockSidebarItem);
    });

    it("deve limpar o activeItem com clearActiveItem", () => {
        const { setActiveItem, clearActiveItem } = useDashboardStore.getState();

        // ✅ Define um item antes de limpar
        setActiveItem(mockSidebarItem);
        expect(useDashboardStore.getState().activeItem).toEqual(mockSidebarItem);

        // ✅ Limpa o estado
        clearActiveItem();
        expect(useDashboardStore.getState().activeItem).toBeNull();
    });
});
