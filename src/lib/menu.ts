import { readableOn } from "./color";
import type { Lang } from "../types/Dictionary";
import type { ScheduleProps, SocialNetworkProps } from "../types/Establishment";
import { ProductStatus, type ProductProps } from "../types/Product";

export function localized(doc: Record<string, unknown>, field: "name" | "description", lang: Lang): string {
	const en = doc[`en_${field}`];
	const es = doc[`es_${field}`];
	if (lang === "en" && typeof en === "string" && en.trim()) return en;
	return typeof es === "string" ? es : "";
}

export function formatPrice(price: number, lang: Lang): string {
	if (price === 0) return lang === "en" ? "Free" : "Gratis";
	const decimals = Number.isInteger(price) ? 0 : 2;
	return "$" + price.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function isVisibleProduct(p: Pick<ProductProps, "status" | "deletedAt">): boolean {
	return p.status !== ProductStatus.Hidden && p.deletedAt == null;
}

const DAYS = {
	es: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
	en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

const normalize = (s: string) =>
	s.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();

const DAY_KEYS = DAYS.es.map(normalize);

export function parseDays(days: string): number[] {
	return (days ?? "")
		.split(",")
		.map((d) => DAY_KEYS.indexOf(normalize(d)))
		.filter((i) => i >= 0);
}

function parseTime(t: string): number | null {
	const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t.trim());
	if (!m) return null;
	const h = Number(m[1]);
	const min = Number(m[2]);
	if (h < 1 || h > 12 || min > 59) return null;
	return ((h % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + min;
}

export function parseHours(hours: string): { open: number; close: number } | null {
	const parts = (hours ?? "").split(" - ");
	if (parts.length !== 2) return null;
	const [open, close] = parts.map(parseTime);
	return open == null || close == null ? null : { open, close };
}

const DAY = 1440;
const WEEK = 7 * DAY;

export function openStatus(
	schedules: ScheduleProps[] | undefined,
	now: Date
): { open: boolean; until: string } | null {
	// Cada rango: minutos desde el lunes 00:00; si cruza la medianoche, end pasa de ese día.
	const ranges: { start: number; end: number; openLabel: string; closeLabel: string }[] = [];
	for (const s of schedules ?? []) {
		const h = parseHours(s.hours);
		if (!h) continue;
		const [openLabel, closeLabel] = s.hours.split(" - ").map((x) => x.trim());
		for (const d of parseDays(s.days)) {
			const start = d * DAY + h.open;
			const end = d * DAY + (h.close <= h.open ? h.close + DAY : h.close);
			ranges.push({ start, end, openLabel, closeLabel });
		}
	}
	if (!ranges.length) return null;

	const t = ((now.getDay() + 6) % 7) * DAY + now.getHours() * 60 + now.getMinutes();
	// La semana es circular: se copian los rangos una semana antes y después.
	const all = [-WEEK, 0, WEEK].flatMap((k) => ranges.map((r) => ({ ...r, start: r.start + k, end: r.end + k })));
	let current = all.find((r) => t >= r.start && t < r.end);
	if (current) {
		// Encadena rangos que se solapan o se tocan hasta el final del período abierto continuo.
		for (let next = current; next; ) {
			current = next;
			next = all.find((r) => r.start <= current!.end && r.end > current!.end) as typeof current;
		}
		return { open: true, until: current.closeLabel };
	}

	const next = ranges.reduce((best, r) => {
		const wait = (r.start - t + WEEK) % WEEK;
		return wait < best.wait ? { wait, label: r.openLabel } : best;
	}, { wait: Infinity, label: "" });
	return { open: false, until: next.label };
}

export function dayLabel(index: number, lang: Lang): string {
	return DAYS[lang][index] ?? "";
}

export function formatDays(days: string, lang: Lang): string {
	const idx = parseDays(days);
	if (!idx.length) return days ?? "";
	const sorted = [...new Set(idx)].sort((a, b) => a - b);
	if (sorted.length > 1 && sorted.every((v, i) => i === 0 || v === sorted[i - 1] + 1)) {
		return `${dayLabel(sorted[0], lang)} ${lang === "en" ? "to" : "a"} ${dayLabel(sorted[sorted.length - 1], lang)}`;
	}
	return idx.map((i) => dayLabel(i, lang)).join(", ");
}

export function menuColor(mainHexColor: string | undefined, exactColor?: boolean): string {
	const hex = mainHexColor?.trim() ? mainHexColor : "#C2381F";
	return exactColor ? hex : readableOn(hex).text;
}

export function whatsappHref(number: string): string {
	const digits = (number ?? "").replace(/\D/g, "");
	return "https://wa.me/" + (digits.length === 10 ? "1" : "") + digits;
}

export const telHref = (number: string): string => "tel:" + number;

export const reviewHref = (placeId: string): string =>
	"https://search.google.com/local/writereview?placeid=" + placeId;

export const mapsEmbedSrc = (address: string): string =>
	`https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

export function socialHref(s: SocialNetworkProps): string | null {
	const link = s.link?.trim();
	if (!link) return null;
	if (s.platform === "website") return link.startsWith("http") ? link : `https://${link}`;
	if (link.startsWith("http")) return link;
	const clean = link.replace("@", "");
	switch (s.platform) {
		case "instagram": return `https://instagram.com/${clean}`;
		case "facebook": return `https://facebook.com/${clean}`;
		case "tiktok": return `https://tiktok.com/@${clean}`;
		case "x": return `https://x.com/${clean}`;
		default: return `https://${clean}`;
	}
}

export function descriptionLines(text: string): { text: string; bold: boolean }[] {
	return (text ?? "").split("\n").map((line) =>
		line.startsWith("*") ? { text: line.replace(/^\*+|\*+$/g, ""), bold: true } : { text: line, bold: false }
	);
}
