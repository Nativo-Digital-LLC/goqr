import { Link2, MapPin, MessageCircle, Phone } from "lucide-react";

import { dayLabel, mapsEmbedSrc, parseDays, parseHours, socialHref, telHref, whatsappHref } from "@/lib/menu";
import type { DictionaryProps, Lang } from "@/types/Dictionary";
import type { EstablishmentProps } from "@/types/Establishment";

type Props = { establishment: EstablishmentProps; lang: Lang; dictionary: DictionaryProps; now: Date };

const card = "flex flex-col gap-3 rounded-2xl border border-border bg-white p-4";
const title = "font-display text-base font-bold";
const link = "flex min-h-11 items-center gap-2.5 text-sm font-medium";

export const MenuInfoAside = ({ establishment: e, lang, dictionary, now }: Props) => {
	const t = dictionary.menu;
	const week: string[][] = Array.from({ length: 7 }, () => []);
	for (const s of e.schedules ?? []) {
		if (!parseHours(s.hours)) continue;
		for (const d of new Set(parseDays(s.days))) week[d].push(s.hours.trim());
	}
	const hasSchedule = week.some((r) => r.length);
	const today = (now.getDay() + 6) % 7;
	const socials = (e.socialNetworks ?? [])
		.map((s) => ({ href: socialHref(s), label: s.displayName || s.platform.charAt(0).toUpperCase() + s.platform.slice(1) }))
		.filter((s): s is { href: string; label: string } => !!s.href);
	const hasContact = !!(e.phone || e.whatsapp || socials.length);

	return (
		<aside className="sticky lg:col-start-3 lg:row-span-2 lg:row-start-1 top-[88px] hidden max-h-[calc(100vh-104px)] flex-col gap-4 self-start overflow-y-auto lg:flex">
			{hasSchedule && (
				<section className={card}>
					<h2 className={title}>{t.schedule}</h2>
					<ul className="flex flex-col gap-1.5 text-sm">
						{week.map((ranges, i) => (
							<li key={i} className={`flex justify-between gap-3 ${i === today ? "font-bold" : ""}`}>
								<span>{dayLabel(i, lang)}{i === today && <span className="font-normal text-muted-foreground"> · {t.today}</span>}</span>
								<span className={ranges.length ? "text-right" : "text-muted-foreground"}>{ranges.length ? ranges.join(", ") : t.closed}</span>
							</li>
						))}
					</ul>
				</section>
			)}
			{e.address && (
				<section className={card}>
					<h2 className={title}>{t.map}</h2>
					<iframe
						src={mapsEmbedSrc(e.address)}
						title={`${t.map}: ${e.name}`}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="h-44 w-full rounded-xl border-0"
					/>
					<p className="text-sm text-muted-foreground">{e.address}</p>
				</section>
			)}
			{e.addressLink && (
				<a href={e.addressLink} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-muted text-sm font-semibold">
					<MapPin className="size-4" aria-hidden="true" />{t.directions}
				</a>
			)}
			{hasContact && (
				<section className={card}>
					<h2 className={title}>{t.contact}</h2>
					<div className="flex flex-col">
						{e.phone && <a href={telHref(e.phone)} className={link}><Phone className="size-4" aria-hidden="true" />{e.phone}</a>}
						{e.whatsapp && <a href={whatsappHref(e.whatsapp)} target="_blank" rel="noreferrer" className={link}><MessageCircle className="size-4" aria-hidden="true" />{t.whatsapp}</a>}
						{socials.map((s) => (
							<a key={s.href} href={s.href} target="_blank" rel="noreferrer" className={link}><Link2 className="size-4" aria-hidden="true" />{s.label}</a>
						))}
					</div>
				</section>
			)}
		</aside>
	);
};
