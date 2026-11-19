import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { dayLabel } from "@/lib/menu";
import { copyMondayToAll, from24, to24 } from "@/lib/schedule";
import { Section, type FormValues } from "./Section";

const time =
	"h-9 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50";

export function HoursSection({ busy }: { busy: boolean }) {
	const { watch, setValue } = useFormContext<FormValues>();
	const week = watch("week");
	const patch = (i: number, p: Partial<FormValues["week"][number]>) =>
		setValue("week", week.map((d, j) => (j === i ? { ...d, ...p } : d)), { shouldDirty: true });

	return (
		<Section id="horarios" title="Horarios">
			<div className="flex flex-col gap-3">
				{week.map((d, i) => (
					<div key={i} className="flex flex-wrap items-center gap-3">
						<Switch
							id={`open-${i}`}
							aria-label={`${dayLabel(i, "es")} abierto`}
							checked={d.open}
							disabled={busy}
							onCheckedChange={(open) => patch(i, { open })}
						/>
						<span className="w-24 text-sm font-semibold">{dayLabel(i, "es")}</span>
						{d.open ? (
							<div className="flex items-center gap-2 text-sm">
								<input type="time" aria-label={`${dayLabel(i, "es")} abre`} className={time} disabled={busy} value={to24(d.from)} onChange={(e) => e.target.value && patch(i, { from: from24(e.target.value) })} />
								<span>a</span>
								<input type="time" aria-label={`${dayLabel(i, "es")} cierra`} className={time} disabled={busy} value={to24(d.to)} onChange={(e) => e.target.value && patch(i, { to: from24(e.target.value) })} />
							</div>
						) : (
							<span className="text-sm text-muted-foreground">Cerrado</span>
						)}
					</div>
				))}
			</div>
			<Button type="button" variant="ghost" className="self-start" disabled={busy} onClick={() => setValue("week", copyMondayToAll(week), { shouldDirty: true })}>
				Copiar el horario del lunes a toda la semana
			</Button>
		</Section>
	);
}
