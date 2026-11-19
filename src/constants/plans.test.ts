import { describe, expect, it } from "vitest";

import { PLANS } from "./plans";

describe("PLANS", () => {
	const byId = (id: string) => PLANS.find((p) => p.id === id);

	it("tiene los tres planes", () => {
		expect(PLANS.map((p) => p.id).sort()).toEqual(["annual", "lifetime", "monthly"]);
	});

	it("el anual cuesta 2520 (210/mes) y ahorra 30%", () => {
		const annual = byId("annual")!;
		expect(annual.priceDop).toBe(2520);
		expect(annual.perMonthDop).toBe(210);
		expect(Math.round((1 - annual.perMonthDop / byId("monthly")!.perMonthDop) * 100)).toBe(30);
	});
});
