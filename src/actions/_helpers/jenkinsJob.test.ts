import { formatDDMMYYYY_HHMM_FromMillis } from "@/lib/utils";
import { describe, expect, it } from "vitest";
import { jenkinsJobSummaryFromLastvalue } from "./jenkinsJob";

describe("jenkinsJobSummaryFromLastvalue", () => {
    it("retorna objeto vazio quando lastvalue é undefined", () => {
        expect(jenkinsJobSummaryFromLastvalue(undefined)).toEqual({});
    });

    it("retorna objeto vazio quando lastvalue é um array vazio", () => {
        expect(jenkinsJobSummaryFromLastvalue("[]")).toEqual({});
    });

    it("lança erro quando lastvalue não é JSON válido", () => {
        expect(() => jenkinsJobSummaryFromLastvalue("not-json")).toThrow(
            /lastvalue inválido/i,
        );
    });

    it("retorna objeto vazio quando primeiro elemento do array não é um objeto", () => {
        expect(jenkinsJobSummaryFromLastvalue("[42]")).toEqual({});
    });

    it("build com building=true → status IN_PROGRESS", () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 5,
                    building: true,
                    duration: 1000,
                },
            },
        ]);

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild?.status).toBe("IN_PROGRESS");
        expect(res.lastBuild?.number).toBe(5);
    });

    it("build com number inválido → lastBuild omitido do resultado", () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: "nao-numero",
                    duration: 1000,
                },
            },
        ]);

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild).toBeUndefined();
    });

    it("build com timestamp inválido → lastBuild omitido do resultado", () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: "invalido",
                    number: 1,
                    duration: 1000,
                },
            },
        ]);

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild).toBeUndefined();
    });

    it("build com duration inválida → lastBuild omitido do resultado", () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 1,
                    duration: "invalido",
                },
            },
        ]);

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild).toBeUndefined();
    });

    it("lastSuccessfulBuild omitido quando parseBuild retorna undefined", () => {
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: 1706266134892,
                    number: 11,
                    result: "SUCCESS",
                    duration: 88873,
                },
                lastSuccessfulBuild: {
                    timestamp: "invalido",
                    number: 2,
                    duration: 500,
                },
            },
        ]);

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild).toBeDefined();
        expect(res.lastSuccessfulBuild).toBeUndefined();
    });

    it("extrai última build, última com sucesso e última com falha", () => {
        const timestampMs = 1706266134892;
        const lastvalue = JSON.stringify([
            {
                lastBuild: {
                    timestamp: timestampMs,
                    number: 11,
                    result: "SUCCESS",
                    inProgress: false,
                    duration: 88873,
                },
                lastSuccessfulBuild: {
                    timestamp: timestampMs,
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

        const res = jenkinsJobSummaryFromLastvalue(lastvalue);

        expect(res.lastBuild).toMatchObject({
            number: 11,
            status: "SUCCESS",
            timestampMs,
            durationMs: 88873,
            duration: "1m 28s",
            timestamp: formatDDMMYYYY_HHMM_FromMillis(timestampMs),
        });

        expect(res.lastSuccessfulBuild).toMatchObject({
            number: 11,
            status: "SUCCESS",
            timestampMs,
            durationMs: 88873,
            duration: "1m 28s",
            timestamp: formatDDMMYYYY_HHMM_FromMillis(timestampMs),
        });

        expect(res.lastFailedBuild).toMatchObject({
            number: 9,
            status: "FAILURE",
            duration: "2m 13s",
        });
    });
});
