import { EXAMPLE_MENU_SLUG } from "@/constants/landing";
import { PLANS, TRIAL_DAYS } from "@/constants/plans";

import { CtaLink } from "./CtaLink";
import { ctaClass } from "./ctaClass";
import { PhoneMenu } from "./mockups";

const monthly = PLANS.find((p) => p.id === "monthly")!;

// Primera pantalla: qué es (h1), el beneficio (bajada) y cuánto cuesta (junto al CTA).
// Todo el bloque de texto cabe en 800px de alto, con el header incluido.
export function Hero() {
	return (
		<section className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 pt-6 pb-16 md:px-8 md:pt-10 md:pb-24 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
			<div className="flex flex-col items-start gap-5">
				<span className="-rotate-3 rounded-full bg-platano px-3.5 py-1.5 text-sm font-bold text-primary">
					Hecho en RD
				</span>
				<h1 className="font-display text-[1.75rem] leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl md:text-5xl">
					Tu menú en cada celular, con un solo QR.
				</h1>
				<p className="max-w-xl text-lg text-cacao-2">
					Créalo en minutos, cambia platos y precios al instante y deja de pagar imprenta.
				</p>
				<p className="flex flex-wrap items-baseline gap-x-2 text-cacao-2">
					<span className="font-display text-3xl font-extrabold text-primary">
						RD${monthly.priceDop.toLocaleString("en-US")}
					</span>
					<span>al mes ·</span>
					<strong className="font-semibold text-primary">{TRIAL_DAYS} días gratis, sin tarjeta</strong>
				</p>
				<div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
					<CtaLink to="/register" className="w-full md:w-auto">Crea tu menú gratis</CtaLink>
					<a
						href={`/m/${EXAMPLE_MENU_SLUG}`}
						target="_blank"
						rel="noopener noreferrer"
						className={`${ctaClass.outline} w-full md:w-auto`}
					>
						Ver menú de ejemplo
					</a>
				</div>
			</div>
			<div className="flex justify-center">
				<PhoneMenu />
			</div>
		</section>
	);
}
