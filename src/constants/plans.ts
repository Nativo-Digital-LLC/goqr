export type PlanId = "monthly" | "annual" | "lifetime";

export type Plan = {
	id: PlanId;
	name: string;
	priceDop: number;
	perMonthDop: number;
	note: string;
	badge?: string;
};

export const PLANS: Plan[] = [
	{ id: "monthly", name: "Mensual", priceDop: 300, perMonthDop: 300, note: "Cancela cuando quieras." },
	{
		id: "annual",
		name: "Anual",
		priceDop: 2520,
		perMonthDop: 210,
		note: "RD$2,520 al año, en un solo pago.",
		badge: "Ahorras 30%",
	},
	{ id: "lifetime", name: "De por vida", priceDop: 11000, perMonthDop: 0, note: "Un solo pago. Nunca más una factura." },
];

export const TRIAL_DAYS = 30;
