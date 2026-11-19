import { Building2, CreditCard } from "lucide-react";

import { PLANS, TRIAL_DAYS, type Plan } from "@/constants/plans";
import { cn } from "@/lib/utils";

import { CtaLink } from "./CtaLink";

const money = (n: number) => `RD$${n.toLocaleString("en-US")}`;

function PlanCard({ plan }: { plan: Plan }) {
	const highlighted = !!plan.badge;
	return (
		<div
			className={cn(
				"relative flex flex-col gap-3 rounded-2xl border bg-white p-7",
				highlighted ? "border-2 border-primary" : "border-line"
			)}
		>
			{plan.badge && (
				<span className="absolute -top-3.5 left-8 rounded-full bg-platano px-3 py-1.5 text-sm font-bold text-primary">
					{plan.badge}
				</span>
			)}
			<h3 className="font-display text-xl font-bold">{plan.name}</h3>
			<div className="flex items-baseline gap-1">
				<span className="font-display text-4xl font-extrabold">
					{money(plan.id === "lifetime" ? plan.priceDop : plan.perMonthDop)}
				</span>
				{plan.id !== "lifetime" && <span className="text-cacao-2">/mes</span>}
			</div>
			<span className="text-sm text-cacao-2">{plan.note}</span>
			<CtaLink
				to={`/register?plan=${plan.id}`}
				variant={highlighted ? "primary" : "outline"}
				className="mt-auto"
				onClick={() => sessionStorage.setItem("goqr:plan", plan.id)}
			>
				Empezar gratis
			</CtaLink>
		</div>
	);
}

export function Pricing() {
	return (
		<section id="precios" className="scroll-mt-20 px-5 py-16 md:px-8 md:py-24">
			<div className="mx-auto flex max-w-[1200px] flex-col gap-10">
				<div className="flex flex-col gap-3">
					<span className="text-sm font-bold text-brand">Precios</span>
					<h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
						Menos que una impresión de menús.
					</h2>
					<p className="text-cacao-2">Empieza con {TRIAL_DAYS} días gratis. Sin tarjeta. ITBIS incluido.</p>
				</div>
				<div className="grid gap-8 md:grid-cols-3">
					{PLANS.map((p) => (
						<PlanCard key={p.id} plan={p} />
					))}
				</div>
				<div className="flex flex-wrap gap-x-8 gap-y-3 text-sm">
					<span className="inline-flex items-center gap-2">
						<CreditCard className="size-[18px]" aria-hidden="true" />
						Tarjeta de crédito o débito (pago seguro con Stripe)
					</span>
					<span className="inline-flex items-center gap-2">
						<Building2 className="size-[18px]" aria-hidden="true" />
						Transferencia a cuenta en RD o EE. UU.
					</span>
					<span>Todos los planes incluyen todo.</span>
				</div>
			</div>
		</section>
	);
}
