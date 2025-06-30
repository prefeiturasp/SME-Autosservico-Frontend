import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import RootLayout from "../layout";

// Mock para next/font
vi.mock("next/font/google", () => ({
  Montserrat: () => ({
    className: "mock-montserrat",
    style: { fontFamily: "mock-montserrat" },
  }),
}));

describe("RootLayout", () => {
  it("deve renderizar os filhos com a classe da fonte Montserrat", () => {
    const { container, getByTestId } = render(
      <RootLayout>
        <div data-testid="child">Test Child</div>
      </RootLayout>
    );

    // Verifica se o conteúdo filho foi renderizado
    const child = getByTestId("child");
    expect(child).toBeInTheDocument();
    expect(child.textContent).toBe("Test Child");

    // Verifica se o body simulado tem a classe de fonte
    const body = container.querySelector("body");
    if (body) {
      expect(body.className).toContain("mock-montserrat");
    } else {
      // Como <body> não é real no DOM testado, testamos pelo container
      expect(container.innerHTML).toContain("mock-montserrat");
    }
  });
});
