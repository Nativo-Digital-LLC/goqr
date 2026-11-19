import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { PLANS } from "@/constants/plans";
import { Collection } from "@/constants/Collections";
import { PANEL_ESTABLISHMENT_KEY } from "@/constants/panel";
import { AuthLayout } from "@/layouts/AuthLayout";
import { formatMoney, toDate } from "@/lib/billing";
import { auth, db } from "@/utils/firebase";
import type { EstablishmentProps } from "@/types/Establishment";

const WAIT_MS = 30_000;

type Phase = "auth" | "loading" | "missing" | "ready" | "timeout";

export default function CheckoutResultPage({ result }: { result: "success" | "cancel" }) {
	const establishmentId = useSearchParams()[0].get("establishmentId");
	const navigate = useNavigate();
	const [signedIn, setSignedIn] = useState<boolean | null>(null);
	const [phase, setPhase] = useState<Phase>("auth");
	const [e, setE] = useState<EstablishmentProps | null>(null);

	useEffect(() => {
		let alive = true;
		auth.authStateReady().then(() => alive && setSignedIn(!!auth.currentUser));
		return () => { alive = false; };
	}, []);

	useEffect(() => {
		if (!signedIn) return;
		if (!establishmentId) return setPhase("missing");
		setPhase("loading");
		const timer = result === "success" ? setTimeout(() => setPhase((p) => (p === "ready" ? p : "timeout")), WAIT_MS) : undefined;
		const unsub = onSnapshot(
			doc(db, Collection.Establishments, establishmentId),
			(snap) => {
				if (!snap.exists()) return setPhase("missing");
				const data = { ...snap.data(), id: snap.id } as EstablishmentProps;
				setE(data);
				if (result === "cancel" || data.billing?.status === "active") setPhase("ready");
			},
			() => setPhase("missing")
		);
		return () => { unsub(); clearTimeout(timer); };
	}, [signedIn, establishmentId, result]);

	const goPanel = () => {
		if (establishmentId && e) localStorage.setItem(PANEL_ESTABLISHMENT_KEY, establishmentId);
		navigate("/dashboard");
	};

	if (signedIn === false) return <Navigate to="/login" replace />;

	const b = e?.billing;
	const plan = PLANS.find((p) => p.id === b?.plan);
	const lifetime = b?.plan === "lifetime";
	const end = b?.currentPeriodEnd ? toDate(b.currentPeriodEnd) : null;
	const trialEnd = b?.status === "trialing" && b.trialEndsAt ? toDate(b.trialEndsAt) : null;

	let body;
	if (phase === "auth" || (phase === "loading" && result === "success")) {
		body = (
			<>
				<h1 className="text-2xl font-extrabold">Confirmando tu pago…</h1>
				<p role="status" className="text-[15px] text-muted-foreground">Esto toma solo unos segundos.</p>
			</>
		);
	} else if (phase === "missing") {
		body = (
			<>
				<h1 className="text-2xl font-extrabold">No encontramos este pago.</h1>
				<Button onClick={goPanel}>Ir al panel</Button>
			</>
		);
	} else if (phase === "timeout") {
		body = (
			<>
				<h1 className="text-2xl font-extrabold">Tu pago está en proceso. Te avisaremos cuando se confirme.</h1>
				<Button onClick={goPanel}>Ir al panel</Button>
			</>
		);
	} else if (result === "cancel") {
		body = (
			<>
				<h1 className="text-2xl font-extrabold">No se completó el pago</h1>
				<p className="text-[15px] text-muted-foreground">
					No se hizo ningún cargo.
					{trialEnd && ` Tu prueba sigue activa hasta el ${trialEnd.toLocaleDateString("es-DO")}.`}
				</p>
				<div className="flex flex-col gap-3 sm:flex-row">
					<Button asChild><Link to="/dashboard/billing" onClick={goPanelSelect(establishmentId)}>Intentar de nuevo</Link></Button>
					<Button asChild variant="outline"><Link to="/dashboard/billing/transfer" onClick={goPanelSelect(establishmentId)}>Pagar por transferencia</Link></Button>
				</div>
			</>
		);
	} else {
		const rows: [string, string][] = [
			["Establecimiento", e?.name ?? "—"],
			["Plan", plan?.name ?? "—"],
			["Próximo cobro", lifetime ? "De por vida" : end ? end.toLocaleDateString("es-DO") : "—"],
			["Total", plan ? formatMoney(plan.priceDop) : "—"],
		];
		body = (
			<>
				<h1 className="text-2xl font-extrabold">¡Pago recibido! Tu menú está activo</h1>
				<p className="text-[15px] text-muted-foreground">Tu código QR sigue siendo el mismo.</p>
				<dl className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5">
					{rows.map(([k, v]) => (
						<div key={k} className="flex justify-between gap-4">
							<dt className="text-sm text-muted-foreground">{k}</dt>
							<dd className="text-[15px] font-semibold">{v}</dd>
						</div>
					))}
				</dl>
				<Button onClick={goPanel}>Ir al panel</Button>
			</>
		);
	}

	return (
		<AuthLayout>
			<div className="flex flex-col gap-5 text-center sm:text-left">{body}</div>
		</AuthLayout>
	);
}

// Deja seleccionado el establecimiento que se intentó pagar antes de entrar al panel.
const goPanelSelect = (id: string | null) => () => {
	if (id) localStorage.setItem(PANEL_ESTABLISHMENT_KEY, id);
};
