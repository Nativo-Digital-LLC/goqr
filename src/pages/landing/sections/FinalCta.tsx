import { TRIAL_DAYS } from "@/constants/plans";

import { CtaLink } from "./CtaLink";

export function FinalCta() {
	return (
		<section className="px-5 pb-16 md:px-8 md:pb-24">
			<div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 rounded-3xl bg-brand p-8 text-white md:flex-row md:items-center md:p-12">
				<div className="flex flex-col gap-2">
					<h2 className="font-display text-3xl font-extrabold tracking-tight">
						Tu menú nuevo puede estar en las mesas mañana.
					</h2>
					<span>{TRIAL_DAYS} días gratis · sin tarjeta · listo en 10 minutos</span>
				</div>
				<CtaLink to="/register" variant="platano" className="shrink-0">
					Crea tu menú gratis
				</CtaLink>
			</div>
		</section>
	);
}
