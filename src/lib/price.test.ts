import { describe, expect, it } from "vitest";

import { parsePrice } from "./price";

describe("parsePrice", () => {
	it.each([
		["1,500", 1500],
		["1500.50", 1500.5],
		["RD$ 250", 250],
		["abc", null],
		["0", null],
		["", null],
	])("%s -> %s", (input, out) => expect(parsePrice(input)).toBe(out));
});
