import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CardWrapperInfoAmbientes from "./index";

// Mock leve dos componentes do shadcn/ui para facilitar asserts
vi.mock("@/components/ui/card", () => {
  const Card = ({ className, children }: React.PropsWithChildren<{ className?: string }>) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  );
  const CardHeader = ({ className, children }: React.PropsWithChildren<{ className?: string }>) => (
    <header data-testid="card-header" className={className}>
      {children}
    </header>
  );
  const CardTitle = ({ className, children }: React.PropsWithChildren<{ className?: string }>) => (
    <h2 data-testid="card-title" className={className}>
      {children}
    </h2>
  );
  const CardContent = ({ className, children }: React.PropsWithChildren<{ className?: string }>) => (
    <section data-testid="card-content" className={className}>
      {children}
    </section>
  );

  return {
    __esModule: true,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  };
});

describe("<CardWrapperInfoAmbientes />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza o título padrão quando não informado", () => {
    render(
      <CardWrapperInfoAmbientes>
        <div>child</div>
      </CardWrapperInfoAmbientes>
    );

    expect(
      screen.getByTestId("card-title")
    ).toHaveTextContent("Disponibilidade do ambiente");
  });

  it("renderiza um título customizado quando informado", () => {
    render(
      <CardWrapperInfoAmbientes title="Saúde do servidor">
        <div>child</div>
      </CardWrapperInfoAmbientes>
    );

    expect(screen.getByTestId("card-title")).toHaveTextContent(
      "Saúde do servidor"
    );
  });

  it("renderiza os children dentro do conteúdo", () => {
    render(
      <CardWrapperInfoAmbientes title="Qualquer">
        <div data-testid="meu-child">conteúdo interno</div>
      </CardWrapperInfoAmbientes>
    );

    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();
    expect(screen.getByTestId("meu-child")).toHaveTextContent(
      "conteúdo interno"
    );
  });

  it("mescla className externo com as classes base do Card", () => {
    render(
      <CardWrapperInfoAmbientes className="extra-class another-class">
        <div>child</div>
      </CardWrapperInfoAmbientes>
    );

    const card = screen.getByTestId("card");
    // verifica se manteve as classes base E adicionou as extras
    expect(card.className).toContain("rounded-md");
    expect(card.className).toContain("shadow-sm");
    expect(card.className).toContain("gap-3");
    expect(card.className).toContain("py-3");
    expect(card.className).toContain("px-1");
    expect(card.className).toContain("extra-class");
    expect(card.className).toContain("another-class");
  });

  it("aplica as classes previstas no header e no content", () => {
    render(
      <CardWrapperInfoAmbientes>
        <div>child</div>
      </CardWrapperInfoAmbientes>
    );

    expect(screen.getByTestId("card-header").className).toContain("pb-1");
    expect(screen.getByTestId("card-header").className).toContain("px-4");

    expect(screen.getByTestId("card-content").className).toContain("px-4");
    expect(screen.getByTestId("card-content").className).toContain("pb-3");
  });
});
