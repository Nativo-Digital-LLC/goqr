import { collection, getDocs } from "firebase/firestore";
import { ArrowRight, Copy, Download, MessageCircle } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Collection } from "@/constants/Collections";
import { downloadQrPng, menuUrl, qrSrc } from "@/lib/qr";
import { getEstablishmentsByUserId } from "@/services/establishments";
import { getAllProducts } from "@/services/products";
import { EstablishmentProps } from "@/types/Establishment";
import { ProductProps } from "@/types/Product";
import { db } from "@/utils/firebase";
import { MenuPreview } from "./MenuPreview";

const focus = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
const dateFmt = new Intl.DateTimeFormat("es-DO", { day: "numeric", month: "long" });

export function StepDone({ establishment }: { establishment: EstablishmentProps | null }) {
	const [est, setEst] = useState(establishment);
	const [qr, setQr] = useState("");
	const [qrError, setQrError] = useState(false);
	const [qrTry, setQrTry] = useState(0);
	const [category, setCategory] = useState<string>();
	const [product, setProduct] = useState<ProductProps>();
	const slug = est?.domain ?? "";
	const url = menuUrl(slug);

	// El trigger que escribe billing.trialEndsAt puede tardar: se relee una vez al montar.
	useEffect(() => {
		const uid = establishment?.userId;
		if (!uid) return;
		getEstablishmentsByUserId(uid).then((r) => r[0] && setEst(r[0])).catch(() => {});
	}, [establishment?.userId]);

	useEffect(() => {
		if (!establishment) return;
		getAllProducts(establishment.id)
			.then(async (list) => {
				const p = list[0];
				if (!p) return;
				setProduct(p);
				const cats = await getDocs(collection(db, Collection.Establishments, establishment.id, "categories"));
				const c = cats.docs.find((d) => d.id === p.categoryId)?.data();
				setCategory(c?.es_name);
			})
			.catch(() => {});
	}, [establishment]);

	useEffect(() => {
		if (!slug) return;
		setQrError(false);
		QRCode.toDataURL(qrSrc(slug), { width: 480, margin: 2, color: { dark: "#2A1410", light: "#FFFFFF" } })
			.then(setQr)
			.catch(() => setQrError(true));
	}, [slug, qrTry]);

	const trialEnd = est?.billing?.trialEndsAt;
	const trialText = trialEnd ? `el ${dateFmt.format(trialEnd.toDate())}` : "en 30 días";
	const price = product?.prices?.[0]?.price;

	async function copy() {
		try {
			await navigator.clipboard.writeText(url);
			toast.success("Enlace copiado");
		} catch {
			toast.error("No pudimos copiar el enlace. Cópialo manualmente.");
		}
	}

	return (
		<>
			<section className="flex min-w-0 max-w-[600px] flex-[999_1_480px] flex-col gap-6">
				<div className="flex flex-col gap-2">
					<span className="w-fit rounded-full bg-accent px-3 py-1 text-[13px] font-semibold text-primary">Menú publicado</span>
					<h1 className="font-display text-[28px] font-bold tracking-[-0.02em] sm:text-4xl">¡Tu menú ya está en línea!</h1>
					<p className="text-base text-muted-foreground">
						Imprime el QR y ponlo en tus mesas. Cada cambio que hagas en el panel se ve al momento, sin volver a imprimir.
					</p>
				</div>
				<div className="flex flex-wrap items-center gap-6 rounded-2xl border border-border bg-white p-5">
					{qrError ? (
						<div role="alert" className="flex size-40 shrink-0 flex-col items-center justify-center gap-2 rounded-xl bg-muted p-3 text-center">
							<span className="text-sm text-muted-foreground">No pudimos generar el QR.</span>
							<Button type="button" size="sm" className={`h-11 rounded-xl ${focus}`} onClick={() => setQrTry((n) => n + 1)}>
								Reintentar
							</Button>
						</div>
					) : (
						qr && <img src={qr} alt={`Código QR de ${url}`} className="size-40 shrink-0" />
					)}
					<div className="flex min-w-[200px] flex-1 flex-col gap-3">
						<span className="text-sm text-muted-foreground">Escanea para ver el menú</span>
						<Button variant="outline" className={`h-11 rounded-xl border-border bg-white ${focus}`} onClick={() => downloadQrPng(slug, `qr-${slug}.png`).catch(() => toast.error("No pudimos generar el PNG."))}>
							<Download aria-hidden="true" />
							Descargar PNG
						</Button>
						<Button asChild variant="outline" className={`h-11 rounded-xl border-border bg-white ${focus}`}>
							<a href={`https://wa.me/?text=${encodeURIComponent(`Mira nuestro menú digital: ${url}`)}`} target="_blank" rel="noreferrer">
								<MessageCircle aria-hidden="true" />
								Compartir por WhatsApp
							</a>
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-semibold">Enlace de tu menú</span>
					<div className="flex items-center gap-2">
						<span className="h-11 min-w-0 flex-1 truncate rounded-xl border border-border bg-muted px-3 text-[15px] leading-[42px]">{url.replace("https://", "")}</span>
						<Button type="button" variant="outline" className={`h-11 rounded-xl border-border bg-white ${focus}`} onClick={copy}>
							<Copy aria-hidden="true" />
							Copiar
						</Button>
					</div>
				</div>
				<p className="text-[15px] text-muted-foreground">
					Tu prueba gratis termina {trialText}. No necesitas tarjeta hasta entonces.{" "}
					<Link to="/dashboard/invoices" className={`font-semibold text-primary underline ${focus}`}>
						Ver planes
					</Link>
				</p>
				<Button asChild className={`h-11 w-fit rounded-xl px-7 text-[15px] ${focus}`}>
					<Link to="/dashboard">
						Ir a mi panel y completar el menú
						<ArrowRight aria-hidden="true" />
					</Link>
				</Button>
			</section>
			<aside className="flex flex-[1_1_300px] flex-col items-center gap-3">
				<MenuPreview
					name={est?.name ?? ""}
					type={est?.type ?? undefined}
					slug={slug}
					logoUrl={est?.logoUrl}
					bannerUrl={est?.bannerUrl}
					color={est?.mainHexColor}
					exactColor={est?.exactColor}
					category={category}
					product={product ? { name: product.es_name, price: price ?? "", description: product.es_description ?? undefined, photoUrl: product.photoUrl } : undefined}
				/>
			</aside>
		</>
	);
}
