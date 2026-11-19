import { Button } from "@/components/ui/button";
import { billStatus, formatMoney, toDate } from "@/lib/billing";
import { BillProps } from "@/types/Bill";
import { TransferProps } from "@/types/Transfer";

const th = "px-4 py-3 text-left text-[13px] font-semibold text-muted-foreground";
const dateOf = (d: unknown) => toDate(d).toLocaleDateString("es-DO");

type Row = { key: string; number: string; date: string; period: string; amount: string; status: string; action: React.ReactNode };

export function BillsTable({ bills, pending }: { bills: BillProps[]; pending: TransferProps[] }) {
	const rows: Row[] = [
		// Las transferencias en revisión todavía no tienen factura.
		...pending.map((t) => ({
			key: t.id, number: t.reference, date: dateOf(t.createdAt), period: "—",
			amount: formatMoney(t.amount, t.currency), status: "En revisión", action: null,
		})),
		...bills.map((b) => {
			const status = billStatus(b);
			const payUrl = b.hostedInvoiceUrl ?? b.paymentUrl;
			return {
				key: b.id, number: b.orderNumber, date: dateOf(b.createdAt), period: b.period || b.billingPeriod || "—",
				amount: formatMoney(b.amount, b.currency), status,
				action: status === "Pagada"
					? b.invoicePdf && <Button asChild variant="outline" size="sm"><a href={b.invoicePdf} target="_blank" rel="noreferrer">PDF</a></Button>
					: payUrl && <Button asChild size="sm"><a href={payUrl} target="_blank" rel="noreferrer">{status === "Fallida" ? "Reintentar pago" : "Pagar"}</a></Button>,
			};
		}),
	];

	if (rows.length === 0) return <p className="text-[15px] text-muted-foreground">Todavía no tienes facturas.</p>;
	return (
		<div className="overflow-x-auto rounded-2xl border border-border bg-card">
			<table className="w-full text-[15px]">
				<thead>
					<tr className="border-b border-border">
						<th className={th}>Número</th>
						<th className={th}>Fecha</th>
						<th className={th}>Período</th>
						<th className={th}>Monto</th>
						<th className={th}>Estado</th>
						<th className={th} />
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={r.key} className="border-b border-border last:border-0">
							<td className="px-4 py-3">{r.number}</td>
							<td className="px-4 py-3">{r.date}</td>
							<td className="px-4 py-3">{r.period}</td>
							<td className="px-4 py-3">{r.amount}</td>
							<td className="px-4 py-3">{r.status}</td>
							<td className="px-4 py-3 text-right">{r.action}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
