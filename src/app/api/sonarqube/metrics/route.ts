import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveProjectKey } from "@/lib/sonarqube/resolveProjectKey";
import { fetchQualityMetricsWithFallback } from "@/lib/sonarqube/fetchQualityMetricsWithFallback";
import {
  DEPLOY_ENVIRONMENTS,
  getSonarBranchesForEnvironment,
  type DeployEnvironment,
} from "@/types/deployEnvironment";
import type { SonarMetricsApiResponse } from "@/types/sonarqube";

export const runtime = "nodejs";
export const revalidate = 0;

function parseEnvironment(raw: string): DeployEnvironment | null {
  return DEPLOY_ENVIRONMENTS.some((e) => e.value === raw)
    ? (raw as DeployEnvironment)
    : null;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const projectName = (searchParams.get("projectName") ?? "").trim();
  const sonarProjectKey = (searchParams.get("sonarProjectKey") ?? "").trim() || undefined;
  const zabbixQueryJenkinsJob =
    (searchParams.get("zabbixQueryJenkinsJob") ?? "").trim() || undefined;
  const environmentRaw = (searchParams.get("environment") ?? "").trim();
  const environment = environmentRaw ? parseEnvironment(environmentRaw) : null;

  if (!projectName) {
    return NextResponse.json({ error: "projectName é obrigatório" }, { status: 400 });
  }
  if (environmentRaw && !environment) {
    return NextResponse.json({ error: "environment inválido" }, { status: 400 });
  }

  try {
    const projectKey = await resolveProjectKey({
      projectName,
      sonarProjectKey,
      zabbixQueryJenkinsJob,
    });

    if (!projectKey) {
      const notFound: SonarMetricsApiResponse = {
        found: false,
        message: "Projeto não encontrado no SonarQube",
      };
      return NextResponse.json(notFound);
    }

    const branches = environment ? getSonarBranchesForEnvironment(environment) : [];
    const result = await fetchQualityMetricsWithFallback(projectKey, branches);

    if (!result.found) {
      const message =
        branches.length > 0
          ? `Nenhuma branch encontrada para o ambiente selecionado (tentado: ${result.triedBranches.join(", ")})`
          : "Nenhuma análise disponível no SonarQube";
      return NextResponse.json({ found: false, message } satisfies SonarMetricsApiResponse);
    }

    const ok: SonarMetricsApiResponse = { found: true, data: result.data };
    return NextResponse.json(ok);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar métricas do SonarQube";
    return NextResponse.json(
      { error: errorMessage ?? "Erro ao consultar métricas do SonarQube" },
      { status: 500 },
    );
  }
}
