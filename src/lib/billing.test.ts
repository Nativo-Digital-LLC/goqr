import { describe, expect, it } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import { billingView, billsFor, billStatus, formatMoney, statusLabel, transferReference } from './billing';
import { EstablishmentProps } from '../types/Establishment';

const est = (billing?: EstablishmentProps['billing']) => ({ billing }) as EstablishmentProps;
const ts = (d: string) => Timestamp.fromDate(new Date(d));

describe('transferReference', () => {
	it('usa los primeros 6 caracteres en mayúsculas', () => {
		expect(transferReference('abc123xyz')).toBe('GOQR-ABC123');
	});
});

describe('billingView', () => {
	it('sin billing, prueba, pausado y cancelado → choose', () => {
		expect(billingView(est())).toBe('choose');
		expect(billingView(est({ status: 'trialing' }))).toBe('choose');
		expect(billingView(est({ status: 'paused' }))).toBe('choose');
		expect(billingView(est({ status: 'canceled' }))).toBe('choose');
	});
	it('active, past_due y legacy', () => {
		expect(billingView(est({ status: 'active' }))).toBe('active');
		expect(billingView(est({ status: 'past_due' }))).toBe('past_due');
		expect(billingView(est({ status: 'legacy' }))).toBe('legacy');
	});
	it('active sigue activo aunque currentPeriodEnd ya pasó', () => {
		expect(billingView(est({ status: 'active', currentPeriodEnd: ts('2026-11-01') }))).toBe('active');
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

describe('formatMoney', () => {
	it('RD$ por defecto y US$ para usd', () => {
		expect(formatMoney(2520)).toBe('RD$2,520');
		expect(formatMoney(11000, 'DOP')).toBe('RD$11,000');
		expect(formatMoney(42, 'usd')).toBe('US$42');
		expect(formatMoney(185, 'USD')).toBe('US$185');
	});
});

describe('billStatus', () => {
	it('pagada, fallida (con factura de Stripe) o pendiente', () => {
		expect(billStatus({ isPayed: true })).toBe('Pagada');
		expect(billStatus({ isPayed: false, stripeInvoiceId: 'in_1' })).toBe('Fallida');
		expect(billStatus({ isPayed: false })).toBe('Pendiente');
	});
});

describe('billsFor', () => {
	it('incluye las del establecimiento y las viejas sin establecimiento', () => {
		const r = billsFor([{ establishmentId: 'a' }, { establishmentId: 'b' }, {}], 'a');
		expect(r).toEqual([{ establishmentId: 'a' }, {}]);
	});
});
