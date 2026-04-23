import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { UseQueryResult } from "@tanstack/react-query";

import JenkinsJobCard from "./JenkinsJobCard";
import type { JenkinsJobSummary } from "@/types/jenkins";

vi.mock("@/components/ui/skeleton", () => {
  function Skeleton(props: Readonly<React.HTMLAttributes<HTMLDivElement>>) {
    return <div data-testid="skeleton" {...props} />;
  }

  return { Skeleton };
});

vi.mock("@/components/ui/button", () => {
  const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
  >(function Button({ children, ...rest }, ref) {
    return (
      <button ref={ref} {...rest}>
        {children}
      </button>
    );
  });
  Button.displayName = "Button";

  return { Button };
});

type LiteQuery = {
  data?: JenkinsJobSummary;
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  refetch?: () => void;
};

const asQuery = (partial: LiteQuery) =>
  partial as unknown as UseQueryResult<JenkinsJobSummary, unknown>;

const makeQuery = (overrides: LiteQuery = {}) =>
  asQuery({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
  });

describe("<JenkinsJobCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("mostra o hint quando projectName está ausente", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        className="bg-muted p-3"
        query={makeQuery()}
        emptyProjectHint="Selecione um projeto por favor"
      />
    );

    expect(screen.getByText("Lançamentos")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto por favor")).toBeInTheDocument();
  });

  it("renderiza estado de loading", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ isLoading: true })}
      />
    );

    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("renderiza erro e chama refetch ao clicar em 'Tentar novamente'", async () => {
    const refetch = vi.fn();
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ isError: true, refetch })}
      />
    );

    expect(screen.getByText("Não foi possível carregar os dados.")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /Tentar novamente/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso sem builds -> mostra mensagem de ausência de dados", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({ data: {} })}
      />
    );

    expect(screen.getByText("Sem dados de versão para este projeto.")).toBeInTheDocument();
  });

  it("sucesso -> exibe versão realizada com ícone de relógio", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({
          data: {
            lastSuccessfulBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
          },
        })}
      />
    );

    expect(screen.getByText("v11")).toBeInTheDocument();
    expect(screen.getByText(/Realizado em: 26\/01\/2024 10:22/)).toBeInTheDocument();
  });

  it("exibe versão agendada quando lastBuild é diferente de lastSuccessfulBuild", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({
          data: {
            lastBuild: {
              number: 12,
              status: "IN_PROGRESS",
              timestampMs: 1706352534892,
              timestamp: "27/01/2024 10:22",
              durationMs: 0,
              duration: "0s",
            },
            lastSuccessfulBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
          },
        })}
      />
    );

    expect(screen.getByText("v11")).toBeInTheDocument();
    expect(screen.getByText(/Realizado em: 26\/01\/2024 10:22/)).toBeInTheDocument();
    expect(screen.getByText("v12")).toBeInTheDocument();
    expect(screen.getByText(/Agendado para: 27\/01\/2024 10:22/)).toBeInTheDocument();
  });

  it("não exibe versão agendada quando lastBuild é igual a lastSuccessfulBuild", () => {
    render(
      <JenkinsJobCard
        title="Lançamentos"
        projectName="SME-NovoSGP-Docs/master"
        query={makeQuery({
          data: {
            lastBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
            lastSuccessfulBuild: {
              number: 11,
              status: "SUCCESS",
              timestampMs: 1706266134892,
              timestamp: "26/01/2024 10:22",
              durationMs: 88873,
              duration: "1m 28s",
            },
          },
        })}
      />
    );

    expect(screen.getByText("v11")).toBeInTheDocument();
    expect(screen.getByText(/Realizado em:/)).toBeInTheDocument();
    expect(screen.queryByText(/Agendado para:/)).not.toBeInTheDocument();
  });
});
