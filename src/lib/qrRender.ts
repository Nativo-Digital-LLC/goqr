import QRCode from "qrcode";

import { contrastRatio } from "./color";
import { qrSrc } from "./qr";

export type TemplateKind = "qr" | "table" | "sticker" | "poster";
export type TemplateOpts = {
	slug: string;
	name: string;
	color: string;
	frameText: string;
	logoUrl: string | null;
	withLogo: boolean;
	/** Se llama si el logo no se pudo cargar; la plantilla se dibuja sin él. */
	onLogoError?: () => void;
};

const WHITE = "#FFFFFF";
const INK = "#2A1410";
const MUTED = "#6B5A54";

export const isScannableColor = (hex: string) => contrastRatio(hex, WHITE) >= 4.5;

export const qrSvg = (slug: string, color: string) =>
	QRCode.toString(qrSrc(slug), {
		type: "svg",
		margin: 2,
		color: { dark: color, light: WHITE },
		errorCorrectionLevel: "H",
	});

// ppp 300: px = cm / 2.54 * 300
const TEMPLATES: Record<TemplateKind, { w: number; h: number; qr: number; title: number; name: number; url: number; circle?: boolean }> = {
	qr: { w: 1200, h: 1500, qr: 800, title: 72, name: 44, url: 38 },
	table: { w: 1181, h: 1772, qr: 800, title: 80, name: 52, url: 40 },
	sticker: { w: 945, h: 945, qr: 440, title: 56, name: 38, url: 30, circle: true },
	poster: { w: 2480, h: 3508, qr: 1500, title: 170, name: 110, url: 84 },
};

function loadLogo(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => resolve(img);
		img.onerror = () => reject(new Error("logo"));
		img.src = url;
	});
}

function fontFamily() {
	const loaded = Array.from(document.fonts).some((f) => f.family.replace(/"/g, "") === "Bricolage Grotesque" && f.status === "loaded");
	return loaded ? '"Bricolage Grotesque", sans-serif' : "sans-serif";
}

function text(ctx: CanvasRenderingContext2D, value: string, y: number, size: number, weight: number, color: string, family: string, maxW: number) {
	let s = size;
	ctx.font = `${weight} ${s}px ${family}`;
	while (s > 12 && ctx.measureText(value).width > maxW) {
		s -= 2;
		ctx.font = `${weight} ${s}px ${family}`;
	}
	ctx.fillStyle = color;
	ctx.fillText(value, 0, y);
}

export async function renderTemplate(kind: TemplateKind, opts: TemplateOpts): Promise<HTMLCanvasElement> {
	await document.fonts.ready;
	const t = TEMPLATES[kind];
	const family = fontFamily();

	const qrCanvas = document.createElement("canvas");
	await QRCode.toCanvas(qrCanvas, qrSrc(opts.slug), {
		width: t.qr,
		margin: 2,
		color: { dark: opts.color, light: WHITE },
		errorCorrectionLevel: "H",
	});

	let logo: HTMLImageElement | null = null;
	if (opts.withLogo && opts.logoUrl) {
		try {
			logo = await loadLogo(opts.logoUrl);
		} catch {
			opts.onLogoError?.();
		}
	}

	const canvas = document.createElement("canvas");
	canvas.width = t.w;
	canvas.height = t.h;
	const ctx = canvas.getContext("2d")!;
	ctx.fillStyle = WHITE;
	if (t.circle) {
		ctx.beginPath();
		ctx.arc(t.w / 2, t.h / 2, t.w / 2, 0, Math.PI * 2);
		ctx.fill();
	} else ctx.fillRect(0, 0, t.w, t.h);

	// Marco
	const inset = Math.round(t.w * 0.03);
	ctx.strokeStyle = opts.color;
	ctx.lineWidth = Math.round(t.w * 0.006);
	ctx.beginPath();
	if (t.circle) ctx.arc(t.w / 2, t.h / 2, t.w / 2 - inset, 0, Math.PI * 2);
	else ctx.roundRect(inset, inset, t.w - inset * 2, t.h - inset * 2, t.w * 0.04);
	ctx.stroke();

	// Bloque centrado: título, QR, nombre, enlace
	const gap = t.qr * 0.06;
	const total = t.title + gap + t.qr + gap + t.name + gap / 2 + t.url;
	let y = (t.h - total) / 2;
	const maxW = t.circle ? t.qr * 1.1 : t.w * 0.8;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";
	ctx.save();
	ctx.translate(t.w / 2, 0);
	text(ctx, opts.frameText, y, t.title, 700, opts.color, family, maxW);
	y += t.title + gap;
	const qx = (t.w - t.qr) / 2;
	ctx.restore();
	ctx.drawImage(qrCanvas, qx, y, t.qr, t.qr);

	if (logo) {
		const box = t.qr * 0.22;
		const pad = box * 0.12;
		const cx = t.w / 2;
		const cy = y + t.qr / 2;
		ctx.fillStyle = WHITE;
		ctx.fillRect(cx - box / 2, cy - box / 2, box, box);
		const inner = box - pad * 2;
		const k = Math.min(inner / logo.width, inner / logo.height);
		ctx.drawImage(logo, cx - (logo.width * k) / 2, cy - (logo.height * k) / 2, logo.width * k, logo.height * k);
	}

	y += t.qr + gap;
	ctx.save();
	ctx.translate(t.w / 2, 0);
	text(ctx, opts.name, y, t.name, 700, INK, family, maxW);
	y += t.name + gap / 2;
	text(ctx, `goqr.com.do/m/${opts.slug}`, y, t.url, 500, MUTED, "sans-serif", maxW);
	ctx.restore();
	return canvas;
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/png");
	a.download = filename;
	a.click();
}
