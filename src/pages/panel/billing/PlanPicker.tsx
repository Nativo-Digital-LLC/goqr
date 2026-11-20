import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PLANS, PlanId } from "@/constants/plans";
import { useStartCheckout } from "@/hooks/useBilling";
import { effectivePrice, formatMoney, toDate } from "@/lib/billing";
import { trialDaysLeft } from "@/lib/panel";
import { EstablishmentProps } from "@/types/Establishment";

const SUFFIX: Record<PlanId, string> = { monthly: "/mes", annual: "/año", lifetime: "pago único" };
const DETAIL: Record<PlanId, string> = {
	monthly: "Se cobra cada mes. Cancela cuando quieras.",
	annual: "Un solo cobro al año.",
	lifetime: "Pagas una vez y tu menú queda activo para siempre.",
};
const choice = (on: boolean) => `relative flex cursor-pointer flex-col gap-1 rounded-2xl border-2 bg-card p-4 text-left has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/50 ${on ? "border-brand" : "border-border"}`;

export function PlanPicker({ establishment: e }: { establishment: EstablishmentProps }) {
	const [plan, setPlan] = useState<PlanId>("annual");
	const [method, setMethod] = useState<"card" | "transfer">("card");
	const [startCheckout, loading] = useStartCheckout();
	const navigate = useNavigate();
	const selected = PLANS.find((p) => p.id === plan)!;
	// Lo que este cliente pagaría (precio congelado si es su plan; si no, el de lista).
	const price = (id: PlanId) => effectivePrice(e.billing, id);
	const days = e.billing?.status === "trialing" ? trialDaysLeft(e.billing.trialEndsAt, new Date()) : null;

	const proceed = async () => {
		if (method === "transfer") return navigate(`/dashboard/billing/transfer?plan=${plan}`);
		try {
			window.location.assign(await startCheckout(e.id, plan));
		} catch (err) {
			toast.error((err as Error).message || "No pudimos iniciar el pago. Intenta de nuevo.");
		}
	};

	return (
		<>
			{days !== null && e.billing?.trialEndsAt ? (
				<div className="flex flex-col gap-0.5 rounded-2xl bg-warning-bg px-5 py-4">
					<span className="text-[15px] font-bold">
						Prueba gratis · termina el {toDate(e.billing.trialEndsAt).toLocaleDateString("es-DO")} · quedan {days} {days === 1 ? "día" : "días"}
					</span>
					<span className="text-sm text-muted-foreground">Elige un plan antes de esa fecha para que tu menú siga en línea sin interrupciones.</span>
				</div>
			) : (
				<div className="rounded-2xl bg-warning-bg px-5 py-4 text-[15px] font-bold">Tu menú está pausado. Elige un plan para volver a publicarlo.</div>
			)}

			<section aria-labelledby="elige" className="flex flex-col gap-3">
				<div className="flex flex-col gap-0.5">
					<h2 id="elige" className="text-lg font-bold">1. Elige tu plan</h2>
					<span className="text-sm text-muted-foreground">Precio por establecimiento · ITBIS incluido</span>
				</div>
				<div role="radiogroup" aria-labelledby="elige" className="grid gap-3 md:grid-cols-3">
					{PLANS.map((p) => (
						<label key={p.id} className={choice(plan === p.id)}>
							<input type="radio" name="plan" className="sr-only" checked={plan === p.id} onChange={() => setPlan(p.id)} />
							<span className="text-[15px] font-bold">{p.name}</span>
							{/* Con mensual congelado (p. ej. RD$300) el anual de lista no es ahorro: no se promete. */}
							{p.id === "annual" && price("monthly").dop * 12 > price("annual").dop && <span className="text-[13px] font-semibold text-success">Recomendado · ahorras 20%</span>}
							<span className="text-2xl font-bold">{formatMoney(price(p.id).dop)} <span className="text-sm font-medium text-muted-foreground">{SUFFIX[p.id]}</span></span>
							<span className="text-sm text-muted-foreground">
								{p.id === "annual" ? `Equivale a ${formatMoney(Math.round(price("annual").dop / 12))}/mes. ` : ""}
								{DETAIL[p.id]}
							</span>
						</label>
					))}
				</div>
			</section>

			<section aria-labelledby="pago" className="flex flex-col gap-3">
				<h2 id="pago" className="text-lg font-bold">2. ¿Cómo quieres pagar?</h2>
				<div role="radiogroup" aria-labelledby="pago" className="grid gap-3 md:grid-cols-2">
					<label className={choice(method === "card")}>
						<input type="radio" name="method" className="sr-only" checked={method === "card"} onChange={() => setMethod("card")} />
						<span className="text-[15px] font-bold">Pagar con tarjeta</span>
						<span className="text-sm text-muted-foreground">Visa, Mastercard o Amex. Pago seguro con Stripe. Se activa al instante.</span>
					</label>
					<label className={choice(method === "transfer")}>
						<input type="radio" name="method" className="sr-only" checked={method === "transfer"} onChange={() => setMethod("transfer")} />
						<span className="text-[15px] font-bold">Transferencia bancaria</span>
						<span className="text-sm text-muted-foreground">Cuentas en República Dominicana o EE. UU. Subes el comprobante y lo aprobamos en menos de 24 h.</span>
					</label>
				</div>
			</section>

			<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
				<div className="flex flex-col gap-0.5">
					<span className="text-sm text-muted-foreground">Total a pagar hoy</span>
					<span className="text-xl font-bold">{formatMoney(price(plan).dop)} · Plan {selected.name.toLowerCase()}</span>
					{method === "transfer" && <span className="text-sm text-muted-foreground">o {formatMoney(price(plan).usd, "usd")} si pagas a la cuenta de EE. UU.</span>}
				</div>
				<Button onClick={proceed} loading={loading}>Continuar al pago</Button>
			</div>

			<section aria-labelledby="pausa" className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-5">
				<h2 id="pausa" className="text-lg font-bold">¿Qué pasa si termina la prueba y no he pagado?</h2>
				<ul className="flex list-disc flex-col gap-1 pl-5 text-[15px] text-muted-foreground">
					<li>Tu menú público se pausa y quien escanee el QR verá un aviso de “menú no disponible”.</li>
					<li>Tus datos se guardan: categorías, productos, fotos y tu código QR siguen intactos.</li>
					<li>En cuanto pagues, el menú vuelve a estar en línea con el mismo QR. No hay que reimprimir nada.</li>
				</ul>
			</section>
		</>
	);
}
