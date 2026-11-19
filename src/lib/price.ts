/** Precio escrito por el dueño (coma de miles, punto decimal, "RD$" opcional) a número (0 vale: se muestra "Gratis"); null si está vacío, no es válido o es negativo. */
export function parsePrice(input: string): number | null {
	const trimmed = input.replace(/RD\$|\$|\s/gi, "");
	// La coma solo vale como separador de miles bien agrupado: "1,50" no es 1.50 ni 150.
	if (trimmed.includes(",") && !/^\d{1,3}(,\d{3})+(\.\d+)?$/.test(trimmed)) return null;
	const clean = trimmed.replace(/,/g, "");
	if (!/^\d+(\.\d{1,2})?$/.test(clean)) return null;
	const n = Number(clean);
	return n;
}

/** Precios guardados como arreglo o, en datos viejos, como texto JSON; cualquier otra cosa da []. */
export function normalizePrices(raw: unknown): { label?: string; price: number }[] {
	let v = raw;
	if (typeof v === "string") {
		try { v = JSON.parse(v); } catch { return []; }
	}
	return Array.isArray(v) ? v : [];
}

/** Una sola fila vacía (sin etiqueta ni precio) es un producto "sin precio" (datos viejos): se guarda `prices: []`. */
export const isNoPrice = (rows: { label: string; price: string }[]) =>
	rows.length === 1 && !rows[0].label.trim() && !rows[0].price.trim();
