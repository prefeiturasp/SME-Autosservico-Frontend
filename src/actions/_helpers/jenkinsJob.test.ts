import { describe, it, expect } from "vitest";
import { jenkinsJobSummaryFromLastvalue } from "./jenkinsJob";
import { formatDDMMYYYY_HHMM_FromMillis } from "@/lib/utils";

describe("jenkinsJobSummaryFromLastvalue", () => {
    it("retorna objeto vazio quando lastvalue é undefined", () => {
        expect(jenkinsJobSummaryFromLastvalue(undefined)).toEqual({});
    });

    it("retorna objeto vazio quando lastvalue é um array vazio", () => {
        expect(jenkinsJobSummaryFromLastvalue("[]")).toEqual({});
    });

    it("lança erro quando lastvalue não é JSON válido", () => {
        expect(() => jenkinsJobSummaryFromLastvalue("not-json")).toThrow(/lastvalue inválido/i);
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

