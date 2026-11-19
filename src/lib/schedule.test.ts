import { describe, expect, it } from "vitest";
import { copyMondayToAll, from24, schedulesToWeek, to24, weekToSchedules } from "./schedule";

const WEEKDAYS = "Lunes, Martes, Miércoles, Jueves, Viernes";

describe("schedulesToWeek", () => {
	it("marca los días abiertos con su rango", () => {
		const { week, unparsed } = schedulesToWeek([
			{ days: WEEKDAYS, hours: "8:00 AM - 10:00 PM" },
			{ days: "Sábado", hours: "9:00 AM - 11:00 PM" },
		]);
		for (let i = 0; i < 5; i++) expect(week[i]).toEqual({ open: true, from: "8:00 AM", to: "10:00 PM" });
		expect(week[5]).toEqual({ open: true, from: "9:00 AM", to: "11:00 PM" });
		expect(week[6]).toEqual({ open: false, from: "8:00 AM", to: "10:00 PM" });
		expect(unparsed).toEqual([]);
	});

	it("usa la primera fila si un día se repite", () => {
		const { week } = schedulesToWeek([
			{ days: "Lunes", hours: "8:00 AM - 10:00 PM" },
			{ days: "Lunes", hours: "9:00 AM - 11:00 PM" },
		]);
		expect(week[0].from).toBe("8:00 AM");
	});

	it("conserva filas ilegibles y las devuelve al final", () => {
		const odd = { days: "Feriados", hours: "cerrado" };
		const { week, unparsed } = schedulesToWeek([odd, { days: "Lunes", hours: "8:00 AM - 10:00 PM" }]);
		expect(unparsed).toEqual([odd]);
		expect(weekToSchedules(week, unparsed)).toEqual([{ days: "Lunes", hours: "8:00 AM - 10:00 PM" }, odd]);
	});

	it("sin horario o con horas ilegibles no abre nada", () => {
		expect(schedulesToWeek(undefined).week.every((d) => !d.open)).toBe(true);
		expect(schedulesToWeek([{ days: "Lunes", hours: "todo el día" }]).unparsed).toHaveLength(1);
	});
});

describe("weekToSchedules", () => {
	it("ida y vuelta agrupa lunes a viernes en una fila", () => {
		const x = [{ days: WEEKDAYS, hours: "8:00 AM - 10:00 PM" }];
		expect(weekToSchedules(schedulesToWeek(x).week)).toEqual(x);
	});

	it("agrupa lunes y miércoles con martes cerrado", () => {
		const { week } = schedulesToWeek([{ days: "Lunes, Miércoles", hours: "8:00 AM - 10:00 PM" }]);
		expect(weekToSchedules(week)).toEqual([{ days: "Lunes, Miércoles", hours: "8:00 AM - 10:00 PM" }]);
	});
});

describe("copyMondayToAll", () => {
	it("copia el lunes a los 7 días", () => {
		const { week } = schedulesToWeek([{ days: "Lunes", hours: "7:30 AM - 9:00 PM" }]);
		const all = copyMondayToAll(week);
		expect(all).toHaveLength(7);
		all.forEach((d) => expect(d).toEqual({ open: true, from: "7:30 AM", to: "9:00 PM" }));
	});
});

describe("to24 / from24", () => {
	it("convierte entre formatos", () => {
		expect(to24("8:00 PM")).toBe("20:00");
		expect(to24("12:30 AM")).toBe("00:30");
		expect(to24("12:00 PM")).toBe("12:00");
		expect(from24("09:05")).toBe("9:05 AM");
		expect(from24("12:00")).toBe("12:00 PM");
		expect(from24("00:15")).toBe("12:15 AM");
	});
});
