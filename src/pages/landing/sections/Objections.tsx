import { BarChart3, DollarSign, Languages, Palette, Smartphone } from "lucide-react";

import { CtaLink } from "./CtaLink";

const ITEMS = [
	{
		icon: DollarSign,
		title: "¿Y si suben los precios?",
		text: "Cambias el precio en el panel y se ve al instante en todas las mesas. Sin reimprimir, sin tachones.",
	},
	{
		icon: Palette,
		title: "¿Se va a ver como mi restaurante?",
		text: "Tu logo, tu banner, tu color y tus fotos. GoQR casi ni se nota.",
	},
	{
		icon: Languages,
		title: "¿Y los turistas?",
		text: "Activa el menú en inglés y tus clientes cambian de idioma con un toque.",
	},
	{
		icon: BarChart3,
		title: "¿Sirve para algo más que mostrar precios?",
		text: "Ves cuántas personas abren tu menú, a qué hora y qué platos miran más. Y te llega un resumen por correo cada semana.",
	},
	{
		icon: Smartphone,
		title: "¿Mis clientes tienen que bajar algo?",
		text: "No. Escanean con la cámara y el menú abre en el navegador, en Android o iPhone.",
	},
];

export function Objections() {
	return (
		<section className="bg-primary text-crema">
			<div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
				<h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight md:text-4xl">
					Lo que te preguntas antes de cambiar el menú de papel.
				</h2>
				<div className="grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
					{ITEMS.map(({ icon: Icon, title, text }) => (
						<div key={title} className="flex flex-col gap-2">
							<Icon className="size-7 text-platano" aria-hidden="true" />
							<h3 className="font-display text-xl font-bold">{title}</h3>
							<p className="text-crema/85">{text}</p>
						</div>
					))}
					<div className="flex flex-col items-start justify-center gap-4">
						<h3 className="font-display text-xl font-bold">Pruébalo 30 días con tu menú real.</h3>
						<CtaLink to="/register" variant="platano">
							Crea tu menú gratis
						</CtaLink>
					</div>
				</div>
			</div>
		</section>
	);
}
