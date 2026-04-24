import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UsersByPageResponse } from "@/types/usersByPage";

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

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: Readonly<{
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }>) => (
    <select
      data-testid="select-native"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: Readonly<{ value: string; children: React.ReactNode }>) => (
    <option value={value}>{children}</option>
  ),
}));

type MockQueryResult = {
  data?: UsersByPageResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult = {
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock("@/hooks/useUsersByPage", () => ({
  useUsersByPage: () => mockQueryResult,
}));

import UsersByPageCard from "./UsersByPageCard";

const buildPages = (count: number): UsersByPageResponse["pages"] =>
  Array.from({ length: count }, (_, idx) => ({
    path: `/pagina-${idx + 1}`,
    currentUsers: 1000 - idx * 10,
    averageUsers: 2000 - idx * 10,
  }));

describe("<UsersByPageCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra placeholder", () => {
    render(<UsersByPageCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<UsersByPageCard systemName="SigPAE" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<UsersByPageCard systemName="SigPAE" />);

    expect(
      screen.getByText("Não foi possível carregar os usuários por página.")
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("renderiza apenas as 5 primeiras páginas por padrão", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(8) },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent(
      "/pagina-1"
    );
    expect(screen.getByTestId("users-by-page-row-5")).toHaveTextContent(
      "/pagina-5"
    );
    expect(screen.queryByTestId("users-by-page-row-6")).not.toBeInTheDocument();
  });

  it("expande e colapsa a lista ao clicar em 'Ver mais páginas'", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(8) },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    const expandButton = screen.getByRole("button", { name: /ver mais páginas/i });
    await userEvent.click(expandButton);

    expect(screen.getByTestId("users-by-page-row-8")).toHaveTextContent(
      "/pagina-8"
    );

    const collapseButton = screen.getByRole("button", {
      name: /ver menos páginas/i,
    });
    await userEvent.click(collapseButton);

    expect(screen.queryByTestId("users-by-page-row-6")).not.toBeInTheDocument();
  });

  it("não exibe botão de expandir quando há 5 ou menos páginas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(3) },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    expect(
      screen.queryByRole("button", { name: /ver mais páginas/i })
    ).not.toBeInTheDocument();
  });

  it("filtra a lista pela página selecionada", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(4) },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    const select = screen.getByTestId("select-native");
    await userEvent.selectOptions(select, "/pagina-2");

    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent(
      "/pagina-2"
    );
    expect(screen.queryByTestId("users-by-page-row-2")).not.toBeInTheDocument();
  });

  it("formata valores numéricos em pt-BR", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        pages: [
          { path: "/dashboard", currentUsers: 7672, averageUsers: 9565 },
        ],
      },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    expect(screen.getByText("7.672")).toBeInTheDocument();
    expect(screen.getByText("9.565")).toBeInTheDocument();
  });

  it("barra de acesso é proporcional ao maior valor atual", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        pages: [
          { path: "/a", currentUsers: 1000, averageUsers: 1000 },
          { path: "/b", currentUsers: 500, averageUsers: 1000 },
        ],
      },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    expect(screen.getByTestId("users-by-page-bar-fill-1")).toHaveStyle({
      width: "100%",
    });
    expect(screen.getByTestId("users-by-page-bar-fill-2")).toHaveStyle({
      width: "50%",
    });
  });

  it("renderiza cabeçalho da tabela com colunas corretas", () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(2) },
    };
    const { container } = render(<UsersByPageCard systemName="SigPAE" />);

    const header = container.querySelector(".border-b");
    expect(header).not.toBeNull();
    const scope = within(header as HTMLElement);
    expect(scope.getByText("Descrição")).toBeInTheDocument();
    expect(scope.getByText("Acesso")).toBeInTheDocument();
    expect(scope.getByText("Agora")).toBeInTheDocument();
    expect(scope.getByText("Média")).toBeInTheDocument();
  });

  it("ordena por 'Agora' em ordem ascendente no primeiro clique", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        pages: [
          { path: "/a", currentUsers: 300, averageUsers: 100 },
          { path: "/b", currentUsers: 100, averageUsers: 200 },
          { path: "/c", currentUsers: 200, averageUsers: 300 },
        ],
      },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    await userEvent.click(screen.getByTestId("users-by-page-sort-currentUsers"));

    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent("/b");
    expect(screen.getByTestId("users-by-page-row-2")).toHaveTextContent("/c");
    expect(screen.getByTestId("users-by-page-row-3")).toHaveTextContent("/a");
  });

  it("alterna para descendente no segundo clique e limpa no terceiro", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        pages: [
          { path: "/a", currentUsers: 300, averageUsers: 100 },
          { path: "/b", currentUsers: 100, averageUsers: 200 },
          { path: "/c", currentUsers: 200, averageUsers: 300 },
        ],
      },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    const trigger = screen.getByTestId("users-by-page-sort-currentUsers");

    await userEvent.click(trigger);
    await userEvent.click(trigger);
    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent("/a");
    expect(screen.getByTestId("users-by-page-row-3")).toHaveTextContent("/b");

    await userEvent.click(trigger);
    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent("/a");
    expect(screen.getByTestId("users-by-page-row-2")).toHaveTextContent("/b");
    expect(screen.getByTestId("users-by-page-row-3")).toHaveTextContent("/c");
  });

  it("reseta direção ao trocar de coluna", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: {
        system: "SigPAE",
        pages: [
          { path: "/z", currentUsers: 100, averageUsers: 300 },
          { path: "/a", currentUsers: 200, averageUsers: 100 },
          { path: "/m", currentUsers: 300, averageUsers: 200 },
        ],
      },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    await userEvent.click(screen.getByTestId("users-by-page-sort-currentUsers"));
    await userEvent.click(screen.getByTestId("users-by-page-sort-currentUsers"));
    await userEvent.click(screen.getByTestId("users-by-page-sort-path"));

    expect(screen.getByTestId("users-by-page-row-1")).toHaveTextContent("/a");
    expect(screen.getByTestId("users-by-page-row-2")).toHaveTextContent("/m");
    expect(screen.getByTestId("users-by-page-row-3")).toHaveTextContent("/z");
  });

  it("indica coluna ativa via aria-sort", async () => {
    mockQueryResult = {
      ...mockQueryResult,
      data: { system: "SigPAE", pages: buildPages(3) },
    };
    render(<UsersByPageCard systemName="SigPAE" />);

    const trigger = screen.getByTestId("users-by-page-sort-averageUsers");
    const columnHeader = trigger.closest('[role="columnheader"]');
    expect(columnHeader).toHaveAttribute("aria-sort", "none");

    await userEvent.click(trigger);
    expect(columnHeader).toHaveAttribute("aria-sort", "ascending");

    await userEvent.click(trigger);
    expect(columnHeader).toHaveAttribute("aria-sort", "descending");
  });
});
