import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PLANS, PlanId } from "@/constants/plans";
import { clientEnd, clientMetrics, filterClients } from "@/lib/adminClients";
import { formatMoney, statusLabel, toDate } from "@/lib/billing";
import { menuUrl } from "@/lib/qr";
import { AdminClient, listClients, updateBilling } from "@/services/admin";
import { ConfirmDialog } from "../panel/menu/ConfirmDialog";

type Action = "pause" | "reactivate" | "extendTrial" | "markPaid";
const COPY: Record<Action, { label: string; title: string; body: string }> = {
	pause: { label: "Pausar", title: "¿Pausar este menú?", body: "El menú dejará de estar visible para sus clientes hasta que lo reactives." },
	reactivate: { label: "Reactivar", title: "¿Reactivar este menú?", body: "El menú vuelve a estar visible de inmediato." },
	extendTrial: { label: "Extender prueba", title: "¿Extender la prueba 7 días?", body: "Se sumarán 7 días al final de la prueba." },
	markPaid: { label: "Marcar pagado", title: "Marcar como pagado", body: "Elige el plan que pagó el cliente. Se activará su menú." },
};
const date = (d: Date | null) => (d ? d.toLocaleDateString("es-DO") : "—");
const METHODS = { card: "Tarjeta", transfer: "Transferencia" } as const;

// Acciones disponibles según el estado.
function actionsFor(c: AdminClient, now: Date): Action[] {
	const s = c.billing?.status;
	const end = clientEnd(c);
	if (s === "active") return ["pause"];
	if (s === "trialing") return ["extendTrial"];
	if (s === "past_due") return ["markPaid"];
	if (s === "paused") return end && end > now ? ["reactivate", "markPaid"] : ["markPaid"];
	return [];
}

function Metric({ label, value }: { label: string; value: string | number }) {
	return (
		<div className="rounded-xl border border-border p-4">
			<p className="text-[13px] text-muted-foreground">{label}</p>
			<p className="font-display text-2xl font-extrabold">{value}</p>
		</div>
	);
}

