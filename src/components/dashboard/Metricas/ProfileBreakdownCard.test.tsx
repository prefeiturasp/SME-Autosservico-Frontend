import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/skeleton", () => ({
    Skeleton: (props: Readonly<React.HTMLAttributes<HTMLDivElement>>) => (
        <div data-testid="skeleton" {...props} />
    ),
}));

vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        ...rest
    }: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
        <button data-testid="retry-button" {...rest}>
            {children}
        </button>
    ),
}));

import ProfileBreakdownCard from "./ProfileBreakdownCard";

describe("<ProfileBreakdownCard />", () => {
    it("sem systemName mostra 'Selecione um projeto'", () => {
        render(
            <ProfileBreakdownCard title="Perfil dos responsáveis pelas UPs" />,
        );
        expect(
            screen.getByText("Perfil dos responsáveis pelas UPs"),
        ).toBeInTheDocument();
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("loading mostra skeletons", () => {
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                isLoading
            />,
        );
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            1,
        );
    });

    it("erro mostra mensagem custom e botão de retry", async () => {
        const onRetry = vi.fn();
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                isError
                onRetry={onRetry}
                errorMessage="Falhou ao carregar."
            />,
        );

        expect(screen.getByText("Falhou ao carregar.")).toBeInTheDocument();
        await userEvent.click(screen.getByTestId("retry-button"));
        expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it("sucesso renderiza os blocos com título e linhas label/valor, incluindo 'Raça'", () => {
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                blocks={[
                    {
                        title: "Gênero",
                        rows: [
                            { label: "Feminino", value: 34 },
                            { label: "Masculino", value: 27 },
                        ],
                    },
                    {
                        title: "Raça",
                        rows: [
                            { label: "Branca", value: 20 },
                            { label: "Preta", value: 24 },
                        ],
                    },
                ]}
            />,
        );

        expect(screen.getByText("Gênero")).toBeInTheDocument();
        expect(screen.getByText("Feminino")).toBeInTheDocument();
        expect(screen.getByText("27")).toBeInTheDocument();
        expect(screen.getByText("Raça")).toBeInTheDocument();
        expect(screen.getByText("Branca")).toBeInTheDocument();
        expect(screen.getByText("20")).toBeInTheDocument();
    });

    it("títulos dos blocos têm divisória embaixo", () => {
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                blocks={[
                    {
                        title: "Gênero",
                        rows: [
                            { label: "Feminino", value: 34 },
                            { label: "Masculino", value: 27 },
                        ],
                    },
                ]}
            />,
        );

        expect(screen.getByText("Gênero")).toHaveClass("border-b");
    });

    it("os blocos ficam dentro de uma única caixa com borda, tipo tabela única", () => {
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                blocks={[
                    {
                        title: "Gênero",
                        rows: [{ label: "Feminino", value: 34 }],
                    },
                    {
                        title: "Nacionalidade",
                        rows: [{ label: "Brasileira", value: 61 }],
                    },
                ]}
            />,
        );

        const box = screen.getByText("Gênero").closest("div.rounded-md.border");
        expect(box).not.toBeNull();
        expect(box).toContainElement(screen.getByText("Nacionalidade"));
    });

    it("bare renderiza sem o card externo, mas com o título dentro da caixa", () => {
    render(
      <ProfileBreakdownCard
        title="Perfil dos responsáveis pelas UPs"
        systemName="Rolê Agroecológico"
        bare
        blocks={[
          {
            title: "Gênero",
            rows: [{ label: "Feminino", value: 34 }],
          },
        ]}
      />
    );

    expect(
      screen.getByText("Perfil dos responsáveis pelas UPs"),
    ).toBeInTheDocument();
    expect(screen.getByText("Feminino")).toBeInTheDocument();
  });

  it("renderiza o slot de action no header quando informado", () => {
        render(
            <ProfileBreakdownCard
                title="Perfil dos responsáveis pelas UPs"
                systemName="Rolê Agroecológico"
                blocks={[]}
                action={<button data-testid="period-switcher">Período</button>}
            />,
        );

        expect(screen.getByTestId("period-switcher")).toBeInTheDocument();
    });
});
