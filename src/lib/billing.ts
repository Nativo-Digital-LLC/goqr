import { EstablishmentProps } from '../types/Establishment';

type Status = NonNullable<NonNullable<EstablishmentProps['billing']>['status']>;

// Misma regla que Functions.
export const transferReference = (id: string) => 'GOQR-' + id.slice(0, 6).toUpperCase();

export function billingView(e: EstablishmentProps): 'choose' | 'active' | 'past_due' | 'legacy' {
	const b = e.billing;
	if (b?.status === 'legacy') return 'legacy';
	if (b?.status === 'past_due') return 'past_due';
	return b?.status === 'active' ? 'active' : 'choose';
}

const LABELS: Record<Status, string> = {
	trialing: 'Prueba',
	active: 'Activo',
	past_due: 'Pago pendiente',
	paused: 'Pausado',
	canceled: 'Cancelado',
	legacy: 'Cliente anterior',
};

export const statusLabel = (status: Status) => LABELS[status];

// Firestore devuelve Timestamp o Date según el origen.
export const toDate = (d: unknown) =>
	d && typeof (d as { toDate?: unknown }).toDate === 'function' ? (d as { toDate(): Date }).toDate() : new Date(d as string);

export const formatMoney = (amount: number, currency?: string) =>
	`${currency?.toLowerCase() === 'usd' ? 'US$' : 'RD$'}${amount.toLocaleString('es-DO')}`;

export type BillStatus = 'Pagada' | 'Pendiente' | 'Fallida';
export const billStatus = (b: { isPayed: boolean; stripeInvoiceId?: string }): BillStatus =>
	b.isPayed ? 'Pagada' : b.stripeInvoiceId ? 'Fallida' : 'Pendiente';

// Las facturas viejas no tienen establecimiento: se muestran en todos.
export const billsFor = <T extends { establishmentId?: string }>(bills: T[], establishmentId: string) =>
	bills.filter((b) => !b.establishmentId || b.establishmentId === establishmentId);
