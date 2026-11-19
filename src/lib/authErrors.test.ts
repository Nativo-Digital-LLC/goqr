import { describe, expect, it } from "vitest";

import { authErrorMessage } from "./authErrors";

const GENERIC = "Algo salió mal. Inténtalo de nuevo.";
const BAD_LOGIN = "Correo o contraseña incorrectos.";
const EXPIRED = "Este enlace venció o ya se usó. Pide uno nuevo.";

describe("authErrorMessage", () => {
	it.each([
		["auth/invalid-credential", BAD_LOGIN],
		["auth/wrong-password", BAD_LOGIN],
		["auth/user-not-found", "No hay una cuenta con ese correo."],
		["auth/email-already-in-use", "Ya hay una cuenta con ese correo. Ingresa o recupera tu contraseña."],
		["auth/weak-password", "La contraseña es muy débil."],
		["auth/too-many-requests", "Demasiados intentos. Espera unos minutos y vuelve a intentar."],
		["auth/expired-action-code", EXPIRED],
		["auth/invalid-action-code", EXPIRED],
		["auth/popup-closed-by-user", ""],
	])("%s", (code, message) => {
		expect(authErrorMessage({ code })).toBe(message);
	});

	it("trata un 401 de Appwrite como credenciales incorrectas", () => {
		expect(authErrorMessage({ isAxiosError: true, response: { status: 401 } })).toBe(BAD_LOGIN);
	});

	it("usa el mensaje genérico para el resto", () => {
		expect(authErrorMessage(new Error("x"))).toBe(GENERIC);
		expect(authErrorMessage(null)).toBe(GENERIC);
	});
});
