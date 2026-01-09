import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBacklog } from "@/lib/azure-devops.server";

export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  // 1) Auth
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 2) Query params
  const { searchParams } = new URL(req.url);
  const projectName = (searchParams.get("project_name") ?? "").trim();
  const workItemTypes = searchParams.get("work_item_types");
  const states = searchParams.get("states");

  if (!projectName) {
    return NextResponse.json({ error: "project_name é obrigatório" }, { status: 400 });
  }

  // 3) Consulta o serviço Azure DevOps
  try {
    const filters: Record<string, string> = {};
    if (workItemTypes) filters.work_item_types = workItemTypes;
    if (states) filters.states = states;

    const backlog = await getBacklog(projectName, filters);
    return NextResponse.json(backlog);
  } catch (e: unknown) {
    const errorMessage =
      typeof e === "object" && e !== null && "message" in e
        ? (e as { message?: string }).message
        : "Erro ao consultar backlog";
    return NextResponse.json({ error: errorMessage ?? "Erro ao consultar backlog" }, { status: 500 });
  }
}

