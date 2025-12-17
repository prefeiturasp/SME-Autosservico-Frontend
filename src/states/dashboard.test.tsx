/* @vitest-environment jsdom */
// src/states/dashboard.test.tsx
import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import useDashboardStore, { type SidebarItem, type ProjectItem } from "./dashboard";

// 🔹 Mocks para os testes
const mockSidebarItem: SidebarItem = {
  title: "COPED",
  subTitle: "Coordenadoria pedagógica",
  url: "#",
  icon: (props) => <svg data-testid="mock-icon" {...props} />,
};

const mockProject: ProjectItem = {
  id: "1",
  nome: "Portal Educação",
  zabbixQueryFrontend: "PRD - Educacao",
  zabbixQueryBackend: "API - Educacao",
  zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
  zabbixQueryJenkinsJob: "SME-PortalEducacao/master",
};

describe("useDashboardStore (Zustand)", () => {
  beforeEach(() => {
    // ✅ Reseta os dois estados antes de cada teste
    useDashboardStore.setState({ activeItem: null, activeProject: null });
  });

  // ----------------------------
  // activeItem
  // ----------------------------

  it("deve ter activeItem nulo inicialmente", () => {
    const state = useDashboardStore.getState();
    expect(state.activeItem).toBeNull();
  });

  it("deve atualizar o activeItem com setActiveItem", () => {
    const { setActiveItem } = useDashboardStore.getState();
    setActiveItem(mockSidebarItem);
    expect(useDashboardStore.getState().activeItem).toEqual(mockSidebarItem);
  });

  it("deve limpar o activeItem com clearActiveItem", () => {
    const { setActiveItem, clearActiveItem } = useDashboardStore.getState();
    setActiveItem(mockSidebarItem);
    expect(useDashboardStore.getState().activeItem).toEqual(mockSidebarItem);
    clearActiveItem();
    expect(useDashboardStore.getState().activeItem).toBeNull();
  });

  // ----------------------------
  // activeProject
  // ----------------------------

  it("deve ter activeProject nulo inicialmente", () => {
    const state = useDashboardStore.getState();
    expect(state.activeProject).toBeNull();
  });

  it("deve atualizar o activeProject com setActiveProject", () => {
    const { setActiveProject } = useDashboardStore.getState();
    setActiveProject(mockProject);
    expect(useDashboardStore.getState().activeProject).toEqual(mockProject);
  });

  it("deve limpar o activeProject com clearActiveProject", () => {
    const { setActiveProject, clearActiveProject } = useDashboardStore.getState();
    setActiveProject(mockProject);
    expect(useDashboardStore.getState().activeProject).toEqual(mockProject);
    clearActiveProject();
    expect(useDashboardStore.getState().activeProject).toBeNull();
  });

  it("setActiveProject(null) também deve limpar o activeProject", () => {
    const { setActiveProject } = useDashboardStore.getState();
    setActiveProject(mockProject);
    expect(useDashboardStore.getState().activeProject).toEqual(mockProject);
    setActiveProject(null);
    expect(useDashboardStore.getState().activeProject).toBeNull();
  });

  // ----------------------------
  // Independência entre estados
  // ----------------------------

  it("alterar activeItem não deve alterar activeProject", () => {
    const { setActiveItem, setActiveProject } = useDashboardStore.getState();
    setActiveProject(mockProject);
    setActiveItem(mockSidebarItem);

    const state = useDashboardStore.getState();
    expect(state.activeProject).toEqual(mockProject);
    expect(state.activeItem).toEqual(mockSidebarItem);
  });

  it("alterar activeProject não deve alterar activeItem", () => {
    const { setActiveItem, setActiveProject } = useDashboardStore.getState();
    setActiveItem(mockSidebarItem);
    setActiveProject(mockProject);

    const state = useDashboardStore.getState();
    expect(state.activeItem).toEqual(mockSidebarItem);
    expect(state.activeProject).toEqual(mockProject);
  });
});
