import { Link } from "react-router-dom";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/menu";
import { ProductStatus, type ProductProps } from "@/types/Product";

const STATUS = {
	[ProductStatus.Visible]: { label: "Visible", variant: "secondary" },
	[ProductStatus.NotAvailable]: { label: "Agotado", variant: "outline" },
	[ProductStatus.Hidden]: { label: "Oculto", variant: "outline" },
} as const;

function priceText(p: ProductProps) {
	const prices = (p.prices ?? []).map((x) => x.price);
	if (prices.length === 0) return "";
	const min = formatPrice(Math.min(...prices), "es");
	return prices.length > 1 ? `desde ${min}` : min;
}

export function ProductRows({
	products,
	reordering,
	busy,
	onMove,
	onDelete,
}: {
	products: ProductProps[];
	reordering: boolean;
	busy: boolean;
	onMove: (index: number, delta: -1 | 1) => void;
	onDelete: (p: ProductProps) => void;
}) {
	return (
		<ul className="flex flex-col">
			{products.map((p, i) => {
				const status = STATUS[p.status] ?? STATUS[ProductStatus.Visible];
				return (
					<li key={p.id} className="flex items-center gap-2 border-b border-border py-2 last:border-0">
						<Link to={`/dashboard/menu/product/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3 rounded-xl py-1 hover:bg-secondary/60">
							{p.photoUrl
								? <img src={p.photoUrl} alt="" className="size-12 shrink-0 rounded-lg object-cover" />
								: <span className="size-12 shrink-0 rounded-lg bg-secondary" aria-hidden />}
							<span className="flex min-w-0 flex-1 flex-col">
								<span className="truncate text-[15px] font-semibold">{p.es_name}</span>
								<span className={`truncate text-[13px] ${p.en_name ? "text-muted-foreground" : "text-warning"}`}>
									{p.en_name ? "ES · EN" : "Falta inglés"}
								</span>
							</span>
							<span className="text-[15px] font-semibold">{priceText(p)}</span>
							<Badge variant={status.variant}>{status.label}</Badge>
						</Link>
						{reordering ? (
							<div className="flex">
								<Button variant="ghost" size="icon" aria-label={`Subir ${p.es_name}`} disabled={i === 0} onClick={() => onMove(i, -1)}><ArrowUp /></Button>
								<Button variant="ghost" size="icon" aria-label={`Bajar ${p.es_name}`} disabled={i === products.length - 1} onClick={() => onMove(i, 1)}><ArrowDown /></Button>
							</div>
						) : (
							<Button variant="ghost" size="icon" aria-label={`Eliminar ${p.es_name}`} disabled={busy} onClick={() => onDelete(p)}><Trash2 /></Button>
						)}
					</li>
				);
			})}
		</ul>
	);
}
