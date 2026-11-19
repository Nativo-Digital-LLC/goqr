export function passwordChecks(pw: string) {
	return {
		minLength: pw.length >= 8,
		upperAndNumber: /[A-Z]/.test(pw) && /\d/.test(pw),
		symbol: /[^A-Za-z0-9]/.test(pw),
	};
}

export function passwordStrength(pw: string): "weak" | "ok" | "strong" {
	const { minLength, upperAndNumber, symbol } = passwordChecks(pw);
	if (!minLength || !upperAndNumber) return "weak";
	return symbol ? "strong" : "ok";
}
