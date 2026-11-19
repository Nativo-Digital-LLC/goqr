function rgb(hex: string): [number, number, number] {
	const h = hex.replace("#", "");
	const f = h.length === 3 ? h.replace(/./g, "$&$&") : h;
	return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
	const [r, g, b] = rgb(hex).map((v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG 2.1
export function contrastRatio(hexA: string, hexB: string): number {
	const [a, b] = [luminance(hexA), luminance(hexB)];
	return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function toHsl(hex: string): [number, number, number] {
	const [r, g, b] = rgb(hex).map((v) => v / 255);
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	const d = max - min;
	if (d === 0) return [0, 0, l];
	const s = d / (1 - Math.abs(2 * l - 1));
	const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
	return [(h * 60 + 360) % 360, s, l];
}

function fromHsl(h: number, s: number, l: number): string {
	const k = (n: number) => (n + h / 30) % 12;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
	return "#" + [f(0), f(8), f(4)].map((v) => Math.round(v * 255).toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function readableOn(hex: string, bg = "#FFFFFF"): { ok: boolean; text: string } {
	if (contrastRatio(hex, bg) >= 4.5) return { ok: true, text: hex.toUpperCase() };
	const [h, s, l0] = toHsl(hex);
	let text = hex.toUpperCase();
	for (let l = l0 - 0.02; l >= 0; l -= 0.02) {
		text = fromHsl(h, s, Math.max(l, 0));
		if (contrastRatio(text, bg) >= 4.5) break;
	}
	return { ok: false, text };
}
