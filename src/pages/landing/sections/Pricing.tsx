import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Building2, CreditCard } from "lucide-react";

import { PLANS, TRIAL_DAYS, type Plan } from "@/constants/plans";
import { cn } from "@/lib/utils";

import { CtaLink } from "./CtaLink";

const money = (n: number) => `RD$${n.toLocaleString("en-US")}`;

const savePlan = (id: string) => sessionStorage.setItem("goqr:plan", id);

// Fila compacta solo móvil: toda la fila es el enlace al registro con el plan.
function PlanRow({ plan }: { plan: Plan }) {
	const lifetime = plan.id === "lifetime";
	return (
		<Link
			to={`/register?plan=${plan.id}`}
			onClick={() => savePlan(plan.id)}
			className="flex min-h-11 items-baseline justify-between rounded-3xl border-2 border-line bg-white p-6 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:hidden"
		>
			<strong className="text-lg">{plan.name}</strong>
			<span>
				<span className="font-display text-3xl font-extrabold">
					{money(lifetime ? plan.priceDop : plan.perMonthDop)}
				</span>
				{!lifetime && " /mes"}
			</span>
		</Link>
	);
}

function PlanCard({ plan }: { plan: Plan }) {
	const highlighted = !!plan.badge;
	return (
		<div
			className={cn(
				"relative flex-col gap-3 rounded-2xl border bg-white p-7",
				highlighted ? "flex" : "hidden md:flex",
				highlighted ? "border-2 border-primary max-md:order-first max-md:border-brand max-md:bg-brand max-md:text-white" : "border-line"
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
				{plan.id !== "lifetime" && <span className={cn("text-cacao-2", highlighted && "max-md:text-white")}>/mes</span>}
			</div>
			<span className={cn("text-sm text-cacao-2", highlighted && "max-md:text-white")}>{plan.note}</span>
			<CtaLink
				to={`/register?plan=${plan.id}`}
				variant={highlighted ? "featured" : "outline"}
				className="mt-auto"
				onClick={() => savePlan(plan.id)}
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
						<Fragment key={p.id}>
							<PlanCard plan={p} />
							{!p.badge && <PlanRow plan={p} />}
						</Fragment>
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
					<span>Un solo producto, todo incluido: mensual, anual o de por vida solo cambia cómo pagas.</span>
				</div>
			</div>
		</section>
	);
}
