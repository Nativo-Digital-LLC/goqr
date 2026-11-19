import { describe, expect, it } from "vitest";

import { isScannableColor } from "./qrRender";

describe("isScannableColor", () => {
	it("acepta colores oscuros", () => expect(isScannableColor("#2A1410")).toBe(true));
	it("rechaza colores claros", () => expect(isScannableColor("#FFC53D")).toBe(false));
});
