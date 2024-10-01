import { Modal } from 'antd';

import { useModalVisible } from '../hooks/useModal';
import { ModalName } from '../types/Modals';

export const ModalNewEstablishment = () => {
	const [visible, close] = useModalVisible(ModalName.NewEstablishment);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title='Añadir Local'
			width={400}
		>

		</Modal>
	);
}
