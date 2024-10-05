import { PriceCardProps } from "../types/Prices";

const prices: PriceCardProps[] = [
	{
		title: "If paid monthly",
		price: 10,
		disclaimer: "Charged every month",
		total: 10,
		selected: false,
	},
	{
		title: "If paid every 6 months",
		price: 9.6,
		disclaimer: "Charged every 6 months",
		total: 57.6,
		selected: true,
	},
	{
		title: "If paid annually",
		price: 9,
		disclaimer: "Charged every 12 months",
		total: 108,
		selected: false,
	},
];

export default prices;
