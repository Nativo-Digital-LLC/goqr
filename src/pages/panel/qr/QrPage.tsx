import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Download, MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { menuUrl } from "@/lib/qr";
import { downloadCanvas, isScannableColor, qrSvg, renderTemplate, type TemplateKind } from "@/lib/qrRender";
import { usePanel } from "../PanelContext";
import { PanelHeader } from "../components/PanelHeader";

const DEFAULT_COLOR = "#2A1410";
const SWATCHES = [
	{ hex: DEFAULT_COLOR, label: "Cacao" },
	{ hex: "#000000", label: "Negro" },
	{ hex: "#8A3A10", label: "Naranja oscuro" },
	{ hex: "#1F2E4D", label: "Azul marino" },
];
const TEMPLATES: { kind: TemplateKind; file: string; title: string; hint: string }[] = [
	{ kind: "table", file: "mesa", title: "Tarjeta de mesa", hint: "10 × 15 cm, doblada" },
	{ kind: "sticker", file: "sticker", title: "Sticker", hint: "Redondo, 8 cm" },
	{ kind: "poster", file: "poster", title: "Póster", hint: "Carta o A4, para la entrada" },
];

const card = "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6";
const outline = "bg-card border border-border";

export default function QrPage() {
	const { establishment: e } = usePanel();
	const [color, setColor] = useState(DEFAULT_COLOR);
	const [badColor, setBadColor] = useState(false);
	const [frameText, setFrameText] = useState("Escanea para ver el menú");
	const [withLogo, setWithLogo] = useState(!!e.logoUrl);
	const [svg, setSvg] = useState("");
	const [svgError, setSvgError] = useState(false);
	const [busy, setBusy] = useState(false);
	const [, bump] = useState(0);

	useEffect(() => {
		let off = false;
		setSvg("");
		setSvgError(false);
		qrSvg(e.domain, color)
			.then((s) => !off && setSvg(s))
			.catch(() => !off && setSvgError(true));
		return () => {
			off = true;
		};
	}, [e.domain, color]);

	const mark = (key: string) => {
		localStorage.setItem(`goqr:${key}:${e.id}`, "1");
		bump((n) => n + 1);
	};
	const pickColor = (hex: string) => {
		const ok = isScannableColor(hex);
		setBadColor(!ok);
		if (ok) setColor(hex);
	};
	const render = (kind: TemplateKind) =>
		renderTemplate(kind, {
			slug: e.domain,
			name: e.name,
			color,
			frameText,
			logoUrl: e.logoUrl,
			withLogo,
			onLogoError: () => toast.error("No pudimos usar tu logo. Descargamos el QR sin él."),
		});
	const run = async (fn: () => Promise<void>) => {
		setBusy(true);
		try {
			await fn();
		} catch {
			toast.error("No pudimos descargar el QR. Intenta de nuevo.");
		} finally {
			setBusy(false);
		}
	};
	const downloadPng = (kind: TemplateKind, suffix: string) =>
		run(async () => {
			downloadCanvas(await render(kind), `goqr-${e.domain}${suffix}.png`);
			mark("qr-downloaded");
		});
	const downloadSvg = () =>
		run(async () => {
			const url = URL.createObjectURL(new Blob([await qrSvg(e.domain, color)], { type: "image/svg+xml" }));
			const a = document.createElement("a");
			a.href = url;
			a.download = `goqr-${e.domain}.svg`;
			a.click();
			URL.revokeObjectURL(url);
			mark("qr-downloaded");
		});
	const printPdf = () => {
		const w = window.open("", "_blank"); // síncrono para que no lo bloquee el navegador
		if (!w) {
			toast.error("Permite las ventanas emergentes para imprimir.");
			return;
		}
		run(async () => {
			try {
				const src = (await render("qr")).toDataURL("image/png");
				const d = w.document;
				d.title = `goqr-${e.domain}`;
				const style = d.createElement("style");
				style.textContent = "@page{margin:0}body{margin:0;text-align:center}img{width:16cm;max-width:100%}";
				const img = d.createElement("img");
				img.src = src;
				d.head.append(style);
				d.body.append(img);
				const go = () => w.print();
				if (img.complete) go();
				else img.onload = go;
				mark("qr-downloaded");
			} catch (err) {
				w.close();
				throw err;
			}
		});
	};
	const copy = async () => {
		try {
			await navigator.clipboard.writeText(menuUrl(e.domain));
			mark("link-copied");
			toast.success("Enlace copiado");
		} catch {
			toast.error("No pudimos copiar el enlace. Intenta de nuevo.");
		}
	};

	const shownLogo = withLogo && e.logoUrl;

	return (
		<>
			<PanelHeader title="Código QR" description="Imprímelo una vez. Aunque edites el menú, el QR sigue siendo el mismo." />

			<div className="mt-6 flex flex-wrap items-start gap-6">
				<section aria-label="Vista previa del QR" className="flex flex-[1_1_380px] flex-col items-center gap-5 rounded-2xl border border-border bg-card p-8">
					<div className="flex flex-col items-center gap-3.5 rounded-3xl border-2 bg-white px-6 pb-4.5 pt-6" style={{ borderColor: color }}>
						<div className="relative size-[260px]">
							{svgError && <span className="flex size-full items-center justify-center text-center text-sm text-muted-foreground">No pudimos generar el QR. Intenta de nuevo.</span>}
							{svg && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt={`Código QR de ${e.name}`} className="size-full" />}
							{shownLogo && (
								<img src={e.logoUrl!} alt="" className="absolute left-1/2 top-1/2 size-[22%] -translate-x-1/2 -translate-y-1/2 bg-white object-contain p-[3px]" />
							)}
						</div>
						<span className="max-w-[260px] text-center font-display text-xl font-bold tracking-[-0.01em]">{frameText}</span>
						<span className="text-[13px] text-muted-foreground">{e.name}</span>
					</div>
					<span className="text-sm text-muted-foreground">goqr.com.do/m/{e.domain}</span>
					<div className="flex flex-wrap justify-center gap-2">
						<Button disabled={busy} onClick={() => downloadPng("qr", "")}><Download size={18} />Descargar PNG</Button>
						<Button variant="outline" className={outline} disabled={busy} onClick={downloadSvg}>SVG</Button>
						<Button variant="outline" className={outline} disabled={busy} onClick={printPdf}>PDF para imprimir</Button>
					</div>
				</section>

				<div className="flex min-w-0 flex-[999_1_420px] flex-col gap-6">
					<section aria-labelledby="h-custom" className={card}>
						<h2 id="h-custom" className="text-lg font-bold">Personaliza</h2>
						<label className="flex cursor-pointer items-center justify-between gap-4 rounded-[14px] border border-border px-4 py-3.5">
							<span className="flex flex-col gap-0.5">
								<span className="text-[15px] font-semibold">Logo al centro</span>
								<span className="text-[13px] text-muted-foreground">Usa el logo de tu establecimiento.</span>
							</span>
							<Switch checked={!!e.logoUrl && withLogo} disabled={!e.logoUrl} onCheckedChange={setWithLogo} />
						</label>
						<div className="flex flex-col gap-2">
							<span className="text-sm font-semibold">Color del código</span>
							<div className="flex flex-wrap items-center gap-2.5">
								{SWATCHES.map((s) => (
									<button
										key={s.hex}
										type="button"
										aria-label={color === s.hex ? `${s.label}, seleccionado` : s.label}
										aria-pressed={color === s.hex}
										onClick={() => pickColor(s.hex)}
										className="size-10 rounded-full"
										style={{ background: s.hex, boxShadow: color === s.hex ? `0 0 0 3px #fff, 0 0 0 5px ${s.hex}` : undefined }}
									/>
								))}
								<input type="color" aria-label="Otro color" value={color} onChange={(ev) => pickColor(ev.target.value)} className="size-10 cursor-pointer rounded-full border border-border bg-card p-0.5" />
							</div>
							<span className={`text-[13px] ${badColor ? "text-destructive" : "text-muted-foreground"}`}>Solo colores oscuros, para que cualquier teléfono lo lea.</span>
						</div>
						<label className="flex flex-col gap-1.5">
							<span className="text-sm font-semibold">Texto del marco</span>
							<input
								value={frameText}
								maxLength={40}
								onChange={(ev) => setFrameText(ev.target.value)}
								className="h-11 rounded-xl border border-input bg-card px-3.5 text-[15px] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
							/>
						</label>
					</section>

					<section aria-labelledby="h-print" className={card}>
						<div className="flex flex-col gap-1">
							<h2 id="h-print" className="text-lg font-bold">Plantillas para imprimir</h2>
							<span className="text-sm text-muted-foreground">Listas con tu QR, tu logo y tus colores.</span>
						</div>
						<div className="grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-4">
							{TEMPLATES.map((t) => (
								<div key={t.kind} className="flex flex-col gap-2.5">
									<div className="flex h-[180px] items-center justify-center rounded-[14px] bg-muted">
										<div
											className={`flex flex-col items-center justify-center gap-1.5 bg-white shadow-md ${t.kind === "sticker" ? "size-[110px] rounded-full" : t.kind === "table" ? "h-[120px] w-[100px] rounded-lg" : "h-[140px] w-[100px] rounded"}`}
										>
											<div className="size-14 rounded" style={{ background: color }} />
											<div className="h-1.5 w-12 rounded-full bg-brand" />
										</div>
									</div>
									<span className="text-[15px] font-semibold">{t.title}</span>
									<span className="-mt-1.5 text-[13px] text-muted-foreground">{t.hint}</span>
									<Button variant="outline" className={outline} disabled={busy} onClick={() => downloadPng(t.kind, `-${t.file}`)}>Descargar</Button>
								</div>
							))}
						</div>
					</section>

					<section aria-labelledby="h-share" className={card}>
						<h2 id="h-share" className="text-lg font-bold">Comparte tu menú</h2>
						<div className="flex gap-2">
							<label htmlFor="share-url" className="sr-only">Enlace del menú</label>
							<input id="share-url" readOnly value={`goqr.com.do/m/${e.domain}`} className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-muted px-3.5 text-[15px] font-medium" />
							<Button variant="outline" className={outline} onClick={copy}>Copiar</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button asChild variant="outline" className={outline}>
								<a href={`https://wa.me/?text=${encodeURIComponent(menuUrl(e.domain))}`} target="_blank" rel="noreferrer"><MessageCircle size={18} />Enviar por WhatsApp</a>
							</Button>
							<Button variant="outline" className={outline} onClick={copy}>Para tu bio de Instagram</Button>
						</div>
						<span className="text-[13px] text-muted-foreground">El QR nunca cambia aunque edites el menú. Imprímelo una sola vez.</span>
					</section>
				</div>
			</div>
		</>
	);
}
