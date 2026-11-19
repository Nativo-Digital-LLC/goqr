import { EstablishmentProps } from '../types/Establishment';

type Status = NonNullable<NonNullable<EstablishmentProps['billing']>['status']>;

// Misma regla que Functions.
export const transferReference = (id: string) => 'GOQR-' + id.slice(0, 6).toUpperCase();

export function billingView(e: EstablishmentProps, now: Date): 'choose' | 'active' | 'past_due' | 'legacy' {
	const b = e.billing;
	if (b?.status === 'legacy') return 'legacy';
	if (b?.status === 'past_due') return 'past_due';
	if (b?.status === 'active') {
		// De por vida no tiene fin de periodo.
		const end = b.currentPeriodEnd?.toDate();
		return end && end < now ? 'choose' : 'active';
	}
	return 'choose';
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
