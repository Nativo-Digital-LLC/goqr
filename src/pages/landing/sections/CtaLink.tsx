import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";
import { ctaClass } from "./ctaClass";

export function CtaLink({
	to,
	variant = "primary",
	children,
	onClick,
	className,
}: {
	to: string;
	variant?: keyof typeof ctaClass;
	children: React.ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<Link to={to} onClick={onClick} className={cn(ctaClass[variant], className)}>
			{children}
		</Link>
	);
}
