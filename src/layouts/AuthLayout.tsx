import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { Logo } from "@/components/brand/Logo";

type AuthLayoutProps = {
	children: ReactNode;
	/** Contenido del panel de marca. Si se pasa, la página va dividida; si no, centrada. */
	aside?: ReactNode;
	className?: string;
	/** Estilo del panel lateral: tomate (por defecto) o crema. */
	asideTone?: "brand" | "crema";
};

export function AuthLayout({ children, aside, className, asideTone = "brand" }: AuthLayoutProps) {
	if (aside) {
		const crema = asideTone === "crema";
		return (
			<div className="flex min-h-screen flex-col bg-white font-sans text-primary lg:flex-row">
				<aside
					className={cn(
						"hidden flex-1 flex-col justify-between gap-10 p-12 lg:flex",
						crema ? "bg-crema text-primary" : "bg-brand text-crema"
					)}
				>
					<Link
						to="/"
						aria-label="GoQR, ir al inicio"
						className={cn(
							"inline-flex w-fit rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
							crema ? "text-primary" : "text-crema"
						)}
					>
						{/* Logo invertido en el panel tomate */}
						<span className="inline-flex items-center gap-3">
							<svg width="40" height="40" viewBox="0 0 64 64" aria-hidden="true">
								<circle cx="32" cy="32" r="30" fill={crema ? "#C2381F" : "#FFF3E6"} />
								<rect x="18" y="18" width="18" height="18" rx="5" fill="none" stroke={crema ? "#FFF3E6" : "#C2381F"} strokeWidth="5" />
								<circle cx="43" cy="43" r="6" fill="#FFC53D" />
							</svg>
							<span className="font-display text-3xl font-extrabold leading-none tracking-[-0.04em]">goqr</span>
						</span>
					</Link>
					{aside}
					<span className={cn("text-sm", crema ? "text-cacao-2" : "text-crema")}>¿Dudas? Escríbenos a contacto@goqr.com.do</span>
				</aside>
				<main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-10 lg:px-12 lg:py-12">
					<Link
						to="/"
						aria-label="GoQR, ir al inicio"
						className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary lg:hidden"
					>
						<Logo />
					</Link>
					<div className={cn("w-full max-w-[400px]", className)}>{children}</div>
				</main>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col items-center gap-12 bg-background px-6 py-10 font-sans text-primary">
			<Link
				to="/"
				aria-label="GoQR, ir al inicio"
				className="rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
			>
				<Logo size={36} />
			</Link>
			<main className={cn("w-full max-w-[440px]", className)}>{children}</main>
		</div>
	);
}

export default AuthLayout;
