import { describe, expect, it } from "vitest";

import { menuUrl, qrSrc } from "./qr";

describe("qr", () => {
	it("arma la URL del menú", () => expect(menuUrl("la-roca")).toBe("https://goqr.com.do/m/la-roca"));
	it("marca el origen QR", () => expect(qrSrc("la-roca")).toBe("https://goqr.com.do/m/la-roca?src=qr"));
});
