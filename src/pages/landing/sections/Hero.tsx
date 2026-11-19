import { EXAMPLE_MENU_SLUG } from "@/constants/landing";
import { TRIAL_DAYS } from "@/constants/plans";

import { CtaLink, ctaClass } from "./CtaLink";
import { PhoneMenu } from "./mockups";

export function Hero() {
	return (
		<section className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 pt-10 pb-16 md:px-8 md:pt-12 md:pb-24 lg:grid-cols-2">
			<div className="flex flex-col items-start gap-5">
				<span className="-rotate-3 rounded-full bg-platano px-3.5 py-1.5 text-sm font-bold text-primary">
					Hecho en RD
				</span>
				<h1 className="font-display text-4xl font-extrabold tracking-tight text-balance md:text-6xl">
					Tu menú en el celular de cada cliente, con un solo QR.
				</h1>
				<p className="max-w-xl text-lg text-cacao-2">
					Crea tu menú digital en minutos, cámbialo cuando quieras y deja de pagar imprenta cada vez que sube un
					precio.
				</p>
				<div className="flex flex-wrap gap-3">
					<CtaLink to="/register">Crea tu menú gratis</CtaLink>
					<a
						href={`/m/${EXAMPLE_MENU_SLUG}`}
						target="_blank"
						rel="noopener noreferrer"
						className={ctaClass.outline}
					>
						Ver menú de ejemplo
					</a>
				</div>
				<span className="text-sm text-cacao-2">{TRIAL_DAYS} días gratis · sin tarjeta · listo en 10 minutos</span>
			</div>
			<div className="flex justify-center rounded-[32px] bg-platano/40 p-8">
				<PhoneMenu />
			</div>
		</section>
	);
}
