import { FormEvent, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { BANK_ACCOUNTS } from "@/constants/bankAccounts";
import { PLANS, PlanId } from "@/constants/plans";
import { useSubmitTransfer } from "@/hooks/useBilling";
import { formatMoney, transferReference } from "@/lib/billing";
import { parsePrice } from "@/lib/price";
import { getTransfers } from "@/services/billing";
import { TransferProps } from "@/types/Transfer";
import { usePanel } from "../PanelContext";
import { PanelHeader } from "../components/PanelHeader";

const TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_BYTES = 10 * 1024 * 1024;
const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD en hora local
const card = "flex flex-col gap-3 rounded-2xl border border-border bg-card p-5";

export default function TransferPage() {
	const { establishment: e } = usePanel();
	const [params] = useSearchParams();
	const planParam = params.get("plan");
	const plan = PLANS.find((p) => p.id === planParam) ?? PLANS.find((p) => p.id === "annual")!;
	const [transfers, setTransfers] = useState<TransferProps[] | null>(null);
	const [loadError, setLoadError] = useState(false);
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		let cancelled = false;
		setLoadError(false);
		getTransfers(e.id)
			.then((t) => !cancelled && setTransfers(t))
			.catch(() => !cancelled && setLoadError(true));
		return () => { cancelled = true; };
	}, [e.id, attempt]);

	const pending = transfers?.some((t) => t.status === "pending");
	const rejected = transfers && !pending && transfers[0]?.status === "rejected" ? transfers[0] : null;

	return (
		<>
			<Link to="/dashboard/billing" className="inline-flex items-center gap-1 self-start text-[15px] font-semibold text-muted-foreground hover:text-foreground">
				<ChevronLeft size={18} aria-hidden /> Volver a Plan y pagos
			</Link>
			<PanelHeader title="Pagar por transferencia" description={e.name} />
			{loadError ? (
				<div className="flex flex-wrap items-center gap-3">
					<p className="text-[15px] text-muted-foreground">No pudimos cargar tus comprobantes.</p>
					<Button variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>Reintentar</Button>
				</div>
			) : !transfers ? (
				<Skeleton className="h-64 w-full" />
			) : pending ? (
				<StatusLine />
			) : (
				<TransferForm
					establishmentId={e.id}
					establishmentName={e.name}
					plan={plan.id}
					rejectedReason={rejected ? rejected.reason ?? "" : null}
					onSent={() => { setTransfers(null); setAttempt((n) => n + 1); }}
				/>
			)}
		</>
	);
}

function StatusLine() {
	const steps = [
		{ label: "Enviado", note: "Recibimos tu comprobante.", done: true },
		{ label: "En revisión", note: "Lo verificamos en menos de 24 h.", done: false },
		{ label: "Aprobado", note: "Activamos tu plan.", done: false },
	];
	return (
		<ol className={card}>
			{steps.map((s) => (
				<li key={s.label} className="flex items-start gap-3">
					<span className={`mt-0.5 flex size-6 items-center justify-center rounded-full border-2 ${s.done ? "border-brand bg-brand text-white" : "border-border"}`}>
						{s.done && <Check size={14} aria-hidden />}
					</span>
					<div>
						<p className="text-[15px] font-semibold">{s.label}</p>
						<p className="text-sm text-muted-foreground">{s.note}</p>
					</div>
				</li>
			))}
		</ol>
	);
}

