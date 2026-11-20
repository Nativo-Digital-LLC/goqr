import { PLANS, PlanId } from '../constants/plans';
import { monthlyDop, toDate } from './billing';
import { AdminClient } from '../services/admin';

const DAY = 86_400_000;
const isPlan = (p: unknown): p is PlanId => PLANS.some((x) => x.id === p);

const endOf = (c: AdminClient) => {
	const b = c.billing;
	const raw = b?.status === 'trialing' ? b.trialEndsAt : b?.currentPeriodEnd;
	return raw ? toDate(raw) : null;
};

export const clientEnd = endOf;

export function clientMetrics(clients: AdminClient[], now: Date) {
	let active = 0, trialing = 0, mrrDop = 0, dueThisWeek = 0;
	for (const c of clients) {
		const b = c.billing;
		if (b?.status === 'active') active++;
		if (b?.status === 'trialing') trialing++;
		// MRR con lo que paga cada cliente (precio congelado), no con la lista.
		if ((b?.status === 'active' || b?.status === 'past_due') && isPlan(b.plan)) mrrDop += monthlyDop(b, b.plan);
		const end = b?.status === 'trialing' || b?.status === 'active' || b?.status === 'past_due' ? endOf(c) : null;
		if (end && end >= now && end.getTime() <= now.getTime() + 7 * DAY) dueThisWeek++;
	}
	return { active, trialing, mrrDop, dueThisWeek };
}

export type ClientFilters = { q: string; status: string; plan: string; method: string };

// 'all' (o vacío) no filtra.
export function filterClients(clients: AdminClient[], { q, status, plan, method }: ClientFilters) {
	const term = q.trim().toLowerCase();
	const ok = (f: string, v?: string) => !f || f === 'all' || f === v;
	return clients.filter(
		(c) =>
			(!term || [c.name, c.domain, c.ownerEmail].some((s) => s?.toLowerCase().includes(term))) &&
			ok(status, c.billing?.status) &&
			ok(plan, c.billing?.plan) &&
			ok(method, c.billing?.method)
	);
}
