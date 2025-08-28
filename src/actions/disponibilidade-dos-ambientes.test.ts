// tests/actions/disponibilidade-dos-ambientes.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const zabbixRpcMock = vi.fn();

vi.mock("@/lib/zabbix.server", () => ({
    __esModule: true,
    zabbixRpc: zabbixRpcMock,
}));

// helper para formatar exatamente como a action (dd/mm/aaaa HH:mm)
const fmt = (sec: number) => {
    const d = new Date(sec * 1000);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
};

describe("getDisponibilidadeDosAmbientesProducao", () => {
    beforeEach(() => {
        vi.resetModules();
        zabbixRpcMock.mockReset();
        process.env.ZABBIX_DEFAULT_HOST = "Zabbix server";
        process.env.ZABBIX_RECENT_WINDOW_MS = String(24 * 60 * 60 * 1000); // 24h
        // fixa o tempo para condições de janela consistentes
        vi.setSystemTime(new Date("2025-08-27T12:00:00.000Z"));
    });

    it("sem triggers → disponível / sem incidentes recentes", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res).toEqual({
            available: true,
            incidents_recent: false,
            message: "Sem incidentes recentes",
        });

        const calledParams = zabbixRpcMock.mock.calls[0][1];
        expect(calledParams.filter.description).toEqual(["Portal Educação"]);
        expect(calledParams.filter.host).toEqual(["Zabbix server"]);
    });

    it("trigger ativo (value=1) → indisponível / incidentes ativos", async () => {
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "1", lastchange: "1751304488" },
        ]);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res.available).toBe(false);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toMatch(/incidentes ativos/i);
    });

    it("trigger ok porém lastchange dentro da janela → houve incidentes recentes", async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(nowSec) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toMatch(/Houve incidentes recentes/i);
    });

    it("trigger ok e lastchange fora da janela → sem incidentes recentes", async () => {
        const longAgo = Math.floor((Date.now() - 10 * 24 * 3600 * 1000) / 1000);
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(longAgo) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(false);
        expect(res.message).toMatch(/Sem incidentes recentes/i);
    });

    it("honra host passado por parâmetro", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação",
            "Meu Host"
        );
        const calledParams = zabbixRpcMock.mock.calls[0][1];
        expect(calledParams.filter.host).toEqual(["Meu Host"]);
    });

    it("retorno undefined do zabbixRpc → trata como sem triggers", async () => {
        zabbixRpcMock.mockResolvedValueOnce(undefined);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res).toEqual({
            available: true,
            incidents_recent: false,
            message: "Sem incidentes recentes",
        });
    });

    it("quando host efetivo estiver vazio, filtro NÃO inclui host (ramo alternativo)", async () => {
        // Com a versão atual da action, se host efetivo for falsy, omitimos o filtro 'host'
        process.env.ZABBIX_DEFAULT_HOST = ""; // sem fallback
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        await getDisponibilidadeDosAmbientesProducao("Portal Educação", "");
        const calledParams = zabbixRpcMock.mock.calls[0][1];
        expect(calledParams.filter.description).toEqual(["Portal Educação"]);
        expect(calledParams.filter.host).toEqual([""]); // <- mudou: não incluímos host
    });

    it("sem triggers → sem incidents_recent e sem lastIncidentAt", async () => {
        zabbixRpcMock.mockResolvedValueOnce([]);
        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );
        expect(res).toEqual({
            available: true,
            incidents_recent: false,
            message: "Sem incidentes recentes",
        });
        expect(res.lastIncidentAt).toBeUndefined();
    });

    it("incidente ATIVO (value=1) → lastIncidentAt do mais recente ativo", async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const active1 = nowSec - 3600; // 1h atrás
        const active2 = nowSec - 60 * 10; // 10min atrás (mais recente)

        zabbixRpcMock.mockResolvedValueOnce([
            { value: "1", lastchange: String(active1) },
            { value: "1", lastchange: String(active2) },
            { value: "0", lastchange: String(nowSec - 60 * 30) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(false);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Há incidentes ativos");
        expect(res.lastIncidentAt).toBe(fmt(active2));
    });

    it("sem ativo, mas recente dentro da janela → lastIncidentAt do mais recente recente", async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const recent1 = nowSec - 60 * 50; // 50min atrás
        const recent2 = nowSec - 60 * 5; // 5min atrás (mais recente)
        const old = nowSec - 60 * 60 * 48; // 48h atrás (fora da janela)

        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(recent1) },
            { value: "0", lastchange: String(recent2) },
            { value: "0", lastchange: String(old) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Houve incidentes recentes");
        expect(res.lastIncidentAt).toBe(fmt(recent2));
    });

    it("sem ativo e todos fora da janela → sem incidents_recent e sem lastIncidentAt", async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const old1 = nowSec - 60 * 60 * 30; // 30h atrás
        const old2 = nowSec - 60 * 60 * 72; // 72h atrás

        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(old1) },
            { value: "0", lastchange: String(old2) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res).toMatchObject({
            available: true,
            incidents_recent: false,
            message: "Sem incidentes recentes",
        });
        expect(res.lastIncidentAt).toBeUndefined();
    });

    // ✅ NOVO: ativos têm precedência sobre recentes
    it("quando há triggers ativos e recentes, prevalece o estado 'ativo' e a data do ativo mais recente", async () => {
        const nowSec = Math.floor(Date.now() / 1000);
        const recent = nowSec - 60 * 2; // 2 min (OK)
        const active = nowSec - 60 * 1; // 1 min (ATIVO, deve vencer)
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(recent) },
            { value: "1", lastchange: String(active) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(false);
        expect(res.message).toBe("Há incidentes ativos");
        expect(res.lastIncidentAt).toBe(fmt(active));
    });

    it("usa o valor DEFAULT de RECENT_WINDOW_MS quando a env não está definida (fallback do ??)", async () => {
        // este teste precisa reimportar o módulo SEM a env definida
        vi.resetModules();
        delete process.env.ZABBIX_RECENT_WINDOW_MS; // força fallback
        process.env.ZABBIX_DEFAULT_HOST = "Zabbix server";

        const nowSec = Math.floor(Date.now() / 1000);
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(nowSec) }, // recente dentro da janela default (24h)
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toMatch(/Houve incidentes recentes/i);
    });

    it("ativo com lastchange enorme (finite) gera Invalid Date → lastIncidentAt fica undefined (cobre isNaN path)", async () => {
        // Número finito mas tão grande que new Date(seconds*1000) vira Invalid Date
        const huge = 9e20; // isFinite(huge) === true, mas new Date(huge*1000) => Invalid Date

        zabbixRpcMock.mockResolvedValueOnce([
            { value: "1", lastchange: String(huge) },
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(false);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Há incidentes ativos");
        // 🔎 aqui cobrimos formatDDMMYYYY_HHMM_FromSeconds com Invalid Date
        expect(res.lastIncidentAt).toBeUndefined();
    });

    it("ATIVO com lastchange inválido/ausente → fallback 0 e lastIncidentAt undefined", async () => {
        // Ambos os ativos têm lastchange que vira 0/NaN → Math.max(...)=0 → formatter cai no ramo !seconds
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "1", lastchange: "" as string }, // Number("") === 0
            { value: "1", lastchange: "NaN" as string }, // Number("NaN") => NaN -> || 0
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(false);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Há incidentes ativos");
        // ✅ cobre formatter (!seconds) e caminho de ativos com data indefinida (linha ~56)
        expect(res.lastIncidentAt).toBeUndefined();
    });

    it("SEM ativos, mas 'recentes' com lastchange gigante → incidents_recent=true e lastIncidentAt undefined (Invalid Date)", async () => {
        // Usamos um 'seconds' enorme para ficar 'dentro' da janela (diferença negativa) mas quebrar o Date
        const huge = 9e20; // isFinite(huge) === true; new Date(huge*1000) => Invalid Date
        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: String(huge) }, // passa no filtro de 'recent' (diferença negativa)
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Houve incidentes recentes");
        // ✅ cobre formatter (Invalid Date -> undefined) no ramo 'recent' (linha ~71)
        expect(res.lastIncidentAt).toBeUndefined();
    });

    it("sem ativos e 'recent' com lastchange=0 dentro de uma janela ENORME → incidents_recent=true e lastIncidentAt undefined (!seconds)", async () => {
        vi.resetModules();
        // Janela absurdamente grande para que 1970 (0) caiba como 'recente'
        process.env.ZABBIX_DEFAULT_HOST = "Zabbix server";
        process.env.ZABBIX_RECENT_WINDOW_MS = String(9e20); // muito > now

        zabbixRpcMock.mockResolvedValueOnce([
            { value: "0", lastchange: "0" }, // 01/01/1970
        ]);

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        const res = await getDisponibilidadeDosAmbientesProducao(
            "Portal Educação"
        );

        // cai no ramo hasRecent === true
        expect(res.available).toBe(true);
        expect(res.incidents_recent).toBe(true);
        expect(res.message).toBe("Houve incidentes recentes");

        // ...mas o formatter recebe seconds=0 → !seconds ⇒ undefined
        expect(res.lastIncidentAt).toBeUndefined();
    });

    it("usa fallback 'Zabbix server' quando ZABBIX_DEFAULT_HOST está undefined (ramo do ??)", async () => {
        // isola o módulo com a env ausente para recalcular DEFAULT_HOST
        vi.resetModules();
        delete process.env.ZABBIX_DEFAULT_HOST; // <- undefined
        process.env.ZABBIX_RECENT_WINDOW_MS = String(24 * 60 * 60 * 1000); // mantém janela
        zabbixRpcMock.mockResolvedValueOnce([]); // não importa o resultado, só validaremos os params

        const { getDisponibilidadeDosAmbientesProducao } = await import(
            "@/actions/disponibilidade-dos-ambientes"
        );
        await getDisponibilidadeDosAmbientesProducao("Portal Educação"); // sem 'host' para usar o default

        const calledParams = zabbixRpcMock.mock.calls[0][1];
        expect(calledParams.filter.description).toEqual(["Portal Educação"]);
        // ✅ com ??, undefined cai no fallback "Zabbix server"
        expect(calledParams.filter.host).toEqual(["Zabbix server"]);
    });
});
