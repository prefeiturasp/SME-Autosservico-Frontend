/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { CoordenadoriaAcesso } from "@/types/coordenadoriaAcesso";
import { AreasAcessoCard } from "./AreasAcessoCard";

describe("<AreasAcessoCard />", () => {
    it("exibe mensagem de vazio quando não houver coordenadorias", () => {
        render(<AreasAcessoCard coordenadorias={[]} />);
        expect(screen.getByText("Áreas de acesso")).toBeInTheDocument();
        expect(
            screen.getByText("Nenhuma área de acesso disponível."),
        ).toBeInTheDocument();
    });

    it("renderiza a lista de coordenadorias com suas áreas", () => {
        const coordenadorias: CoordenadoriaAcesso[] = [
            {
                sigla: "COPED",
                descricao: "SGP - Serap",
                areas: ["Operacional", "Analytics"],
            },
        ];

        render(<AreasAcessoCard coordenadorias={coordenadorias} />);

        expect(screen.getByText("COPED")).toBeInTheDocument();
        expect(screen.getByText("SGP - Serap")).toBeInTheDocument();
        expect(screen.getByText("Operacional")).toBeInTheDocument();
        expect(screen.getByText("Analytics")).toBeInTheDocument();
    });

    it("renderiza múltiplas coordenadorias, cada uma com seu ícone conhecido", () => {
        const coordenadorias: CoordenadoriaAcesso[] = [
            { sigla: "ASCOM", descricao: "Portal Educação", areas: ["Analytics"] },
            { sigla: "CODAE", descricao: "Cardápios", areas: ["Operacional"] },
        ];

        render(<AreasAcessoCard coordenadorias={coordenadorias} />);

        expect(screen.getByText("ASCOM")).toBeInTheDocument();
        expect(screen.getByText("CODAE")).toBeInTheDocument();
    });

    it("usa o ícone padrão (Building2) para uma sigla não mapeada", () => {
        const coordenadorias: CoordenadoriaAcesso[] = [
            { sigla: "DESCONHECIDA", descricao: "Sem mapeamento", areas: ["Operacional"] },
        ];

        const { container } = render(
            <AreasAcessoCard coordenadorias={coordenadorias} />,
        );

        expect(screen.getByText("DESCONHECIDA")).toBeInTheDocument();
        expect(container.querySelector("svg")).toBeInTheDocument();
    });
});
