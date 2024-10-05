import {
	Benefits1,
	Benefits2,
	Benefits3,
	Benefits4,
} from "../../../constants/LandingImages";

import { BenefitCardProps } from "../types/Benefit";

const benefits: BenefitCardProps[] = [
	{
		title: "Enhancing Customer Experience",
		description: [
			"Working with digital menu is easier. Loading of the menu is faster. There is more useful information in digital menu.",
		],
		image: Benefits1,
		alt: "QR code menu, enhancing customer experience",
	},
	{
		title: "Attracting new customers",
		description: [
			"Guests are able to leave their reviews directly from the QR code menu. The more reviews - the more new guests are coming from reviews.",
			"Convenient menu language switch - more guests-foreigners.",
		],
		image: Benefits2,
		alt: "QR code menu, attracting new customers",
	},
	{
		title: "QR code menu increases sales",
		description: [
			"Digital QR code menu sells more. Photos increases the appetite - the appetite increases the average check.",
			"Making an order becomes easier. Less time to wonder, more spontaneous purchases - higher average check.",
		],
		image: Benefits3,
		alt: "QR code menu, increases sales",
	},
	{
		title: "Saving business resources",
		description: [
			"Our QR code menu is easy to edit. Higher relevance of the menu, less time and money spent on updating the menu.",
			"Our QR menu works right away. No need to install applications, buy terminals, wait for confirmation etc.",
		],
		image: Benefits4,
		alt: "QR code menu, enhancing customer experience",
	},
];

export default benefits;
