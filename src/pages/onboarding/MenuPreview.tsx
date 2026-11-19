import { EstablishmentType } from "@/types/Establishment";

export const TYPE_LABELS: Record<EstablishmentType, string> = {
	restaurant: "Restaurante",
	cafe: "Cafetería",
	bar: "Bar",
	hotel: "Hotel",
	other: "Otro",
};

type MenuPreviewProps = {
	name: string;
	type?: EstablishmentType;
	phone?: string;
	slug: string;
	logoUrl?: string | null;
	bannerUrl?: string | null;
	color?: string;
	category?: string;
	product?: { name: string; price: string | number; description?: string; photoUrl?: string | null };
};

export function MenuPreview({ name, type, phone, slug, logoUrl, bannerUrl, color, category, product }: MenuPreviewProps) {
	const subtitle = [type && TYPE_LABELS[type], phone].filter(Boolean).join(" · ");
	return (
		<div className="w-[300px] rounded-[40px] bg-primary p-2.5 shadow-[0_24px_48px_rgba(42,20,16,0.18)]">
			<div className="min-h-[540px] overflow-hidden rounded-[32px] bg-white">
				<div className="flex h-[130px] items-center justify-center bg-border">
					{bannerUrl ? (
						<img src={bannerUrl} alt="" className="size-full object-cover" />
					) : (
						<span className="text-xs text-muted-foreground">Tu banner irá aquí</span>
					)}
				</div>
				<div className="flex flex-col gap-3 p-[18px]">
					<div className="-mt-[46px] size-14 overflow-hidden rounded-2xl bg-muted ring-4 ring-white">
						{logoUrl && <img src={logoUrl} alt="" className="size-full object-cover" />}
					</div>
					<span className="font-display text-[22px] font-bold">{name || "Tu negocio"}</span>
					{subtitle && <span className="text-xs text-muted-foreground">{subtitle}</span>}
					<div className="flex gap-1.5">
						{category ? (
							<span
								className="rounded-full px-3 py-1 text-xs font-semibold text-white"
								style={{ background: color || "#2A1410" }}
							>
								{category}
							</span>
						) : (
							<>
								<span className="h-[26px] w-[70px] rounded-full bg-border" />
								<span className="h-[26px] w-[70px] rounded-full bg-muted" />
								<span className="h-[26px] w-[70px] rounded-full bg-muted" />
							</>
						)}
					</div>
					{product ? (
						<div className="flex gap-3 rounded-[14px] bg-muted p-3">
							{product.photoUrl && <img src={product.photoUrl} alt="" className="size-14 rounded-xl object-cover" />}
							<div className="flex min-w-0 flex-col gap-0.5">
								<span className="text-sm font-semibold">{product.name}</span>
								{product.description && <span className="text-xs text-muted-foreground">{product.description}</span>}
								<span className="text-sm font-bold">RD$ {product.price}</span>
							</div>
						</div>
					) : (
						<>
							<div className="h-16 rounded-[14px] bg-muted" />
							<div className="h-16 rounded-[14px] bg-muted" />
						</>
					)}
					<span className="text-center text-xs text-powered">goqr.com.do/m/{slug || "tu-negocio"}</span>
				</div>
			</div>
		</div>
	);
}

export default MenuPreview;