function TransferForm({ establishmentId, establishmentName, plan: planId, rejectedReason, onSent }: {
	establishmentId: string;
	establishmentName: string;
	plan: PlanId;
	rejectedReason: string | null;
	onSent: () => void;
}) {
	const plan = PLANS.find((p) => p.id === planId)!;
	const [submit, sending] = useSubmitTransfer();
	const [file, setFile] = useState<File | null>(null);
	const [date, setDate] = useState("");
	const [amountText, setAmountText] = useState("");
	const [currency, setCurrency] = useState<"DOP" | "USD">("DOP");
	const [errors, setErrors] = useState<Partial<Record<"file" | "date" | "amount" | "submit", string>>>({});
	const dop = BANK_ACCOUNTS.dop;
	const usd = BANK_ACCOUNTS.usd;

	const pick = (f?: File) => {
		if (!f) return;
		if (!TYPES.includes(f.type) || f.size >= MAX_BYTES) {
			setFile(null);
			return setErrors((x) => ({ ...x, file: "Usa una imagen JPG, PNG o un PDF de hasta 10 MB." }));
		}
		setErrors((x) => ({ ...x, file: undefined }));
		setFile(f);
	};

	const onSubmit = async (ev: FormEvent) => {
		ev.preventDefault();
		const amount = parsePrice(amountText);
		const next: typeof errors = {};
		if (!file) next.file = errors.file ?? "Sube tu comprobante.";
		if (!date) next.date = "Elige la fecha de la transferencia.";
		else if (date > today()) next.date = "La fecha no puede ser futura.";
		if (!amount) next.amount = "Escribe el monto que transferiste.";
		setErrors(next);
		if (Object.keys(next).length || !file || !amount) return;
		try {
			await submit({ establishmentId, plan: planId, amount, currency, declaredDate: new Date(`${date}T12:00:00`), file });
			toast.success("Recibimos tu comprobante.");
			onSent();
		} catch (err) {
			setErrors({ submit: (err as Error).message || "No pudimos enviar tu comprobante. Intenta de nuevo." });
		}
	};

	return (
		<form onSubmit={onSubmit} noValidate className="grid gap-6 lg:grid-cols-[1fr_320px]">
			<div className="flex flex-col gap-6">
				{rejectedReason !== null && (
					<div role="alert" className="rounded-2xl bg-destructive/10 px-5 py-4 text-[15px] font-semibold text-destructive">
						Rechazamos tu comprobante{rejectedReason ? `: ${rejectedReason}` : ""}. Puedes enviar otro.
					</div>
				)}
				<section className={card} aria-labelledby="paso1">
					<h2 id="paso1" className="text-lg font-bold">1. Transfiere a una de estas cuentas</h2>
					<div className="grid gap-3 sm:grid-cols-2">
						<dl className="rounded-xl bg-secondary p-4 text-[15px]">
							<dt className="font-bold">RD$ · {formatMoney(plan.priceDop, "DOP")}</dt>
							<dd>{dop.bank} · {dop.type}</dd><dd>{dop.number}</dd><dd>{dop.holder}</dd><dd>RNC {dop.rnc}</dd>
						</dl>
						<dl className="rounded-xl bg-secondary p-4 text-[15px]">
							<dt className="font-bold">US$ · {formatMoney(plan.priceUsd, "USD")}</dt>
							<dd>{usd.bank}</dd><dd>Cuenta {usd.account}</dd><dd>Routing {usd.routing}</dd><dd>{usd.holder}</dd>
						</dl>
					</div>
					<p className="text-[15px]">Escribe este código en el concepto de la transferencia:</p>
					<div className="flex flex-wrap items-center gap-3">
						<code className="rounded-lg bg-secondary px-3 py-2 text-base font-bold">{transferReference(establishmentId)}</code>
						<Button
							type="button"
							variant="outline"
							onClick={() => navigator.clipboard.writeText(transferReference(establishmentId)).then(() => toast.success("Código copiado"), () => toast.error("No pudimos copiar el código."))}
						>
							Copiar código
						</Button>
					</div>
				</section>
				<section className={card} aria-labelledby="paso2">
					<h2 id="paso2" className="text-lg font-bold">2. Sube tu comprobante</h2>
					<label
						className="relative flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed border-border bg-background p-6 text-center focus-within:ring-[3px] focus-within:ring-ring/50"
						onDragOver={(ev) => ev.preventDefault()}
						onDrop={(ev) => { ev.preventDefault(); if (!sending) pick(ev.dataTransfer.files[0]); }}
					>
						<span className="text-[15px] font-semibold">{file ? file.name : "Arrastra el archivo aquí o búscalo en tu equipo"}</span>
						<span className="text-[13px] text-muted-foreground">JPG, PNG o PDF, máx. 10 MB.</span>
						<input
							type="file"
							accept="image/jpeg,image/png,application/pdf"
							className="absolute size-px opacity-0"
							disabled={sending}
							onChange={(ev) => { pick(ev.target.files?.[0]); ev.target.value = ""; }}
						/>
					</label>
					{errors.file && <span role="alert" className="text-sm text-destructive">{errors.file}</span>}
					<div className="flex flex-col gap-2">
						<Label htmlFor="fecha">Fecha de la transferencia</Label>
						<Input id="fecha" type="date" max={today()} value={date} onChange={(ev) => setDate(ev.target.value)} disabled={sending} aria-invalid={!!errors.date} />
						{errors.date && <span role="alert" className="text-sm text-destructive">{errors.date}</span>}
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor="monto">Monto transferido</Label>
						<div className="flex gap-3">
							<Input id="monto" inputMode="decimal" value={amountText} onChange={(ev) => setAmountText(ev.target.value)} disabled={sending} aria-invalid={!!errors.amount} />
							<div role="group" aria-label="Moneda" className="flex shrink-0 rounded-md border border-input p-0.5">
								{(["DOP", "USD"] as const).map((c) => (
									<button
										key={c}
										type="button"
										aria-pressed={currency === c}
										disabled={sending}
										onClick={() => setCurrency(c)}
										className={`rounded px-3 text-sm font-semibold ${currency === c ? "bg-brand text-white" : "text-muted-foreground"}`}
									>
										{c === "DOP" ? "RD$" : "US$"}
									</button>
								))}
							</div>
						</div>
						<span className="text-[13px] text-muted-foreground">Si pagaste en dólares, indícalo en US$.</span>
						{errors.amount && <span role="alert" className="text-sm text-destructive">{errors.amount}</span>}
					</div>
					{errors.submit && <span role="alert" className="text-sm text-destructive">{errors.submit}</span>}
					<Button type="submit" loading={sending} className="self-start">Enviar comprobante</Button>
				</section>
			</div>
			<aside className={`${card} h-fit`} aria-label="Resumen">
				<h2 className="text-lg font-bold">Resumen</h2>
				<p className="text-[15px]">{establishmentName}</p>
				<p className="text-[15px]">Plan {plan.name.toLowerCase()}</p>
				<p className="text-2xl font-extrabold">{formatMoney(plan.priceDop, "DOP")}</p>
				<p className="text-sm text-muted-foreground">ITBIS incluido.</p>
			</aside>
		</form>
	);
}
