import type { ScheduleProps } from "../types/Establishment";
import { dayLabel, parseDays, parseHours } from "./menu";

export type DayHours = { open: boolean; from: string; to: string };
export type Week = DayHours[];

const fmt = (min: number) => {
	const h = Math.floor(min / 60);
	return `${h % 12 || 12}:${String(min % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export function schedulesToWeek(schedules: ScheduleProps[] | undefined): { week: Week; unparsed: ScheduleProps[] } {
	const week: Week = Array.from({ length: 7 }, () => ({ open: false, from: "8:00 AM", to: "10:00 PM" }));
	const unparsed: ScheduleProps[] = [];
	const seen = new Set<number>();
	for (const s of schedules ?? []) {
		const days = parseDays(s.days);
		const hours = parseHours(s.hours);
		if (!days.length || !hours) {
			unparsed.push(s);
			continue;
		}
		for (const d of days) {
			if (seen.has(d)) continue; // first row wins
			seen.add(d);
			week[d] = { open: true, from: fmt(hours.open), to: fmt(hours.close) };
		}
	}
	return { week, unparsed };
}

export function weekToSchedules(week: Week, unparsed: ScheduleProps[] = []): ScheduleProps[] {
	const groups = new Map<string, number[]>();
	week.forEach((d, i) => {
		if (!d.open) return;
		const key = `${d.from} - ${d.to}`;
		groups.set(key, [...(groups.get(key) ?? []), i]);
	});
	const rows = [...groups].map(([hours, days]) => ({
		days: days.map((i) => dayLabel(i, "es")).join(", "),
		hours,
	}));
	return [...rows, ...unparsed];
}

export const copyMondayToAll = (week: Week): Week => week.map(() => ({ ...week[0] }));

export function to24(h: string): string {
	const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(h.trim());
	if (!m) return "";
	const hh = (Number(m[1]) % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0);
	return `${String(hh).padStart(2, "0")}:${m[2]}`;
}

export function from24(hhmm: string): string {
	const [h, m] = hhmm.split(":").map(Number);
	return fmt(h * 60 + m);
}
