import { describe, expect, it } from 'vitest';
import { clientMetrics, filterClients } from './adminClients';
import { AdminClient } from '../services/admin';

const now = new Date('2026-11-19T12:00:00Z');
const days = (n: number) => new Date(now.getTime() + n * 86_400_000);
const c = (name: string, billing: AdminClient['billing'], extra: Partial<AdminClient> = {}) =>
	({ establishmentId: name, name, domain: name.toLowerCase(), ownerName: '', ownerEmail: `${name}@x.com`, lastSignIn: null, isActive: true, billing, ...extra }) as AdminClient;
const b = (x: object) => x as AdminClient['billing'];

describe('clientMetrics', () => {
	const list = [
		c('a', b({ status: 'active', plan: 'monthly', currentPeriodEnd: days(3) })),
		c('b', b({ status: 'active', plan: 'annual', currentPeriodEnd: days(30) })),
		c('l', b({ status: 'active', plan: 'lifetime' })),
		c('p', b({ status: 'past_due', plan: 'monthly', currentPeriodEnd: days(-2) })),
		c('t', b({ status: 'trialing', trialEndsAt: days(5) })),
		c('t2', b({ status: 'trialing', trialEndsAt: days(20) })),
		c('z', b({ status: 'paused', plan: 'monthly', currentPeriodEnd: days(2) })),
		c('g', b({ status: 'legacy' })),
		c('x', b({ status: 'canceled', plan: 'monthly', currentPeriodEnd: days(2) })),
		c('n', null),
	];
	it('cuenta activos y en prueba; legacy/canceled no cuentan', () => {
		const m = clientMetrics(list, now);
		expect(m.active).toBe(3);
		expect(m.trialing).toBe(2);
	});
	it('MRR: mensual 300, anual 210, lifetime 0, active y past_due', () => {
		expect(clientMetrics(list, now).mrrDop).toBe(300 + 210 + 0 + 300);
	});
	it('vencen esta semana usa trialEndsAt en prueba', () => {
		expect(clientMetrics(list, now).dueThisWeek).toBe(2); // a y t; pausado y cancelado con fecha próxima no cuentan
	});
	it('no se rompe con lista vacía', () => {
		expect(clientMetrics([], now)).toEqual({ active: 0, trialing: 0, mrrDop: 0, dueThisWeek: 0 });
	});
});

describe('filterClients', () => {
	const list = [
		c('La Roca', b({ status: 'active', plan: 'annual', method: 'card' }), { domain: 'la-roca' }),
		c('Café', b({ status: 'trialing' }), { ownerEmail: 'juan@x.com' }),
		c('Sin', null),
	];
	const all = { q: '', status: 'all', plan: 'all', method: 'all' };
	it('sin filtros devuelve todo', () => expect(filterClients(list, all)).toHaveLength(3));
	it('busca por nombre, slug y correo', () => {
		expect(filterClients(list, { ...all, q: 'roca' })).toHaveLength(1);
		expect(filterClients(list, { ...all, q: 'la-roca' })).toHaveLength(1);
		expect(filterClients(list, { ...all, q: 'JUAN@' })[0].name).toBe('Café');
	});
	it('filtra por estado, plan y método', () => {
		expect(filterClients(list, { ...all, status: 'active' })).toHaveLength(1);
		expect(filterClients(list, { ...all, plan: 'annual', method: 'card' })).toHaveLength(1);
		expect(filterClients(list, { ...all, method: 'transfer' })).toHaveLength(0);
	});
});
