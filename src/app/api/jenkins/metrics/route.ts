import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getJenkinsBranchBuildMetrics } from "@/actions/jenkins-metrics";
import type { JenkinsEnvironment } from "@/types/deployEnvironment";

export const runtime = "nodejs";
export const revalidate = 0;

function resolveJenkinsEnvironment(env: string): JenkinsEnvironment {
  if (env === "homolog") return "homolog";
  if (env === "test") return "test";
  return "prod";
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const project = (searchParams.get("project") ?? "").trim();
  const env = (searchParams.get("env") ?? "").trim().toLowerCase();

  if (!project) return NextResponse.json({ error: "project é obrigatório" }, { status: 400 });

  const resolvedEnv = resolveJenkinsEnvironment(env);

  try {
    const metrics = await getJenkinsBranchBuildMetrics(project, resolvedEnv);
    return NextResponse.json(metrics);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar Jenkins";

    return NextResponse.json(
      { error: errorMessage ?? "Erro ao consultar Jenkins" },
      { status: 500 },
    );
  }
}
