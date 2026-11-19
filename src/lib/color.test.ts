import { describe, expect, it } from "vitest";
import { contrastRatio, readableOn } from "./color";

describe("color", () => {
	it("contrastRatio negro/blanco es 21", () => {
		expect(contrastRatio("#000000", "#FFFFFF")).toBeCloseTo(21, 2);
	});
	it("cacao y tomate ya se leen", () => {
		expect(readableOn("#2A1410").ok).toBe(true);
		expect(readableOn("#c2381f").ok).toBe(true);
	});
	it("oscurece un color claro hasta 4.5", () => {
		const r = readableOn("#F5A623");
		expect(r.ok).toBe(false);
		expect(r.text).not.toBe("#F5A623");
		expect(r.text).toBe(r.text.toUpperCase());
		expect(contrastRatio(r.text, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
	});
});
