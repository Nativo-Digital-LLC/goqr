import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BANK_ACCOUNTS } from "@/constants/bankAccounts";
import { PLANS } from "@/constants/plans";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatMoney, toDate } from "@/lib/billing";
import { AdminClient, listClients, listTransfers, proofUrl, reviewTransfer } from "@/services/admin";
import { TransferProps } from "@/types/Transfer";
import { ConfirmDialog } from "../panel/menu/ConfirmDialog";
import type { AdminOutlet } from "./AdminLayout";

type Status = TransferProps["status"];
const REASONS = ["El monto no coincide", "No encontramos la transferencia", "Comprobante ilegible"];
const OTHER = "Otro";
const date = (d: unknown) => toDate(d).toLocaleDateString("es-DO");
const isPdf = (p: string) => p.toLowerCase().endsWith(".pdf");

function Row({ label, children, warn }: { label: string; children: React.ReactNode; warn?: boolean }) {
	return (
		<div className="flex justify-between gap-4 text-[14px]">
			<span className="text-muted-foreground">{label}</span>
			<span className={warn ? "font-bold text-destructive" : "font-semibold"}>{children}</span>
		</div>
	);
}

function Detail({ t, client, onDone }: { t: TransferProps; client?: AdminClient; onDone: () => void }) {
	const [url, setUrl] = useState<string | null>(null);
	const [reason, setReason] = useState("");
	const [other, setOther] = useState("");
	const [confirm, setConfirm] = useState<"approve" | "reject" | null>(null);
	const [loading, setLoading] = useState(false);
	const [proofFailed, setProofFailed] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		setProofFailed(false);
		proofUrl(t.proofPath).then(setUrl, () => setProofFailed(true));
	}, [t.proofPath, attempt]);

	const plan = PLANS.find((p) => p.id === t.plan)!;
	const expected = t.currency === "USD" ? plan.priceUsd : plan.priceDop;
	const account = t.currency === "USD" ? `US$ · ${BANK_ACCOUNTS.usd.bank}` : `RD$ · ${BANK_ACCOUNTS.dop.bank}`;
	const finalReason = reason === OTHER ? other.trim() : reason;
	const pending = t.status === "pending";

	async function run() {
		if (!confirm) return;
		setLoading(true);
		try {
			await reviewTransfer(t.id, confirm, confirm === "reject" ? finalReason : undefined);
			toast.success(confirm === "approve" ? "Transferencia aprobada" : "Transferencia rechazada");
			setConfirm(null);
			onDone();
		} catch (e) {
			toast.error((e as Error).message || "No pudimos completar la acción.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<p className="text-[16px] font-bold">{client?.name ?? t.establishmentId}</p>
			<p className="text-[13px] font-semibold text-muted-foreground">Vista previa del comprobante</p>
			{proofFailed && (
				<div className="flex items-center gap-3 text-[14px]">
					<span>No se pudo cargar el comprobante.</span>
					<Button size="sm" variant="outline" onClick={() => setAttempt((n) => n + 1)}>Reintentar</Button>
				</div>
			)}
			{url && !isPdf(t.proofPath) && <img src={url} alt="Comprobante" className="max-h-72 w-full rounded-lg border border-border object-contain" />}
			{url && (
				<a href={url} target="_blank" rel="noreferrer" className="text-[14px] font-semibold text-primary underline">
					Abrir en tamaño completo
				</a>
			)}
			<Row label="Código">{t.reference}</Row>
			<Row label="Cuenta destino">{account}</Row>
			<Row label="Monto declarado" warn={t.amount !== expected}>{formatMoney(t.amount, t.currency)}</Row>
			<Row label="Monto esperado">{formatMoney(expected, t.currency)}</Row>
			<Row label="Fecha declarada">{date(t.declaredDate)}</Row>
			<Row label="Plan">{plan.name}</Row>
			{pending ? (
				<>
					<div className="flex flex-col gap-2">
						<label className="text-[13px] font-semibold">Motivo de rechazo (el cliente lo verá en su panel)</label>
						<Select value={reason} onValueChange={setReason}>
							<SelectTrigger><SelectValue placeholder="Selecciona un motivo" /></SelectTrigger>
							<SelectContent>
								{[...REASONS, OTHER].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
							</SelectContent>
						</Select>
						{reason === OTHER && <Input value={other} onChange={(e) => setOther(e.target.value)} placeholder="Escribe el motivo" />}
					</div>
					<p className="text-[13px] text-muted-foreground">Al aprobar, el menú del cliente queda activo.</p>
					<div className="flex gap-2">
						<Button className="flex-1" onClick={() => setConfirm("approve")}>Aprobar y activar plan</Button>
						<Button className="flex-1" variant="outline" disabled={!finalReason} onClick={() => setConfirm("reject")}>
							Rechazar con motivo
						</Button>
					</div>
				</>
			) : (
				t.reason && <Row label="Motivo">{t.reason}</Row>
			)}
			<ConfirmDialog
				open={!!confirm}
				onOpenChange={(o) => !o && setConfirm(null)}
				title={confirm === "approve" ? "¿Aprobar esta transferencia?" : "¿Rechazar esta transferencia?"}
				body={confirm === "approve" ? "Se activará el plan del cliente." : `El cliente verá este motivo en su panel: ${finalReason}`}
				confirmLabel={confirm === "approve" ? "Aprobar y activar plan" : "Rechazar"}
				destructive={confirm === "reject"}
				loading={loading}
				onConfirm={run}
			/>
		</div>
	);
}

export default function AdminTransfersPage() {
	const { refreshPending } = useOutletContext<AdminOutlet>();
	const isLg = useMediaQuery("(min-width: 1024px)");
	const [status, setStatus] = useState<Status>("pending");
	const [items, setItems] = useState<TransferProps[] | null>(null);
	const [clients, setClients] = useState<Map<string, AdminClient>>(new Map());
	const [selected, setSelected] = useState<TransferProps | null>(null);

	useEffect(() => {
		listClients().then((l) => setClients(new Map(l.map((c) => [c.establishmentId, c]))), () => toast.error("No pudimos cargar los clientes."));
	}, []);

	const [reloads, setReloads] = useState(0);
	const [failed, setFailed] = useState(false);
	useEffect(() => {
		let cancelled = false; // una respuesta lenta de otra pestaña no debe pisar la lista
		setItems(null);
		setFailed(false);
		listTransfers(status).then(
			(l) => !cancelled && setItems(l),
			() => !cancelled && setFailed(true)
		);
		return () => {
			cancelled = true;
		};
	}, [status, reloads]);

	const done = () => {
		setSelected(null);
		setReloads((n) => n + 1);
		refreshPending();
	};
	const detail = selected && <Detail key={selected.id} t={selected} client={clients.get(selected.establishmentId)} onDone={done} />;

	return (
		<>
			<h1 className="font-display text-2xl font-extrabold">Transferencias por revisar</h1>
			<Tabs value={status} onValueChange={(v) => { setSelected(null); setStatus(v as Status); }}>
				<TabsList>
					<TabsTrigger value="pending">Pendientes</TabsTrigger>
					<TabsTrigger value="approved">Aprobadas</TabsTrigger>
					<TabsTrigger value="rejected">Rechazadas</TabsTrigger>
				</TabsList>
			</Tabs>
			<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
				<div className="min-w-0 flex-1 overflow-x-auto">
					<table className="w-full text-left text-[14px]">
						<thead className="text-[12px] text-muted-foreground">
							<tr>
								{["Comprobante", "Cliente", "Establecimiento", "Plan", "Monto", "Fecha", ""].map((h) => (
									<th key={h} className="px-2 py-2 font-semibold">{h}</th>
								))}
							</tr>
						</thead>
						<tbody>
							{items?.map((t) => {
								const c = clients.get(t.establishmentId);
								return (
									<tr key={t.id} className={`border-t border-border ${selected?.id === t.id ? "bg-muted" : ""}`}>
										<td className="px-2 py-2 font-semibold">{isPdf(t.proofPath) ? "PDF" : "IMG"}</td>
										<td className="px-2 py-2">
											<div className="font-semibold">{c?.ownerName}</div>
											<div className="text-[12px] text-muted-foreground">{c?.ownerEmail}</div>
										</td>
										<td className="px-2 py-2">{c?.name ?? t.establishmentId}</td>
										<td className="px-2 py-2">{PLANS.find((p) => p.id === t.plan)?.name}</td>
										<td className="px-2 py-2">{formatMoney(t.amount, t.currency)}</td>
										<td className="px-2 py-2">{date(t.createdAt)}</td>
										<td className="px-2 py-2"><Button size="sm" variant="outline" onClick={() => setSelected(t)}>Revisar</Button></td>
									</tr>
								);
							})}
						</tbody>
					</table>
					{failed && (
						<div className="flex items-center gap-3 py-6 text-[14px]">
							<span>No se pudieron cargar las transferencias.</span>
							<Button size="sm" variant="outline" onClick={() => setReloads((n) => n + 1)}>Reintentar</Button>
						</div>
					)}
					{items && !items.length && <p className="py-6 text-[14px] text-muted-foreground">No hay transferencias.</p>}
					{!items && !failed && <p className="py-6 text-[14px] text-muted-foreground">Cargando…</p>}
				</div>
				{isLg && detail && <div className="w-[380px] shrink-0 rounded-xl border border-border p-5">{detail}</div>}
			</div>
			{!isLg && (
				<Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
					<SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto p-5">
						<SheetTitle className="sr-only">Transferencia</SheetTitle>
						<SheetDescription className="sr-only">Detalle de la transferencia</SheetDescription>
						{detail}
					</SheetContent>
				</Sheet>
			)}
		</>
	);
}
