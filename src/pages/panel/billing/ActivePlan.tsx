import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants/plans";
import { useOpenPortal } from "@/hooks/useBilling";
import { formatMoney, statusLabel, toDate } from "@/lib/billing";
import { EstablishmentProps } from "@/types/Establishment";

const DAY_MS = 24 * 60 * 60 * 1000;

export function ActivePlan({ establishment: e, past }: { establishment: EstablishmentProps; past: boolean }) {
	const [openPortal, loading] = useOpenPortal();
	const navigate = useNavigate();
	const b = e.billing!;
	const plan = PLANS.find((p) => p.id === b.plan);
	const end = b.currentPeriodEnd ? toDate(b.currentPeriodEnd) : null;
	const lifetime = b.plan === "lifetime";
	const soon = b.method === "transfer" && !lifetime && end && end.getTime() - Date.now() <= 7 * DAY_MS;

	const portal = async () => {
		try {
			window.location.assign(await openPortal(e.id));
		} catch (err) {
			toast.error((err as Error).message || "No pudimos abrir Stripe. Intenta de nuevo.");
		}
	};

	return (
		<>
			{past && (
				<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-error-bg px-5 py-4">
					<div className="flex flex-col gap-0.5">
						<span className="text-[15px] font-bold">No pudimos cobrar tu tarjeta.</span>
						<span className="text-sm text-muted-foreground">Actualízala para que tu menú no se pause.</span>
					</div>
					<Button onClick={portal} loading={loading}>Actualizar tarjeta</Button>
				</div>
			)}
			<section aria-labelledby="tu-plan" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 id="tu-plan" className="text-lg font-bold">Tu plan</h2>
					{b.status && <span className="rounded-full bg-secondary px-3 py-1 text-[13px] font-semibold">{statusLabel(b.status)}</span>}
				</div>
				<span className="text-xl font-bold">{plan ? `${plan.name} · ${formatMoney(plan.priceDop)}` : "—"}</span>
				<dl className="grid gap-3 sm:grid-cols-2">
					<div>
						<dt className="text-sm text-muted-foreground">{b.method === "card" && !lifetime ? "Próximo cobro" : "Vence"}</dt>
						<dd className="text-[15px] font-semibold">{lifetime ? "De por vida" : end ? end.toLocaleDateString("es-DO") : "—"}</dd>
					</div>
					<div>
						<dt className="text-sm text-muted-foreground">Método de pago</dt>
						<dd className="text-[15px] font-semibold">{b.method === "card" ? "Tarjeta" : "Transferencia"}</dd>
					</div>
				</dl>
				{b.method === "card" && (
					<>
						<div><Button variant="outline" onClick={portal} loading={loading}>Gestionar en Stripe</Button></div>
						<p className="text-sm text-muted-foreground">En el portal de Stripe puedes cambiar tu tarjeta, descargar recibos o cancelar la suscripción.</p>
					</>
				)}
				{soon && <div><Button onClick={() => navigate(`/dashboard/billing/transfer?plan=${b.plan}`)}>Renovar por transferencia</Button></div>}
			</section>
		</>
	);
}

export function FiscalData({ establishment: e }: { establishment: EstablishmentProps }) {
	if (!e.requiresTaxReceipt && !e.rnc) {
		return (
			<p className="text-sm text-muted-foreground">
				¿Necesitas comprobante fiscal? <Link to="/dashboard/establishment#fiscal" className="font-semibold text-brand underline">Agrega tu RNC</Link>
			</p>
		);
	}
	return (
		<section aria-labelledby="fiscal" className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
			<div className="flex items-center justify-between">
				<h2 id="fiscal" className="text-lg font-bold">Datos fiscales</h2>
				<Button asChild variant="outline" size="sm"><Link to="/dashboard/establishment#fiscal">Editar</Link></Button>
			</div>
			<dl className="grid gap-3 sm:grid-cols-3">
				<div><dt className="text-sm text-muted-foreground">RNC</dt><dd className="text-[15px] font-semibold">{e.rnc || "—"}</dd></div>
				<div><dt className="text-sm text-muted-foreground">Razón social</dt><dd className="text-[15px] font-semibold">{e.companyName || "—"}</dd></div>
				{e.requiresTaxReceipt && <div><dt className="text-sm text-muted-foreground">Tipo de comprobante</dt><dd className="text-[15px] font-semibold">Crédito fiscal (B01)</dd></div>}
			</dl>
		</section>
	);
}
