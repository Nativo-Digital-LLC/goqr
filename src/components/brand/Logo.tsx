import { cn } from "@/lib/utils";

type LogoProps = {
	size?: number;
	withWordmark?: boolean;
	className?: string;
};

export function Logo({ size = 36, withWordmark = true, className }: LogoProps) {
	return (
		<span className={cn("inline-flex items-center gap-2.5 text-primary", className)}>
			<svg
				width={size}
				height={size}
				viewBox="0 0 64 64"
				role={withWordmark ? undefined : "img"}
				aria-label={withWordmark ? undefined : "GoQR"}
				aria-hidden={withWordmark ? true : undefined}
			>
				<circle cx="32" cy="32" r="30" fill="#C2381F" />
				<rect x="18" y="18" width="18" height="18" rx="5" fill="none" stroke="#FFF3E6" strokeWidth="5" />
				<circle cx="43" cy="43" r="6" fill="#FFC53D" />
			</svg>
			{withWordmark && (
				<span
					className="font-display font-extrabold tracking-[-0.04em] leading-none"
					style={{ fontSize: size * 0.78 }}
				>
					goqr
				</span>
			)}
		</span>
	);
}

export default Logo;
