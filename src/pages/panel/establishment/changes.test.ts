import { describe, expect, it } from "vitest";

import type { EstablishmentProps } from "@/types/Establishment";
import { changedFields, toChangeValues, type ChangeValues } from "./changes";

const original = {
	id: "e1",
	userId: "u1",
	isActive: true,
	billing: { status: "active" },
	name: "La Roca",
	domain: "la-roca",
	description: "Parrilla",
	address: "Calle 1",
	addressLink: null,
	phone: "809-555-1234",
	whatsapp: null,
	rnc: null,
	companyName: null,
	mainHexColor: "#C2381F",
	requiresTaxReceipt: false,
	enableMultiLanguage: false,
	showFoodAllergyAndRiskDisclaimer: false,
	socialNetworks: [{ platform: "instagram", link: "@laroca" }],
} as unknown as EstablishmentProps;

const same: ChangeValues = {
	name: "La Roca",
	domain: "la-roca",
	description: "Parrilla",
	address: "Calle 1",
	addressLink: "",
	phone: "809-555-1234",
	whatsapp: "",
	rnc: "",
	companyName: "",
	mainHexColor: "#c2381f",
	exactColor: false,
	enableMultiLanguage: false,
	showFoodAllergyAndRiskDisclaimer: false,
	requiresTaxReceipt: false,
	schedules: [],
	socialNetworks: [{ platform: "instagram", link: "@laroca" }],
};

describe("changedFields", () => {
	it("sin cambios devuelve vacío (null y vacío son lo mismo, el color no distingue mayúsculas)", () => {
		expect(changedFields(original, same)).toEqual({});
	});

	it("solo incluye lo que cambió", () => {
		expect(changedFields(original, { ...same, name: "La Roca 2" })).toEqual({ name: "La Roca 2" });
		expect(changedFields(original, { ...same, phone: "" })).toEqual({ phone: null });
		expect(changedFields(original, { ...same, socialNetworks: [] })).toEqual({ socialNetworks: [] });
	});

	it("nunca incluye billing, isActive ni userId", () => {
		const extra = { ...same, name: "X", billing: { status: "canceled" }, isActive: false, userId: "otro" };
		expect(Object.keys(changedFields(original, extra))).toEqual(["name"]);
	});
});

describe("toChangeValues", () => {
	const legacy = { ...original, socialNetworks: [{ platform: "Instagram", link: "@name " }] } as unknown as EstablishmentProps;
	const form = {
		...same,
		week: Array.from({ length: 7 }, () => ({ open: false, from: "8:00 AM", to: "10:00 PM" })),
		social: [{ platform: "Instagram", link: "@name " }],
	};

	it("redes viejas sin tocar no entran al payload", () => {
		expect(changedFields(legacy, toChangeValues(form, legacy))).not.toHaveProperty("socialNetworks");
	});

	it("si se editan, se normalizan", () => {
		const edited = { ...form, social: [{ platform: "Instagram", link: "@name2 " }, { platform: "x", link: " " }] };
		expect(changedFields(legacy, toChangeValues(edited, legacy)).socialNetworks).toEqual([{ platform: "instagram", link: "@name2" }]);
	});
});
