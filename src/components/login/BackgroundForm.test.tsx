import { render } from "@testing-library/react";
import BackgroundForm from "./BackgroundForm";
import { vi } from "vitest";

vi.mock("@/assets/images/background_forms.png", () => ({
  default: {
    src: "/fake-background.webp",
  },
}));

describe("BackgroundForm", () => {
  it("renderiza o background com a imagem", () => {
    const { container } = render(<BackgroundForm />);
    const backgroundDiv = container.querySelector("div");

    expect(backgroundDiv).toHaveStyle({
      backgroundImage: "url(/fake-background.webp)",
    });
  });
});