function Filter({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
	return (
		<div className="flex flex-col gap-1">
			<label htmlFor={id} className="text-[12px] font-semibold text-muted-foreground">{label}</label>
			<Select value={value} onValueChange={onChange}>
				<SelectTrigger id={id} className="w-[170px]"><SelectValue /></SelectTrigger>
				<SelectContent>
					{options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
				</SelectContent>
			</Select>
		</div>
	);
}

export default function AdminClientsPage() {
	const [items, setItems] = useState<AdminClient[] | null>(null);
	const [failed, setFailed] = useState(false);
	const [reloads, setReloads] = useState(0);
	const [f, setF] = useState({ q: "", status: "all", plan: "all", method: "all" });
	const [pending, setPending] = useState<{ c: AdminClient; action: Action } | null>(null);
	const [plan, setPlan] = useState<PlanId>("monthly");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let cancelled = false; // una respuesta lenta no debe pisar una más reciente
		setFailed(false);
		listClients().then(
			(l) => !cancelled && setItems(l),
			() => !cancelled && setFailed(true)
		);
		return () => {
			cancelled = true;
		};
	}, [reloads]);

	const now = new Date();
	const metrics = useMemo(() => clientMetrics(items ?? [], new Date()), [items]);
	const rows = useMemo(() => filterClients(items ?? [], f), [items, f]);
	const set = (k: keyof typeof f) => (v: string) => setF((p) => ({ ...p, [k]: v }));

	async function run() {
		if (!pending) return;
		setLoading(true);
		try {
			const { c, action } = pending;
			await updateBilling(c.establishmentId, action, action === "extendTrial" ? { days: 7 } : action === "markPaid" ? { plan } : {});
			toast.success("Cambio aplicado");
			setPending(null);
			setReloads((n) => n + 1);
		} catch (e) {
			toast.error((e as Error).message || "No pudimos completar la acción.");
		} finally {
			setLoading(false);
		}
	}
	const ask = (c: AdminClient, action: Action) => {
		setPlan(c.billing?.plan ?? "monthly");
		setPending({ c, action });
	};

	return (
		<>
			<h1 className="font-display text-2xl font-extrabold">Clientes</h1>
			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Metric label="Clientes activos" value={metrics.active} />
				<Metric label="En prueba" value={metrics.trialing} />
				<Metric label="Ingreso mensual recurrente" value={formatMoney(metrics.mrrDop)} />
				<Metric label="Vencen esta semana" value={metrics.dueThisWeek} />
			</div>
			<div className="flex flex-wrap items-end gap-3">
				<div className="flex flex-col gap-1">
					<label htmlFor="client-q" className="text-[12px] font-semibold text-muted-foreground">Buscar</label>
					<Input id="client-q" className="w-[240px]" value={f.q} onChange={(e) => set("q")(e.target.value)} placeholder="Nombre, enlace o correo" />
				</div>
				<Filter id="client-status" label="Estado" value={f.status} onChange={set("status")} options={[["all", "Todos"], ["trialing", "Prueba"], ["active", "Activo"], ["past_due", "Vencido"], ["paused", "Pausado"]]} />
				<Filter id="client-plan" label="Plan" value={f.plan} onChange={set("plan")} options={[["all", "Todos"], ...PLANS.map((p) => [p.id, p.name] as [string, string])]} />
				<Filter id="client-method" label="Método de pago" value={f.method} onChange={set("method")} options={[["all", "Todos"], ["card", "Tarjeta (Stripe)"], ["transfer", "Transferencia"]]} />
			</div>
			<div className="min-w-0 overflow-x-auto">
				<table className="w-full text-left text-[14px]">
					<thead className="text-[12px] text-muted-foreground">
						<tr>
							{["Restaurante", "Dueño", "Plan", "Estado", "Vence", "Método", "Último acceso", "Acciones"].map((h) => (
								<th key={h} className="px-2 py-2 font-semibold">{h}</th>
							))}
						</tr>
					</thead>
					<tbody>
						{rows.map((c) => {
							const b = c.billing;
							return (
								<tr key={c.establishmentId} className="border-t border-border">
									<td className="px-2 py-2">
										<div className="font-semibold">{c.name}</div>
										<div className="text-[12px] text-muted-foreground">/m/{c.domain}</div>
									</td>
									<td className="px-2 py-2">
										<div className="font-semibold">{c.ownerName}</div>
										<div className="text-[12px] text-muted-foreground">{c.ownerEmail}</div>
									</td>
									<td className="px-2 py-2">{PLANS.find((p) => p.id === b?.plan)?.name ?? "—"}</td>
									<td className="px-2 py-2">{b?.status ? (b.status === "past_due" ? "Vencido" : statusLabel(b.status)) : "—"}</td>
									<td className="px-2 py-2">{b?.status === "legacy" ? "—" : date(clientEnd(c))}</td>
									<td className="px-2 py-2">{b?.method ? METHODS[b.method] : "—"}</td>
									<td className="px-2 py-2">{date(c.lastSignIn ? toDate(c.lastSignIn) : null)}</td>
									<td className="px-2 py-2">
										<div className="flex flex-wrap gap-2">
											<Button size="sm" variant="outline" asChild>
												<a href={menuUrl(c.domain)} target="_blank" rel="noreferrer">Ver menú</a>
											</Button>
											{actionsFor(c, now).map((a) => (
												<Button key={a} size="sm" variant="outline" onClick={() => ask(c, a)}>{COPY[a].label}</Button>
											))}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				{failed && (
					<div className="flex items-center gap-3 py-6 text-[14px]">
						<span>No se pudieron cargar los clientes.</span>
						<Button size="sm" variant="outline" onClick={() => setReloads((n) => n + 1)}>Reintentar</Button>
					</div>
				)}
				{items && !rows.length && <p className="py-6 text-[14px] text-muted-foreground">No hay clientes con esos filtros.</p>}
				{!items && !failed && <p className="py-6 text-[14px] text-muted-foreground">Cargando…</p>}
			</div>
			<ConfirmDialog
				open={!!pending && pending.action !== "markPaid"}
				onOpenChange={(o) => !o && setPending(null)}
				title={pending ? COPY[pending.action].title : ""}
				body={pending ? `${pending.c.name}. ${COPY[pending.action].body}` : ""}
				confirmLabel={pending ? COPY[pending.action].label : ""}
				destructive={pending?.action === "pause"}
				loading={loading}
				onConfirm={run}
			/>
			<Dialog open={pending?.action === "markPaid"} onOpenChange={(o) => !o && setPending(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{COPY.markPaid.title}</DialogTitle>
						<DialogDescription>{pending ? `${pending.c.name}. ${COPY.markPaid.body}` : ""}</DialogDescription>
					</DialogHeader>
					<Select value={plan} onValueChange={(v) => setPlan(v as PlanId)}>
						<SelectTrigger><SelectValue /></SelectTrigger>
						<SelectContent>
							{PLANS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
						</SelectContent>
					</Select>
					<DialogFooter>
						<Button variant="outline" onClick={() => setPending(null)}>Cancelar</Button>
						<Button loading={loading} onClick={run}>Marcar pagado</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
