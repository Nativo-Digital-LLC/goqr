/** Precio escrito por el dueño (coma de miles, punto decimal, "RD$" opcional) a número; null si no es válido o no es mayor que 0. */
export function parsePrice(input: string): number | null {
	const clean = input.replace(/RD\$|\$|,|\s/gi, "");
	if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
	const n = Number(clean);
	return n > 0 ? n : null;
}
