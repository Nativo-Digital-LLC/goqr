import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check, Circle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMenuEditor } from "@/hooks/useMenuEditor";
import { setupChecklist, trialDaysLeft } from "@/lib/panel";
import { downloadQrPng, menuUrl } from "@/lib/qr";
import { usePanel } from "./PanelContext";
import { PanelHeader } from "./components/PanelHeader";

export default function HomePage() {
	const { establishment: e } = usePanel();
	const { products, loading, error, reload } = useMenuEditor(e.id);
	const [, bump] = useState(0);

	const days = e.billing?.status === "trialing" ? trialDaysLeft(e.billing.trialEndsAt, new Date()) : null;
	const steps = setupChecklist(e, products.length);
	const done = Object.values(steps).filter(Boolean).length;

	const mark = (key: string) => {
		localStorage.setItem(`goqr:${key}:${e.id}`, "1");
		bump((n) => n + 1);
	};
	const downloadQr = async () => {
		try {
			await downloadQrPng(e.domain, `qr-${e.domain}.png`);
			mark("qr-downloaded");
		} catch {
			toast.error("No pudimos descargar el QR. Intenta de nuevo.");
		}
	};
	const copyLink = async () => {
		try {
			await navigator.clipboard.writeText(menuUrl(e.domain));
			mark("link-copied");
			toast.success("Enlace copiado");
		} catch {
			toast.error("No pudimos copiar el enlace. Intenta de nuevo.");
		}
	};

	const items = [
		{ done: steps.brand, label: "Sube tu logo y tu banner", action: <Button asChild variant="outline"><Link to="/dashboard/establishment">Subir</Link></Button> },
		{ done: steps.products, label: `Agrega al menos 5 productos (${Math.min(products.length, 5)} de 5)`, action: <Button asChild variant="outline"><Link to="/dashboard/menu/product/new">Agregar</Link></Button> },
		{ done: steps.qr, label: "Imprime tu código QR", action: <Button variant="outline" onClick={downloadQr}>Descargar</Button> },
		{ done: steps.share, label: "Comparte el enlace en tu Instagram", action: <Button variant="outline" onClick={copyLink}>Copiar enlace</Button> },
	];

	return (
		<>
			<PanelHeader title="Resumen" description="Lo que falta para dejar tu menú listo." />

			{days !== null && (
				<div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-warning-bg px-5 py-4">
					<div className="flex flex-col gap-0.5">
						<span className="text-[15px] font-bold">
							{days === 0 ? "Tu prueba terminó" : `Te quedan ${days} ${days === 1 ? "día" : "días"} de prueba`}
						</span>
						<span className="text-sm text-muted-foreground">Elige un plan para que tu menú siga visible cuando termine la prueba.</span>
					</div>
					<Button asChild><Link to="/dashboard/billing">Elegir plan</Link></Button>
				</div>
			)}

			{error && !loading && (
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-5 py-4">
					<span className="text-[15px] text-muted-foreground">No pudimos cargar tu progreso.</span>
					<Button variant="outline" onClick={() => reload()}>Reintentar</Button>
				</div>
			)}

			{!loading && !error && done < 4 && (
				<section aria-labelledby="checklist" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
					<div className="flex items-center justify-between">
						<h2 id="checklist" className="text-lg font-bold">Deja tu menú listo</h2>
						<span className="text-sm font-semibold text-muted-foreground">{done} de 4</span>
					</div>
					<ul className="flex flex-col">
						{items.map((it) => (
							<li key={it.label} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
								{it.done ? <Check size={20} className="text-success" aria-label="Hecho" /> : <Circle size={20} className="text-muted-foreground" aria-hidden />}
								<span className={`flex-1 text-[15px] ${it.done ? "text-muted-foreground line-through" : "font-semibold"}`}>{it.label}</span>
								{!it.done && it.action}
							</li>
						))}
					</ul>
				</section>
			)}

			<section aria-labelledby="tu-menu" className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<h2 id="tu-menu" className="text-lg font-bold">Tu menú</h2>
					<span className="rounded-full bg-secondary px-3 py-1 text-[13px] font-semibold">
						{e.isActive === false ? "No visible" : "Publicado"}
					</span>
				</div>
				<span className="break-all text-[15px] font-semibold text-brand">{menuUrl(e.domain)}</span>
				<p className="text-sm text-muted-foreground">Lo que cambies aquí se ve al instante en el menú. No tienes que reimprimir el QR.</p>
				<div className="flex flex-wrap gap-3">
					<Button asChild><Link to="/dashboard/menu">Editar menú</Link></Button>
					<Button variant="outline" onClick={downloadQr}>Descargar QR</Button>
					<Button asChild variant="outline"><a href={`/m/${e.domain}`} target="_blank" rel="noreferrer">Ver menú</a></Button>
				</div>
			</section>
		</>
	);
}
