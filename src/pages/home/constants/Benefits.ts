import {
	Benefits1,
	// Benefits2,
	Benefits3,
	Benefits4,
} from "../../../constants/LandingImages";

import { BenefitCardProps } from "../types/Benefit";

const benefits: BenefitCardProps[] = [
	{
		title: "Mejorar la experiencia del cliente",
		description: [
			"Trabajar con menú digital es más fácil. La carga del menú es más rápida. Hay más información útil en el menú digital.",
		],
		image: Benefits1,
		alt: "QR code menu, enhancing customer experience",
	},
	// {
	// 	title: "Atraer nuevos clientes",
	// 	description: [
	// 		"Los huéspedes pueden dejar sus comentarios directamente desde el menú del código QR. Cuantas más reseñas, más huéspedes nuevos provienen de las reseñas.",
	// 		"Convenient menu language switch - more guests-foreigners.",
	// 	],
	// 	image: Benefits2,
	// 	alt: "QR code menu, attracting new customers",
	// },
	{
		title: "El menú con código QR aumenta las ventas",
		description: [
			"El menú con código QR digital vende más. Las fotos aumentan el apetito: el apetito aumenta el cheque promedio.",
			"Hacer un pedido se vuelve más fácil. Menos tiempo para preguntarse, más compras espontáneas y mayor cheque promedio.",
		],
		image: Benefits3,
		alt: "QR code menu, increases sales",
	},
	{
		title: "Ahorrar recursos",
		description: [
			"Nuestro menú de códigos QR es fácil de editar. Mayor relevancia del menú, menos tiempo y dinero gastado en actualizar el menú.",
			"Nuestro menú QR funciona de inmediato. No es necesario instalar aplicaciones, comprar terminales, esperar confirmación, etc.",
		],
		image: Benefits4,
		alt: "QR code menu, enhancing customer experience",
	},
];

export default benefits;
