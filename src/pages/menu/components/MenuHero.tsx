import { Link2, MapPin, MessageCircle, Phone, Star, ExternalLink } from "lucide-react";

import { descriptionLines, openStatus, reviewHref, socialHref, telHref, whatsappHref } from "@/lib/menu";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import type { EstablishmentProps } from "@/types/Establishment";
import { LanguageToggle } from "./LanguageToggle";

type Props = {
	establishment: EstablishmentProps;
	lang: Lang;
	dictionary: DictionaryProps;
	color: string;
	now: Date;
	canSwitch: boolean;
	onLangChange: (l: Lang) => void;
};

const tile = "flex min-h-11 flex-col items-center gap-1.5 rounded-[14px] bg-muted px-1 py-2.5 text-center text-xs font-semibold text-foreground";

export const MenuHero = ({ establishment: e, lang, dictionary, color, now, canSwitch, onLangChange }: Props) => {
	const t = dictionary.menu;
	const status = openStatus(e.schedules, now);
	const socials = (e.socialNetworks ?? [])
		.map((s) => ({ href: socialHref(s), label: s.displayName || s.platform.charAt(0).toUpperCase() + s.platform.slice(1) }))
		.filter((s): s is { href: string; label: string } => !!s.href);

	return (
		<header className="lg:col-start-2 lg:row-start-1 lg:pt-4">
			<div className="relative h-[200px] lg:h-[160px] lg:overflow-hidden lg:rounded-2xl" style={{ backgroundColor: color }}>
				{e.bannerUrl && <img src={e.bannerUrl} alt="" className="size-full object-cover" />}
			</div>
			<div className="relative -mt-7 flex flex-col gap-4 rounded-t-[28px] bg-white px-5 pb-6 lg:mt-0 lg:px-0 lg:pb-2 lg:pt-4">
				<div className="-mt-9 flex items-end justify-between lg:hidden">
					<div className="flex size-21 items-center justify-center overflow-hidden rounded-full bg-white font-display text-3xl font-extrabold shadow-[0_0_0_4px_#FFF,0_8px_20px_rgba(42,20,16,0.18)]" style={{ color }}>
						{e.logoUrl ? <img src={e.logoUrl} alt="" className="size-full object-contain" /> : e.name.charAt(0).toUpperCase()}
					</div>
					{canSwitch && <LanguageToggle lang={lang} onChange={onLangChange} />}
				</div>
				<div className="flex flex-col gap-1">
					<h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em]">{e.name}</h1>
					{e.description && (
						<div className="text-[15px] text-muted-foreground">
							{descriptionLines(e.description).map((l, i) => (
								<p key={i} className={l.bold ? "font-bold" : undefined}>{l.text}</p>
							))}
						</div>
					)}
				</div>
				{status && (
					<p className="flex items-center gap-2 text-sm">
						<span className={`font-semibold ${status.open ? "text-success" : "text-error"}`}>{status.open ? t.open : t.closed}</span>
						<span className="text-muted-foreground">· {status.open ? t.closesAt : t.opensAt} {status.until}</span>
					</p>
				)}
				<div className="grid grid-cols-4 gap-2 lg:hidden">
					{e.addressLink && <a href={e.addressLink} target="_blank" rel="noreferrer" className={tile}><MapPin className="size-5" aria-hidden="true" />{t.directions}</a>}
					{e.phone && <a href={telHref(e.phone)} className={tile}><Phone className="size-5" aria-hidden="true" />{t.call}</a>}
					{e.whatsapp && <a href={whatsappHref(e.whatsapp)} target="_blank" rel="noreferrer" className={tile}><MessageCircle className="size-5" aria-hidden="true" />{t.whatsapp}</a>}
					{socials.map((s) => (
						<a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={tile}><Link2 className="size-5" aria-hidden="true" />{s.label}</a>
					))}
				</div>
				{e.googlePlaceId && (
					<a
						href={reviewHref(e.googlePlaceId)}
						target="_blank"
						rel="noreferrer"
						className="flex min-h-11 items-center justify-between rounded-[14px] border border-border px-3.5 py-3 text-sm font-semibold"
					>
						<span className="flex items-center gap-2"><Star className="size-4" aria-hidden="true" />{t.establishment.leaveReview}</span>
						<ExternalLink className="size-4" aria-hidden="true" />
					</a>
				)}
			</div>
		</header>
	);
};
