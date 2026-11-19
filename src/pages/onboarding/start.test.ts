import { describe, expect, it } from "vitest";

import type { EstablishmentProps } from "@/types/Establishment";
import { pickStart } from "./start";

const est = (onboardingStep?: number) => ({ id: "a", onboardingStep }) as EstablishmentProps;

describe("pickStart", () => {
	it("sin establecimientos empieza en el paso 1", () => {
		expect(pickStart([], false)).toMatchObject({ establishment: null, step: 1, finished: false });
	});
	it("retoma el paso guardado", () => {
		expect(pickStart([est(3)], false)).toMatchObject({ step: 3, finished: false });
	});
	it("terminado o legado redirige al panel", () => {
		expect(pickStart([est(4)], false).finished).toBe(true);
		expect(pickStart([est()], false).finished).toBe(true);
	});
	it("con new=1 e id propio en curso lo retoma", () => {
		expect(pickStart([est(3)], true, "a")).toMatchObject({ establishment: { id: "a" }, step: 3, finished: false });
	});
	it("con new=1 un id ajeno, desconocido o terminado empieza de cero", () => {
		const fresh = { establishment: null, step: 1, finished: false };
		expect(pickStart([est(2)], true, "otro")).toEqual(fresh);
		expect(pickStart([], true, "a")).toEqual(fresh);
		expect(pickStart([est(4)], true, "a")).toEqual(fresh);
		expect(pickStart([est()], true, "a")).toEqual(fresh);
	});
	it("con new=1 ignora los existentes", () => {
		for (const e of [est(4), est(), est(2)]) {
			expect(pickStart([e], true)).toEqual({ establishment: null, step: 1, finished: false });
		}
	});
});
