import { ExternalLink } from "lucide-react";

export function MenuPreview({ domain, reloadKey }: { domain: string; reloadKey: number }) {
	return (
		<aside className="hidden flex-col items-center gap-3 lg:flex">
			<div className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
				<span className="size-2 rounded-full bg-success" aria-hidden />
				En vivo
			</div>
			<div className="w-full max-w-[300px] rounded-[36px] border-[6px] border-foreground bg-card p-1">
				<iframe
					key={reloadKey}
					src={`/m/${domain}`}
					title="Vista previa del menú"
					className="h-[560px] w-full rounded-[28px] bg-background"
				/>
			</div>
			<a
				href={`/m/${domain}`}
				target="_blank"
				rel="noreferrer"
				className="flex items-center gap-1.5 text-sm font-semibold hover:text-brand"
			>
				Abrir en una pestaña nueva <ExternalLink size={16} />
			</a>
		</aside>
	);
}
