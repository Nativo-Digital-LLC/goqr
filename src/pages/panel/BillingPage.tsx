import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBillsByUserId } from "@/hooks/useBills";
import { trialDaysLeft } from "@/lib/panel";
import { auth } from "@/utils/firebase";
import { usePanel } from "./PanelContext";
import { PanelHeader } from "./components/PanelHeader";

const toDate = (d: unknown) => (d && typeof (d as { toDate?: unknown }).toDate === "function" ? (d as { toDate(): Date }).toDate() : new Date(d as string));
const th = "px-4 py-3 text-left text-[13px] font-semibold text-muted-foreground";

export default function BillingPage() {
	const { establishment } = usePanel();
	const userId = auth.currentUser!.uid; // PanelLayout no muestra esta página sin sesión
	const [bills, loading, error, reload] = useGetBillsByUserId(userId);
	const days = establishment.billing?.status === "trialing" ? trialDaysLeft(establishment.billing.trialEndsAt, new Date()) : null;

	return (
		<>
			<PanelHeader title="Plan y pagos" description="Muy pronto podrás elegir tu plan y pagar con tarjeta o transferencia desde aquí." />
			{days !== null && (
				<div className="rounded-2xl bg-warning-bg px-5 py-4 text-[15px] font-bold">
					{days === 0 ? "Tu prueba terminó" : `Te quedan ${days} ${days === 1 ? "día" : "días"} de prueba`}
				</div>
			)}
			<section aria-labelledby="facturas" className="flex flex-col gap-3">
				<h2 id="facturas" className="text-lg font-bold">Facturas</h2>
				{loading ? (
					<Skeleton className="h-32 w-full" />
				) : error ? (
					<div className="flex flex-col items-start gap-3">
						<p className="text-[15px] text-muted-foreground">No pudimos cargar tus facturas.</p>
						<Button variant="outline" onClick={() => reload(userId)}>Reintentar</Button>
					</div>
				) : bills.length === 0 ? (
					<p className="text-[15px] text-muted-foreground">Todavía no tienes facturas.</p>
				) : (
					<div className="overflow-x-auto rounded-2xl border border-border bg-card">
						<table className="w-full text-[15px]">
							<thead>
								<tr className="border-b border-border">
									<th className={th}>Número</th>
									<th className={th}>Fecha</th>
									<th className={th}>Monto</th>
									<th className={th}>Estado</th>
									<th className={th} />
								</tr>
							</thead>
							<tbody>
								{bills.map((b) => (
									<tr key={b.id} className="border-b border-border last:border-0">
										<td className="px-4 py-3">{b.orderNumber}</td>
										<td className="px-4 py-3">{toDate(b.createdAt).toLocaleDateString("es-DO")}</td>
										<td className="px-4 py-3">${b.amount.toLocaleString("en-US")}</td>
										<td className="px-4 py-3">{b.isPayed ? "Pagada" : "Pendiente"}</td>
										<td className="px-4 py-3 text-right">
											{!b.isPayed && (
												<Button onClick={() => window.open(b.paymentUrl, "_blank")}>Pagar</Button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</>
	);
}
