import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ProvasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="provas-card">{systemName ?? ""}</div>
  ),
}));

import ProvasSection from "./ProvasSection";

describe("<ProvasSection />", () => {
  it("renderiza o ProvasCard propagando systemName", () => {
    render(<ProvasSection systemName="Serap" />);
    expect(screen.getByTestId("provas-card")).toHaveTextContent("Serap");
  });
});
