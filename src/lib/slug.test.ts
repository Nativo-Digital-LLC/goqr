import { describe, expect, it } from "vitest";

import { isValidSlug, slugify } from "./slug";

describe("slugify", () => {
	it("normaliza mayúsculas y espacios", () => expect(slugify("La Roca Restaurant")).toBe("la-roca-restaurant"));
	it("quita acentos, ñ y símbolos", () => expect(slugify("  Café Ñoño!! ")).toBe("cafe-nono"));
	it("limita a 40 caracteres", () => expect(slugify("a".repeat(60)).length).toBe(40));
	it("no deja guion al final tras recortar", () => expect(slugify("a".repeat(39) + " b")).toBe("a".repeat(39)));
});

describe("isValidSlug", () => {
	it.each([
		["la-roca", true],
		["La-Roca", false],
		["la--roca", false],
		["ab", false],
		["-la-roca", false],
		["a".repeat(41), false],
	])("%s -> %s", (s, ok) => expect(isValidSlug(s)).toBe(ok));
});
