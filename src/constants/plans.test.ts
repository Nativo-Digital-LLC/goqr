import { describe, expect, it } from "vitest";

import { PLANS } from "./plans";

describe("PLANS", () => {
	const byId = (id: string) => PLANS.find((p) => p.id === id);

	it("tiene los tres planes", () => {
		expect(PLANS.map((p) => p.id).sort()).toEqual(["annual", "lifetime", "monthly"]);
	});

	it("el mensual de lista cuesta 500", () => {
		expect(byId("monthly")!.priceDop).toBe(500);
		expect(byId("monthly")!.perMonthDop).toBe(500);
	});

	it("el anual cuesta 4800 (400/mes) y ahorra 20%", () => {
		const annual = byId("annual")!;
		expect(annual.priceDop).toBe(4800);
		expect(annual.perMonthDop).toBe(400);
		expect(annual.priceDop / 12).toBe(annual.perMonthDop);
		expect(Math.round((1 - annual.perMonthDop / byId("monthly")!.perMonthDop) * 100)).toBe(20);
	});

	it("el vitalicio sigue en 11000", () => {
		expect(byId("lifetime")!.priceDop).toBe(11000);
	});
});
