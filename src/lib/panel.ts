import type { EstablishmentProps } from "../types/Establishment";
import type { ProductProps } from "../types/Product";

const DAY_MS = 86_400_000;

export function trialDaysLeft(trialEndsAt: { toDate(): Date } | Date | undefined | null, now: Date): number | null {
	if (!trialEndsAt) return null;
	const end = trialEndsAt instanceof Date ? trialEndsAt : trialEndsAt.toDate();
	return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / DAY_MS));
}

export function setupChecklist(e: EstablishmentProps, productCount: number) {
	const flag = (k: string) => localStorage.getItem(`goqr:${k}:${e.id}`) === "1";
	return {
		brand: !!e.logoUrl && !!e.bannerUrl,
		products: productCount >= 5,
		qr: flag("qr-downloaded"),
		share: flag("link-copied"),
	};
}

export const untranslatedCount = (products: Pick<ProductProps, "en_name">[]): number =>
	products.filter((p) => !p.en_name).length;

export function moveItem<T>(items: T[], index: number, delta: -1 | 1): T[] {
	const to = index + delta;
	if (index < 0 || index >= items.length || to < 0 || to >= items.length) return items;
	const copy = [...items];
	[copy[index], copy[to]] = [copy[to], copy[index]];
	return copy;
}

export const ordersAfterMove = <T extends { id: string }>(items: T[]): { id: string; order: number }[] =>
	items.map((it, i) => ({ id: it.id, order: i + 1 }));
