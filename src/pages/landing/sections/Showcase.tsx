import { ExternalLink } from "lucide-react";

// Menús públicos reales hechos con GoQR; las capturas viven en public/showcase/ (780px de ancho).
const REAL_MENUS = [
	{ name: "Grey Café", slug: "greycafe", image: "/showcase/greycafe.webp", height: 1688 },
	{ name: "La Roca Restaurant", slug: "la-roca-restaurant", image: "/showcase/la-roca.webp", height: 1400 },
	{ name: "El Catador", slug: "el-catador", image: "/showcase/el-catador.webp", height: 1400 },
];

export function Showcase() {
	return (
		<section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 py-16 md:px-8 md:py-24">
			<div className="flex max-w-2xl flex-col gap-3">
				<h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
					Menús reales, hechos con GoQR
				</h2>
				<p className="text-cacao-2">Entra a uno y verás exactamente lo que ven tus clientes.</p>
			</div>
			<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{REAL_MENUS.map((m) => (
					<li key={m.slug}>
						<a
							href={`/m/${m.slug}`}
							target="_blank"
							rel="noopener noreferrer"
							className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-xl focus-visible:shadow-xl"
						>
							<div className="aspect-[4/5] overflow-hidden bg-crema">
								<img
									src={m.image}
									width={780}
									height={m.height}
									loading="lazy"
									decoding="async"
									alt={`Captura del menú digital de ${m.name}`}
									className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
								/>
							</div>
							<div className="flex items-center justify-between gap-3 p-4">
								<strong className="font-display text-lg">{m.name}</strong>
								<span className="flex items-center gap-1.5 text-sm font-semibold text-brand">
									Ver menú
									<ExternalLink className="size-4" aria-hidden="true" />
									<span className="sr-only">(se abre en una pestaña nueva)</span>
								</span>
							</div>
						</a>
					</li>
				))}
			</ul>
		</section>
	);
}
