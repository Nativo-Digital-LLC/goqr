export type PlanId = "monthly" | "annual" | "lifetime";

export type Plan = {
	id: PlanId;
	name: string;
	priceDop: number;
	priceUsd: number;
	perMonthDop: number;
	note: string;
	badge?: string;
};

// Precios de lista para clientes NUEVOS. Lo que paga un cliente existente sale de su billing.priceLock
// (ver effectivePrice en lib/billing); no mostrar ni cobrar estos montos a un cliente sin pasar por ahí.
export const PLANS: Plan[] = [
	{ id: "monthly", name: "Mensual", priceDop: 500, priceUsd: 5, perMonthDop: 500, note: "Cancela cuando quieras." },
	{
		id: "annual",
		name: "Anual",
		priceDop: 4800,
		priceUsd: 42,
		perMonthDop: 400,
		note: "RD$4,800 al año, en un solo pago.",
		badge: "Ahorras 20%",
	},
	{ id: "lifetime", name: "De por vida", priceDop: 11000, priceUsd: 185, perMonthDop: 0, note: "Un solo pago. Nunca más una factura." },
];

export const TRIAL_DAYS = 30;
