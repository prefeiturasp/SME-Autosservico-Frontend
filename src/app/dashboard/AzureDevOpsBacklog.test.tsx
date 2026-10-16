import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import AzureDevOpsBacklog from "@/components/dashboard/AzureDevOpsBacklog";

// Mock do hook com retorno válido
vi.mock("@/hooks/useAzureDevOpsBacklog", () => ({
  useAzureDevOpsBacklog: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
  })),
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
