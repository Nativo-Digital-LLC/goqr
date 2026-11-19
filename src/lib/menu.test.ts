import { describe, expect, it } from "vitest";
import {
	descriptionLines, formatDays, formatPrice, isVisibleProduct, localized, menuColor,
	openStatus, parseDays, parseHours, socialHref, whatsappHref,
} from "./menu";
import { readableOn } from "./color";
import { ProductStatus } from "../types/Product";

// 2026-11-18 es miércoles
const wed = (h: number, m = 0) => new Date(2026, 10, 18, h, m);
const sat = (h: number, m = 0) => new Date(2026, 10, 21, h, m);
const weekdays = { days: "Lunes, Martes, Miércoles, Jueves, Viernes", hours: "8:00 AM - 10:00 PM" };

describe("menu", () => {
	it("localized cae a español", () => {
		expect(localized({ es_name: "Pollo", en_name: "" }, "name", "en")).toBe("Pollo");
		expect(localized({ es_name: "Pollo", en_name: "Chicken" }, "name", "en")).toBe("Chicken");
		expect(localized({ es_name: "Pollo", en_name: "Chicken" }, "name", "es")).toBe("Pollo");
		expect(localized({}, "description", "en")).toBe("");
	});
	it("formatPrice", () => {
		expect(formatPrice(0, "es")).toBe("Gratis");
		expect(formatPrice(0, "en")).toBe("Free");
		expect(formatPrice(1500, "es")).toBe("$1,500");
		expect(formatPrice(95.5, "es")).toBe("$95.50");
	});
	it("isVisibleProduct", () => {
		expect(isVisibleProduct({ status: ProductStatus.Hidden, deletedAt: null })).toBe(false);
		expect(isVisibleProduct({ status: ProductStatus.NotAvailable, deletedAt: null })).toBe(true);
		expect(isVisibleProduct({ status: ProductStatus.Visible, deletedAt: {} as never })).toBe(false);
	});
	it("parseDays / parseHours", () => {
		expect(parseDays("Lunes, Miércoles, domingo")).toEqual([0, 2, 6]);
		expect(parseDays("Miercoles")).toEqual([2]);
		expect(parseDays("Foo")).toEqual([]);
		expect(parseHours("8:00 AM - 10:00 PM")).toEqual({ open: 480, close: 1320 });
		expect(parseHours("08:00 AM - 10:00 PM")).toEqual({ open: 480, close: 1320 });
		expect(parseHours("todo el día")).toBeNull();
		expect(parseHours("12:00 AM - 12:30 PM")).toEqual({ open: 0, close: 750 });
	});
	it("openStatus", () => {
		expect(openStatus([weekdays], wed(21))).toEqual({ open: true, until: "10:00 PM" });
		expect(openStatus([weekdays], wed(23))).toEqual({ open: false, until: "8:00 AM" });
		expect(openStatus([weekdays], sat(12))).toEqual({ open: false, until: "8:00 AM" });
		expect(openStatus([weekdays], wed(7))).toEqual({ open: false, until: "8:00 AM" });
	});
	it("openStatus cruza la medianoche", () => {
		const fri = [{ days: "Viernes", hours: "8:00 PM - 2:00 AM" }];
		expect(openStatus(fri, sat(1))).toEqual({ open: true, until: "2:00 AM" });
		expect(openStatus(fri, sat(3))?.open).toBe(false);
		// domingo noche termina el lunes
		const sun = [{ days: "Domingo", hours: "10:00 PM - 1:00 AM" }];
		expect(openStatus(sun, new Date(2026, 10, 23, 0, 30))).toEqual({ open: true, until: "1:00 AM" });
	});
	it("openStatus con varias filas el mismo día", () => {
		const rows = [{ days: "Miércoles", hours: "8:00 AM - 11:00 AM" }, { days: "Miércoles", hours: "6:00 PM - 10:00 PM" }];
		expect(openStatus(rows, wed(19))).toEqual({ open: true, until: "10:00 PM" });
		expect(openStatus(rows, wed(14))).toEqual({ open: false, until: "6:00 PM" });
	});
	it("openStatus sin datos legibles", () => {
		expect(openStatus(undefined, wed(12))).toBeNull();
		expect(openStatus([{ days: "Lunes", hours: "cerrado" }], wed(12))).toBeNull();
	});
	it("formatDays", () => {
		expect(formatDays("Lunes, Martes, Miércoles", "en")).toBe("Monday to Wednesday");
		expect(formatDays("Lunes, Martes, Miércoles", "es")).toBe("Lunes a Miércoles");
		expect(formatDays("Lunes, Miércoles", "es")).toBe("Lunes, Miércoles");
	});
	it("menuColor", () => {
		expect(menuColor("#FFC53D", true)).toBe("#FFC53D");
		expect(menuColor("#FFC53D")).toBe(readableOn("#FFC53D").text);
	});
	it("enlaces", () => {
		expect(whatsappHref("(809) 555-1234")).toBe("https://wa.me/18095551234");
		expect(whatsappHref("+1 809 555 1234")).toBe("https://wa.me/18095551234");
		expect(socialHref({ platform: "instagram", link: "" })).toBeNull();
		expect(socialHref({ platform: "instagram", link: "@goqr" })).toBe("https://instagram.com/goqr");
		expect(socialHref({ platform: "website", link: "goqr.com.do" })).toBe("https://goqr.com.do");
	});
	it("descriptionLines", () => {
		expect(descriptionLines("Hola\n*Abierto los lunes*")).toEqual([
			{ text: "Hola", bold: false },
			{ text: "Abierto los lunes", bold: true },
		]);
	});
});
