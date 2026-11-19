import { describe, expect, it } from "vitest";

import { isNoPrice, normalizePrices, parsePrice } from "./price";

describe("parsePrice", () => {
	it.each([
		["1,500", 1500],
		["1500.50", 1500.5],
		["RD$ 250", 250],
		["abc", null],
		["0", 0],
		["0.00", 0],
		["-5", null],
		["", null],
		["1,50", null],
		["12,345.6", 12345.6],
		["1,5000", null],
	])("%s -> %s", (input, out) => expect(parsePrice(input)).toBe(out));
});

describe("normalizePrices", () => {
	const arr = [{ label: "Grande", price: 10 }];
	it("deja pasar un arreglo", () => expect(normalizePrices(arr)).toEqual(arr));
	it("lee texto JSON", () => expect(normalizePrices(JSON.stringify(arr))).toEqual(arr));
	it("texto inválido -> []", () => expect(normalizePrices("no es json")).toEqual([]));
	it("undefined -> []", () => expect(normalizePrices(undefined)).toEqual([]));
});

describe("isNoPrice", () => {
	it("solo una fila totalmente vacía cuenta como sin precio", () => {
		expect(isNoPrice([{ label: "", price: "" }])).toBe(true);
		expect(isNoPrice([{ label: " ", price: " " }])).toBe(true);
		expect(isNoPrice([{ label: "Grande", price: "" }])).toBe(false);
		expect(isNoPrice([{ label: "", price: "0" }])).toBe(false);
		expect(isNoPrice([{ label: "", price: "" }, { label: "", price: "" }])).toBe(false);
	});
});
