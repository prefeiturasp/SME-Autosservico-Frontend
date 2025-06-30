/* eslint-disable @next/next/no-img-element */
import { render, screen } from "@testing-library/react";
import BackgroundForm from "./BackgroundForm";
import { vi } from "vitest";

// Mock das imagens
vi.mock("@/assets/images/background_forms.webp", () => ({
  default: {
    src: "/fake-background.webp",
  },
}));

vi.mock("@/assets/images/logo_devops.webp", () => ({
  default: {
    src: "/fake-logo.webp",
    width: 100,
    height: 100,
  },
}));

// Mock do next/image
vi.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ComponentProps<'img'> & { src: string | { src: string } }) => {
    // Remova fetchPriority das props sem declará-la
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { src, fetchPriority: _unused, ...rest } = props;
    const resolvedSrc =
      typeof src === "object" && src !== null && "src" in src
        ? (src as { src: string }).src
        : src;
    return <img src={resolvedSrc} alt={props.alt || ""} {...rest} />;
  },
}));

describe("BackgroundForm", () => {
  it("renderiza o background com gradient + imagem", () => {
    const { container } = render(<BackgroundForm />);
    const backgroundDiv = container.querySelector("div");

    expect(backgroundDiv).toHaveStyle({
      backgroundImage:
        "linear-gradient(to bottom, rgba(59, 130, 246, 0.85), rgba(0, 50, 130, 0.74)), url(/fake-background.webp)",
    });
  });

  it("renderiza o logo com alt correto", () => {
    render(<BackgroundForm />);

    const logo = screen.getByAltText("Logo AutoServiço");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/fake-logo.webp");
    expect(logo).toHaveAttribute("width", "100");
    expect(logo).toHaveAttribute("height", "100");
  });
});
