import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { EstablishmentProps } from "../types/Establishment";
import { moveItem, ordersAfterMove, setupChecklist, trialDaysLeft, untranslatedCount } from "./panel";

describe("trialDaysLeft", () => {
	const now = new Date(2026, 10, 19, 15);
	it("redondea hacia arriba", () => expect(trialDaysLeft(new Date(2026, 10, 30), now)).toBe(11));
	it("acepta objetos con toDate", () =>
		expect(trialDaysLeft({ toDate: () => new Date(2026, 10, 30) }, now)).toBe(11));
	it("fecha pasada da 0", () => expect(trialDaysLeft(new Date(2026, 10, 1), now)).toBe(0));
	it("sin fecha da null", () => {
		expect(trialDaysLeft(undefined, now)).toBeNull();
		expect(trialDaysLeft(null, now)).toBeNull();
	});
});

describe("setupChecklist", () => {
	const store = new Map<string, string>();
	beforeEach(() => {
		store.clear();
		vi.stubGlobal("localStorage", { getItem: (k: string) => store.get(k) ?? null });
	});
	afterEach(() => vi.unstubAllGlobals());
	const e = { id: "e1", logoUrl: "l", bannerUrl: "b" } as EstablishmentProps;

	it("marca marca y productos", () => {
		expect(setupChecklist(e, 5)).toMatchObject({ brand: true, products: true, qr: false, share: false });
		expect(setupChecklist(e, 4).products).toBe(false);
		expect(setupChecklist({ ...e, bannerUrl: null }, 5).brand).toBe(false);
	});

	it("lee qr y enlace de localStorage por establecimiento", () => {
		store.set("goqr:qr-downloaded:e1", "1");
		store.set("goqr:link-copied:e2", "1");
		expect(setupChecklist(e, 0)).toMatchObject({ qr: true, share: false });
	});
});

describe("untranslatedCount", () => {
	it("cuenta vacíos y nulos", () =>
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		expect(untranslatedCount([{ en_name: "" }, { en_name: null as any }, { en_name: "Chicken" }])).toBe(2));
});

describe("moveItem / ordersAfterMove", () => {
	it("fuera de rango devuelve la misma lista", () => {
		const l = ["a", "b", "c"];
		expect(moveItem(l, 0, -1)).toBe(l);
		expect(moveItem(l, 2, 1)).toBe(l);
	});
	it("mueve sin mutar", () => {
		const l = ["a", "b", "c"];
		expect(moveItem(l, 1, 1)).toEqual(["a", "c", "b"]);
		expect(l).toEqual(["a", "b", "c"]);
	});
	it("order = índice + 1", () =>
		expect(ordersAfterMove([{ id: "x" }, { id: "y" }])).toEqual([
			{ id: "x", order: 1 },
			{ id: "y", order: 2 },
		]));
});
