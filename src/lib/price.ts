/** Precio escrito por el dueño (coma de miles, punto decimal, "RD$" opcional) a número; null si no es válido o no es mayor que 0. */
export function parsePrice(input: string): number | null {
	const trimmed = input.replace(/RD\$|\$|\s/gi, "");
	// La coma solo vale como separador de miles bien agrupado: "1,50" no es 1.50 ni 150.
	if (trimmed.includes(",") && !/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(trimmed)) return null;
	const clean = trimmed.replace(/,/g, "");
	if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
	const n = Number(clean);
	return n > 0 ? n : null;
}
