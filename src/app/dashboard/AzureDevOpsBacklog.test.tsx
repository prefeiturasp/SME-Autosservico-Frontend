import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { cleanup } from "@testing-library/react";
import AzureDevOpsBacklog from "@/components/dashboard/AzureDevOpsBacklog";

// Mock simples do hook
vi.mock("@/hooks/useAzureDevOpsBacklog", () => ({
  useAzureDevOpsBacklog: vi.fn(),
}));

describe("AzureDevOpsBacklog (Dashboard)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("renderiza o componente corretamente", () => {
    render(<AzureDevOpsBacklog />);

    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });
});
