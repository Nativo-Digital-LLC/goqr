import { PriceCardProps } from "../types/Prices";

const prices: PriceCardProps[] = [
	{
		title: "Si pagas 1 mes",
		price: "300",
		disclaimer: "Facturado cada mes",
		total: 300,
		selected: false,
	},
	{
		title: "Si pagas 1 año",
		price: "210",
		disclaimer: "Facturado cada 12 meses",
		total: 2520,
		selected: true,
	},
	{
		title: "Si pagas de por vida",
		price: "11K",
		disclaimer: "Un único cargo",
		total: 11000,
		selected: false,
	},
];

export default prices;
