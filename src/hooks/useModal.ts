import { useEffect, useState } from 'react';
import { filter } from 'rxjs';

import { ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';

export function useModalVisible<ExtraType = unknown>(nameToListen: ModalName): [boolean, () => void, ExtraType | null] {
	const [visible, setVisible] = useState(false);
	const [extra, setExtra] = useState<ExtraType | null>(null);

	useEffect(() => {
		const listener = ModalOpener$
			.pipe(filter(({ name }) => name === nameToListen))
			.subscribe(({ extra }) => {
				setExtra(extra as ExtraType);
				setVisible(true);
			});

		return () => listener.unsubscribe();
		// eslint-disable-next-line
	}, []);

	function close() {
		setVisible(false);
	}

	return [visible, close, extra];
}
