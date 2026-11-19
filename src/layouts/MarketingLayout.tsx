import { useEffect, type ReactNode } from "react";

import { MarketingFooter } from "@/components/brand/MarketingFooter";
import { MarketingHeader } from "@/components/brand/MarketingHeader";

export function MarketingLayout({ children }: { children: ReactNode }) {
	// Scroll suave para las anclas solo mientras el layout está montado.
	useEffect(() => {
		const el = document.documentElement;
		el.style.scrollBehavior = "smooth";
		return () => {
			el.style.scrollBehavior = "";
		};
	}, []);

	return (
		<div className="flex min-h-screen flex-col bg-crema font-sans text-primary">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<MarketingFooter />
		</div>
	);
}

export default MarketingLayout;
