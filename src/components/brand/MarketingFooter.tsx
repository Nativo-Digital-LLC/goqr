import { Link } from "react-router-dom";

import { Logo } from "./Logo";

const link =
	"rounded-md text-muted-foreground underline-offset-4 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2";

// Falta el enlace de WhatsApp: el artboard solo trae el placeholder "[YOUR WHATSAPP]".
export function MarketingFooter() {
	return (
		<footer className="border-t border-line">
			<div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 px-5 py-10 text-sm text-muted-foreground md:px-8">
				<div className="flex items-center gap-2.5">
					<Logo size={28} />
					<span>© 2026 GoQR</span>
				</div>
				<nav aria-label="Pie" className="flex flex-wrap gap-x-6 gap-y-2">
					<a href="mailto:contacto@goqr.com.do" className={link}>
						contacto@goqr.com.do
					</a>
					<Link to="/terms" className={link}>
						Términos y condiciones
					</Link>
					<Link to="/privacy-policies" className={link}>
						Política de privacidad
					</Link>
				</nav>
			</div>
		</footer>
	);
}

export default MarketingFooter;
