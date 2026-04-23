import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { withClient } from "@/__mocks__/renderWithClient";
import JenkinsJob from "./index";

function okJson(data: unknown) {
  return {
    ok: true,
    json: async () => data,
  } as unknown as Response;
}

function fetchUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

describe("<JenkinsJob />", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("com múltiplos subprojetos: mostra select e atualiza automaticamente ao trocar", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = fetchUrl(input);

      if (url.startsWith("/api/zabbix/jenkins/job?project=PTRF-FrontEnd&env=homolog")) {
        return okJson({
          lastBuild: {
            number: 99,
            status: "SUCCESS",
            timestampMs: 99,
            timestamp: "03/01/2024 00:00",
            durationMs: 99000,
            duration: "99s",
          },
        });
      }

      if (url.startsWith("/api/zabbix/jenkins/job?project=PTRF-BackEnd")) {
        return okJson({
          lastBuild: {
            number: 1,
            status: "SUCCESS",
            timestampMs: 1,
            timestamp: "01/01/2024 00:00",
            durationMs: 1000,
            duration: "1s",
          },
        });
      }

      if (url.startsWith("/api/zabbix/jenkins/job?project=PTRF-FrontEnd")) {
        return okJson({
          lastBuild: {
            number: 2,
            status: "FAILURE",
            timestampMs: 2,
            timestamp: "02/01/2024 00:00",
            durationMs: 2000,
            duration: "2s",
          },
        });
      }

      throw new Error(`fetch inesperado: ${url}`);
    });

    render(
      withClient(
        <JenkinsJob
          project="SigEscola"
          subprojects={[
            { label: "Backend", key: "PTRF-BackEnd" },
            { label: "Frontend", key: "PTRF-FrontEnd" },
          ]}
        />
      )
    );

    expect(await screen.findByText("Projeto")).toBeInTheDocument();
    expect(await screen.findByLabelText("Selecionar ambiente")).toHaveTextContent("Produção");

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/zabbix/jenkins/job?project=PTRF-BackEnd",
        expect.any(Object)
      );
    });

    const trigger = screen.getByLabelText("Selecionar projeto");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Frontend"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/zabbix/jenkins/job?project=PTRF-FrontEnd",
        expect.any(Object)
      );
    });

    const envTrigger = screen.getByLabelText("Selecionar ambiente");
    fireEvent.click(envTrigger);
    fireEvent.click(screen.getByText("Homologação"));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/zabbix/jenkins/job?project=PTRF-FrontEnd&env=homolog",
        expect.any(Object)
      );
    });

    expect(screen.getByLabelText("Selecionar ambiente")).toHaveTextContent("Homologação");
  });

  it("com apenas 1 subprojeto: não exige seleção adicional", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = fetchUrl(input);

      if (url.startsWith("/api/zabbix/jenkins/job?project=SME-NovoSGP")) {
        return okJson({
          lastBuild: {
            number: 1,
            status: "SUCCESS",
            timestampMs: 1,
            timestamp: "01/01/2024 00:00",
            durationMs: 1000,
            duration: "1s",
          },
        });
      }

      throw new Error(`fetch inesperado: ${url}`);
    });

    render(
      withClient(
        <JenkinsJob project="Novo SGP" subprojects={[{ label: "SME-NovoSGP", key: "SME-NovoSGP" }]} />
      )
    );

    expect(screen.queryByText("Projeto")).not.toBeInTheDocument();
    expect(await screen.findByLabelText("Selecionar ambiente")).toHaveTextContent("Produção");

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        "/api/zabbix/jenkins/job?project=SME-NovoSGP",
        expect.any(Object)
      );
    });
  });

  it("projeto N/E (ou sem chaves): não busca releases e mostra mensagem", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockImplementation(async (input) => {
      const url = fetchUrl(input);

      if (url.startsWith("/api/zabbix/jenkins/job?")) {
        throw new Error("Não deveria chamar endpoint de job");
      }

      throw new Error(`fetch inesperado: ${url}`);
    });

    render(withClient(<JenkinsJob project="Portal Educação" subprojects={[]} />));

    expect(
      await screen.findByText("Sem lançamentos disponíveis para este projeto.")
    ).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
