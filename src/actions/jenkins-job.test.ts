import { describe, it, expect, vi, beforeEach } from "vitest";

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
            1
        );
    });

    it("sem resultados → retorna objeto vazio", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        await expect(getJenkinsJobSummary("SME-NovoSGP-Docs/master")).resolves.toEqual({});
    });

    it("com lastvalue válido → retorna builds parseadas", async () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: { timestamp: 1706266134892, number: 11, result: "SUCCESS", duration: 88873 },
                lastSuccessfulBuild: { timestamp: 1706266134892, number: 11, duration: 88873 },
                lastFailedBuild: { timestamp: 1704216262092, number: 9, duration: 133777 },
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
                            lastBuild: { timestamp: 1706266134892, number: 11, result: "SUCCESS", duration: 88873 },
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
            1
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
            1
        );
    });

    it("quando a chave já inclui branch, não tenta fallback", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getJenkinsJobSummary } = await import("@/actions/jenkins-job");
        await expect(getJenkinsJobSummary("SME-NovoSGP-Docs/master")).resolves.toEqual({});
        expect(zabbixRpcMock).toHaveBeenCalledTimes(1);
        expect(zabbixRpcMock).toHaveBeenCalledWith(
            "item.get",
            {
                output: ["lastvalue"],
                hostids: "10726",
                search: { key_: "jenkins.job.mb.get[SME-NovoSGP-Docs/master]" },
                filter: { type: 18 },
            },
            1
        );
    });

    it("quando não encontra '<key>' nem '<key>/master', busca por prefixo '<key>/' e escolhe o mais recente", async () => {
        const older = JSON.stringify([
            {
                lastBuild: { timestamp: 1700000000000, number: 1, result: "SUCCESS", duration: 1000 },
            },
        ]);
        const newer = JSON.stringify([
            {
                lastBuild: { timestamp: 1700000005000, number: 2, result: "FAILURE", duration: 2000 },
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
            1
        );
    });
});
