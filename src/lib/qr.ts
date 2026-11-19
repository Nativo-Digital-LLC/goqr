import QRCode from "qrcode";

export const menuUrl = (slug: string) => `https://goqr.com.do/m/${slug}`;
export const qrSrc = (slug: string) => `${menuUrl(slug)}?src=qr`;

export async function downloadQrPng(slug: string, filename: string) {
	const url = await QRCode.toDataURL(qrSrc(slug), {
		width: 1024,
		margin: 2,
		color: { dark: "#2A1410", light: "#FFFFFF" },
	});
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
}
