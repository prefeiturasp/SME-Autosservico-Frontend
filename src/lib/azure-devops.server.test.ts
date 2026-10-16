import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const getMock = vi.hoisted(() => vi.fn());

vi.mock("axios", () => ({
    default: {
        create: () => ({ get: getMock }),
    },
}));

import { getBacklog } from "@/lib/azure-devops.server";

describe("getBacklog", () => {
    beforeEach(() => {
        getMock.mockReset();
    });

    it("retorna dados do backlog quando a resposta é válida", async () => {
        const mockData = {
            total_items: 1,
            parents: [],
            children: [],
            metadata: {},
        };
        getMock.mockResolvedValueOnce({ data: mockData });

        const result = await getBacklog("SME-Sustentação");

        expect(result).toEqual(mockData);
        expect(getMock).toHaveBeenCalledWith(
            "/backlog",
            expect.objectContaining({
                params: expect.objectContaining({
                    organization: "SME-Spassu",
                    project_name: "SME-Sustentação",
                }),
            }),
        );
    });

    it("repassa params extras para o endpoint", async () => {
        const mockData = {
            total_items: 0,
            parents: [],
            children: [],
            metadata: {},
        };
        getMock.mockResolvedValueOnce({ data: mockData });

        await getBacklog("Novo SGP", { states: "Active" });

        expect(getMock).toHaveBeenCalledWith(
            "/backlog",
            expect.objectContaining({
                params: expect.objectContaining({
                    project_name: "Novo SGP",
                    states: "Active",
                }),
            }),
        );
    });

    it("lança erro quando response.data é falsy", async () => {
        getMock.mockResolvedValueOnce({ data: null });

        await expect(getBacklog("Projeto")).rejects.toThrow(
            "Resposta vazia do serviço de backlog",
        );
    });
});
