import { describe, expect, it } from "vitest";
import BacklogCardDirect from "../BacklogCard";
import BacklogCardFromIndex from "./index";

describe("BacklogCard/index re-export", () => {
    it("exporta o mesmo componente que BacklogCard.tsx", () => {
        expect(BacklogCardFromIndex).toBe(BacklogCardDirect);
    });
});
