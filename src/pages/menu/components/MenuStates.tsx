import { Link } from "react-router-dom";
import { MessageCircle, Phone, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { telHref, whatsappHref } from "@/lib/menu";
import type { DictionaryProps } from "@/types/Dictionary";
import type { EstablishmentProps } from "@/types/Establishment";

export const MenuSkeleton = () => (
	<div className="mx-auto min-h-screen max-w-[560px] bg-white" aria-busy="true">
		<Skeleton className="h-[200px] rounded-none" />
		<div className="flex flex-col gap-3 p-5">
			<Skeleton className="h-7 w-56" />
			<Skeleton className="h-4 w-64" />
			<div className="flex gap-2 py-2">
				{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
			</div>
			{[0, 1, 2].map((i) => <Skeleton key={i} className="h-[200px] rounded-[20px]" />)}
		</div>
	</div>
);

// Sin establecimiento cargado no se sabe si hay multi-idioma: texto en español.
export const MenuError = ({ retry }: { retry: () => void }) => (
	<div className="mx-auto flex min-h-screen max-w-[560px] flex-col items-center justify-center gap-4 p-8 text-center">
		<h1 className="font-display text-[26px] font-extrabold tracking-tight text-foreground">No pudimos cargar el menú</h1>
		<p className="text-[15px] leading-relaxed text-muted-foreground">Revisa tu conexión e inténtalo de nuevo.</p>
		<Button onClick={retry}>Reintentar</Button>
	</div>
);

export const MenuNotFound = ({ dictionary }: { dictionary: DictionaryProps }) => {
	const t = dictionary.menu;
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-crema p-8 text-center">
			<SearchX className="size-14 text-brand" aria-hidden="true" />
			<h1 className="font-display text-[28px] font-extrabold tracking-[-0.03em] text-foreground">{t.notFoundTitle}</h1>
			<p className="max-w-sm text-[15px] leading-relaxed text-cacao-2">{t.notFoundBody}</p>
			<Link
				to="/register"
				className="flex h-12 items-center justify-center rounded-full bg-brand px-[22px] font-bold text-white"
			>
				{t.notFoundCta}
			</Link>
			<Link to="/" className="flex min-h-11 items-center text-sm text-cacao-2">{t.goHome}</Link>
		</div>
	);
};

export const MenuUnavailable = ({ establishment, dictionary }: { establishment: EstablishmentProps; dictionary: DictionaryProps }) => {
	const t = dictionary.menu;
	const action = "flex h-12 items-center justify-center gap-2 rounded-[14px] border border-border bg-white font-semibold text-foreground";
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-8 text-center">
			<div className="flex size-24 items-center justify-center overflow-hidden rounded-full bg-white font-display font-extrabold text-brand shadow-lg">
				{establishment.logoUrl
					? <img src={establishment.logoUrl} alt="" className="size-full object-contain" />
					: establishment.name.charAt(0).toUpperCase()}
			</div>
			<h1 className="font-display text-[26px] font-extrabold tracking-tight text-foreground">{t.unavailableTitle}</h1>
			<p className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">{t.unavailableBody}</p>
			<div className="flex w-full max-w-sm flex-col gap-2.5">
				{establishment.whatsapp && (
					<a href={whatsappHref(establishment.whatsapp)} target="_blank" rel="noreferrer" className={action}>
						<MessageCircle className="size-4" aria-hidden="true" />{t.writeWhatsapp}
					</a>
				)}
				{establishment.phone && (
					<a href={telHref(establishment.phone)} className={action}>
						<Phone className="size-4" aria-hidden="true" />{t.callRestaurant}
					</a>
				)}
			</div>
		</div>
	);
};
