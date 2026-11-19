import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBillsByUserId } from "@/hooks/useBills";
import { billingView, billsFor } from "@/lib/billing";
import { getTransfers } from "@/services/billing";
import { TransferProps } from "@/types/Transfer";
import { auth } from "@/utils/firebase";
import { usePanel } from "./PanelContext";
import { PanelHeader } from "./components/PanelHeader";
import { ActivePlan, FiscalData } from "./billing/ActivePlan";
import { BillsTable } from "./billing/BillsTable";
import { PlanPicker } from "./billing/PlanPicker";

export default function BillingPage() {
	const { establishment: e } = usePanel();
	const userId = auth.currentUser!.uid; // PanelLayout no muestra esta página sin sesión
	const [bills, loading, error, reload] = useGetBillsByUserId(userId);
	const [pending, setPending] = useState<TransferProps[]>([]);
	const [transfersError, setTransfersError] = useState(false);
	const [attempt, setAttempt] = useState(0);
	const view = billingView(e);

	useEffect(() => {
		let cancelled = false;
		setTransfersError(false);
		getTransfers(e.id)
			.then((t) => !cancelled && setPending(t.filter((x) => x.status === "pending")))
			.catch(() => !cancelled && (setPending([]), setTransfersError(true)));
		return () => { cancelled = true; };
	}, [e.id, attempt]);

	return (
		<>
			<PanelHeader title="Plan y pagos" description={e.name} />
			{view === "choose" && <PlanPicker establishment={e} />}
			{(view === "active" || view === "past_due") && <ActivePlan establishment={e} past={view === "past_due"} />}
			{view === "legacy" && (
				<div className="rounded-2xl bg-secondary px-5 py-4 text-[15px] font-semibold">Tu plan actual sigue igual. Te escribiremos antes de cualquier cambio.</div>
			)}
			<FiscalData establishment={e} />
			<section aria-labelledby="facturas" className="flex flex-col gap-3">
				<h2 id="facturas" className="text-lg font-bold">Facturas</h2>
				{transfersError && (
					<div className="flex flex-wrap items-center gap-3">
						<p className="text-[15px] text-muted-foreground">No pudimos cargar tus comprobantes.</p>
						<Button variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>Reintentar</Button>
					</div>
				)}
				{loading ? (
					<Skeleton className="h-32 w-full" />
				) : error ? (
					<div className="flex flex-col items-start gap-3">
						<p className="text-[15px] text-muted-foreground">No pudimos cargar tus facturas.</p>
						<Button variant="outline" onClick={() => reload(userId)}>Reintentar</Button>
					</div>
				) : (
					<BillsTable bills={billsFor(bills, e.id)} pending={pending} />
				)}
			</section>
		</>
	);
}
