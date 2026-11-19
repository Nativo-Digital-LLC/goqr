import { useCallback, useState } from 'react';

import { openPortal, startCheckout, submitTransfer } from '../services/billing';

type Handler<A extends unknown[], R> = [(...args: A) => Promise<R>, boolean, Error | null];

// Los errores de callable traen el mensaje en español en `message`.
function useAction<A extends unknown[], R>(fn: (...args: A) => Promise<R>): Handler<A, R> {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const run = useCallback(
		async (...args: A) => {
			setLoading(true);
			setError(null);
			try {
				return await fn(...args);
			} catch (e) {
				setError(e as Error);
				throw e;
			} finally {
				setLoading(false);
			}
		},
		[fn]
	);

	return [run, loading, error];
}

export const useStartCheckout = () => useAction(startCheckout);
export const useOpenPortal = () => useAction(openPortal);
export const useSubmitTransfer = () => useAction(submitTransfer);
