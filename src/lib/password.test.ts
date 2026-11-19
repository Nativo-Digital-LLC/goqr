import { describe, expect, it } from "vitest";

import { passwordStrength } from "./password";

describe("passwordStrength", () => {
	it.each([
		["", "weak"],
		["abcdefgh", "weak"],
		["Abcdefg1", "ok"],
		["Abcdefg1!", "strong"],
		["Ab1!", "weak"],
	])("%j → %s", (pw, expected) => {
		expect(passwordStrength(pw)).toBe(expected);
	});
});
