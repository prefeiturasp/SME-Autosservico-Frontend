import { beforeEach, describe, expect, it, vi } from "vitest";

const zabbixRpcMock = vi.fn();

vi.mock("@/lib/zabbix.server", () => ({
    __esModule: true,
    zabbixRpc: zabbixRpcMock,
}));

describe("getJenkinsJobSummary", () => {
    beforeEach(() => {
        vi.resetModules();
        zabbixRpcMock.mockReset();
    });

    it("faz item.get com params no formato esperado", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await getJenkinsJobSummary("SME-NovoSGP-Docs/master");

        expect(zabbixRpcMock).toHaveBeenCalledWith(
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP-Docs/master]" },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("sem resultados → retorna objeto vazio", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        await expect(
            getJenkinsJobSummary("SME-NovoSGP-Docs/master"),
        ).resolves.toEqual({});
    });

    it("com lastvalue válido → retorna builds parseadas", async () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 11,
                    result: "SUCCESS",
                    duration: 88873,
                },
                lastSuccessfulBuild: {
                    timestamp: 1706266134892,
                    number: 11,
                    duration: 88873,
                },
                lastFailedBuild: {
                    timestamp: 1704216262092,
                    number: 9,
                    duration: 133777,
                },
            },
        ]);

        zabbixRpcMock.mockResolvedValueOnce([{ itemid: "3261234", lastvalue }]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        const res = await getJenkinsJobSummary("SME-NovoSGP-Docs/master");

        expect(res.lastBuild?.number).toBe(11);
        expect(res.lastBuild?.status).toBe("SUCCESS");
        expect(res.lastSuccessfulBuild?.status).toBe("SUCCESS");
        expect(res.lastFailedBuild?.status).toBe("FAILURE");
    });

    it("quando a chave não inclui branch e não encontra item, tenta fallback '<key>/master'", async () => {
        zabbixRpcMock
            .mockResolvedValueOnce([]) // primeira tentativa (sem /master)
            .mockResolvedValueOnce([
                {
                    itemid: "1",
                    lastvalue: JSON.stringify([
                        {
                            lastBuild: {
                                timestamp: 1706266134892,
                                number: 11,
                                result: "SUCCESS",
                                duration: 88873,
                            },
                        },
                    ]),
                },
            ]); // fallback com /master

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary("SME-NovoSGP");

        expect(res.lastBuild?.number).toBe(11);
        expect(zabbixRpcMock).toHaveBeenNthCalledWith(
            1,
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP]" },
                filter: { type: 18 },
            },
            1,
        );
        expect(zabbixRpcMock).toHaveBeenNthCalledWith(
            2,
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP/master]" },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("quando a chave já inclui branch, não tenta fallback", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        await expect(
            getJenkinsJobSummary("SME-NovoSGP-Docs/master"),
        ).resolves.toEqual({});
        expect(zabbixRpcMock).toHaveBeenCalledTimes(1);
        expect(zabbixRpcMock).toHaveBeenCalledWith(
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP-Docs/master]" },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("quando environment=homolog, busca primeiro pelo ambiente de homologação", async () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 11,
                    result: "SUCCESS",
                    duration: 88873,
                },
            },
        ]);

        zabbixRpcMock.mockResolvedValueOnce([{ itemid: "1", lastvalue }]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary(
            "SME-NovoSGP/master",
            undefined,
            "homolog",
        );

        expect(res.lastBuild?.number).toBe(11);
        expect(zabbixRpcMock).toHaveBeenCalledTimes(1);
        expect(zabbixRpcMock).toHaveBeenCalledWith(
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP/homolog]" },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("quando não encontra '<key>' nem '<key>/master', busca por prefixo '<key>/' e escolhe o mais recente", async () => {
        const older = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1700000000000,
                    number: 1,
                    result: "SUCCESS",
                    duration: 1000,
                },
            },
        ]);
        const newer = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1700000005000,
                    number: 2,
                    result: "FAILURE",
                    duration: 2000,
                },
            },
        ]);

        zabbixRpcMock
            .mockResolvedValueOnce([]) // primeira tentativa (sem branch)
            .mockResolvedValueOnce([]) // fallback /master
            .mockResolvedValueOnce([
                { itemid: "a", lastvalue: older },
                { itemid: "b", lastvalue: newer },
            ]); // busca por prefixo

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary("GIPE-Frontend-PRs");

        expect(res.lastBuild?.number).toBe(2);
        expect(res.lastBuild?.status).toBe("FAILURE");

        expect(zabbixRpcMock).toHaveBeenCalledTimes(3);
        expect(zabbixRpcMock).toHaveBeenNthCalledWith(
            3,
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[GIPE-Frontend-PRs/" },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("lastvalue malformado → safeSummaryFromLastvalue retorna null → busca compat fallback", async () => {
        zabbixRpcMock
            .mockResolvedValueOnce([
                { itemid: "1", lastvalue: "INVALID_JSON{{{" },
            ]) // direto
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary("SME-NovoSGP");

        expect(res).toEqual({});
        expect(zabbixRpcMock).toHaveBeenCalledTimes(3);
    });

    it("environment=homolog com projeto /production → usa candidatos derivados de prod", async () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 5,
                    result: "SUCCESS",
                    duration: 1000,
                },
            },
        ]);
        zabbixRpcMock.mockResolvedValueOnce([{ itemid: "1", lastvalue }]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary(
            "SME-Project/production",
            undefined,
            "homolog",
        );

        expect(res.lastBuild?.number).toBe(5);
        expect(zabbixRpcMock).toHaveBeenCalledTimes(1);
        expect(zabbixRpcMock).toHaveBeenCalledWith(
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: {
                    key_: "jenkins.job.mb.get[SME-Project/homologuction]",
                },
                filter: { type: 18 },
            },
            1,
        );
    });

    it("environment=homolog, todos lookups diretos falham → busca prefixo com filtro isHomologEnv", async () => {
        for (let i = 0; i < 8; i++) {
            zabbixRpcMock.mockResolvedValueOnce([]);
        }

        const lastvalueHomolog = JSON.stringify([
            {
                fullName: "SME-Project/homolog",
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 1,
                    result: "SUCCESS",
                    duration: 1000,
                },
            },
        ]);
        const lastvalueFeature = JSON.stringify([
            {
                fullName: "SME-Project/feature/test",
                lastBuild: {
                    timestamp: 1700000000000,
                    number: 99,
                    result: "FAILURE",
                    duration: 2000,
                },
            },
        ]);
        zabbixRpcMock.mockResolvedValueOnce([
            { itemid: "1", lastvalue: lastvalueHomolog },
            { itemid: "2", lastvalue: lastvalueFeature },
            { itemid: "3", lastvalue: "null" },
            { itemid: "4", lastvalue: "[]" },
            { itemid: "5", lastvalue: "[42]" },
            { itemid: "6", lastvalue: '[{"x": 1}]' },
            { itemid: "7", lastvalue: '[{"fullName": "SME-Project"}]' },
            { itemid: "8", lastvalue: "INVALID_JSON{{{" },
        ]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary(
            "SME-Project",
            undefined,
            "homolog",
        );

        expect(res.lastBuild?.number).toBe(1);
        expect(res.lastBuild?.status).toBe("SUCCESS");
        expect(zabbixRpcMock).toHaveBeenCalledTimes(9);
    });

    it("projectFullName vazio → retorna {} sem chamar zabbixRpc", async () => {
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await expect(getJenkinsJobSummary("")).resolves.toEqual({});
        expect(zabbixRpcMock).not.toHaveBeenCalled();
    });

    it("zabbixRpc retorna undefined na busca por prefixo → fallback para []", async () => {
        zabbixRpcMock
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce(undefined);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await expect(getJenkinsJobSummary("SME-Projeto")).resolves.toEqual({});
        expect(zabbixRpcMock).toHaveBeenCalledTimes(3);
    });

    it("candidato sem lastvalue na busca por prefixo é ignorado; candidato válido seguinte é selecionado", async () => {
        const validLastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1000,
                    number: 42,
                    result: "SUCCESS",
                    duration: 1000,
                },
            },
        ]);
        zabbixRpcMock
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                { itemid: "1" },
                { itemid: "2", lastvalue: validLastvalue },
            ]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary("SME-Projeto");

        expect(res.lastBuild?.number).toBe(42);
    });

    it("candidato com JSON malformado no loop de prefixo é ignorado (safeSummaryFromLastvalue retorna null)", async () => {
        zabbixRpcMock
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ itemid: "1", lastvalue: "INVALID{{{" }]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await expect(getJenkinsJobSummary("SME-Projeto")).resolves.toEqual({});
    });

    it("candidato com summary sem builds válidos tem score NEGATIVE_INFINITY e é descartado", async () => {
        const semBuilds = JSON.stringify([{}]);

        zabbixRpcMock
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([{ itemid: "1", lastvalue: semBuilds }]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await expect(getJenkinsJobSummary("SME-Projeto")).resolves.toEqual({});
    });

    it("scoreSummary usa timestampMs de lastSuccessfulBuild e lastFailedBuild; candidato com score menor é descartado", async () => {
        const comTodosBuilds = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1000,
                    number: 1,
                    result: "SUCCESS",
                    duration: 1000,
                },
                lastSuccessfulBuild: {
                    timestamp: 3000,
                    number: 1,
                    duration: 1000,
                },
                lastFailedBuild: { timestamp: 2000, number: 0, duration: 1000 },
            },
        ]);
        const comMenorScore = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 500,
                    number: 5,
                    result: "FAILURE",
                    duration: 500,
                },
            },
        ]);

        zabbixRpcMock
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([])
            .mockResolvedValueOnce([
                { itemid: "a", lastvalue: comTodosBuilds },
                { itemid: "b", lastvalue: comMenorScore },
            ]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        const res = await getJenkinsJobSummary("SME-Projeto");

        expect(res.lastBuild?.number).toBe(1);
    });

    it("environment=homolog, todos candidatos de prefixo são não-homolog → getHomologSummary retorna null → {}", async () => {
        for (let i = 0; i < 8; i++) {
            zabbixRpcMock.mockResolvedValueOnce([]);
        }
        const producaoLastvalue = JSON.stringify([
            {
                fullName: "SME-Projeto/production",
                lastBuild: {
                    timestamp: 1000,
                    number: 1,
                    result: "SUCCESS",
                    duration: 1000,
                },
            },
        ]);
        zabbixRpcMock.mockResolvedValueOnce([
            { itemid: "1", lastvalue: producaoLastvalue },
        ]);

        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");

        await expect(
            getJenkinsJobSummary("SME-Projeto", undefined, "homolog"),
        ).resolves.toEqual({});
        expect(zabbixRpcMock).toHaveBeenCalledTimes(9);
    });
});
