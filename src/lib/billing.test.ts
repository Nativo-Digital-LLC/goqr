import { describe, expect, it } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import { billingView, statusLabel, transferReference } from './billing';
import { EstablishmentProps } from '../types/Establishment';

const est = (billing?: EstablishmentProps['billing']) => ({ billing }) as EstablishmentProps;
const now = new Date('2026-11-19T12:00:00Z');
const ts = (d: string) => Timestamp.fromDate(new Date(d));

describe('transferReference', () => {
	it('usa los primeros 6 caracteres en mayúsculas', () => {
		expect(transferReference('abc123xyz')).toBe('GOQR-ABC123');
	});
});

describe('billingView', () => {
	it('sin billing, prueba, pausado y cancelado → choose', () => {
		expect(billingView(est(), now)).toBe('choose');
		expect(billingView(est({ status: 'trialing' }), now)).toBe('choose');
		expect(billingView(est({ status: 'paused' }), now)).toBe('choose');
		expect(billingView(est({ status: 'canceled' }), now)).toBe('choose');
	});
	it('active, past_due y legacy', () => {
		expect(billingView(est({ status: 'active' }), now)).toBe('active');
		expect(billingView(est({ status: 'past_due' }), now)).toBe('past_due');
		expect(billingView(est({ status: 'legacy' }), now)).toBe('legacy');
	});
	it('active con periodo vencido → choose', () => {
		expect(billingView(est({ status: 'active', currentPeriodEnd: ts('2026-11-01') }), now)).toBe('choose');
		expect(billingView(est({ status: 'active', currentPeriodEnd: ts('2026-12-01') }), now)).toBe('active');
	});
});

describe('statusLabel', () => {
	it('traduce cada estado', () => {
		expect(statusLabel('trialing')).toBe('Prueba');
		expect(statusLabel('active')).toBe('Activo');
		expect(statusLabel('past_due')).toBe('Pago pendiente');
		expect(statusLabel('paused')).toBe('Pausado');
		expect(statusLabel('canceled')).toBe('Cancelado');
		expect(statusLabel('legacy')).toBe('Cliente anterior');
	});
});
