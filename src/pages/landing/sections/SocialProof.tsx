import { CLIENT_LOGOS, TESTIMONIAL } from "@/constants/landing";

export function SocialProof() {
	if (CLIENT_LOGOS.length === 0 && !TESTIMONIAL) return null;

	return (
		<section aria-label="Clientes" className="border-y border-line bg-white/50">
			<div className="mx-auto grid max-w-[1200px] items-center gap-8 px-5 py-10 md:px-8 lg:grid-cols-2">
				{CLIENT_LOGOS.length > 0 && (
					<div className="flex flex-col gap-4">
						<span className="text-sm font-semibold text-cacao-2">
							Ya lo usan restaurantes en República Dominicana
						</span>
						<div className="flex flex-wrap items-center gap-6">
							{CLIENT_LOGOS.map((l) => (
								<img key={l.name} src={l.src} alt={l.name} className="h-10 w-auto" />
							))}
						</div>
					</div>
				)}
				{TESTIMONIAL && (
					<figure className="flex flex-col gap-2">
						<blockquote className="font-display text-xl font-bold">"{TESTIMONIAL.quote}"</blockquote>
						<figcaption className="text-sm text-cacao-2">
							{TESTIMONIAL.author}, {TESTIMONIAL.role} · {TESTIMONIAL.restaurant}
						</figcaption>
					</figure>
				)}
			</div>
		</section>
	);
}
