import { Modal } from 'antd';

import { useModalVisible } from '../hooks/useModal';
import { ModalName } from '../types/Modals';
import { useCreateEstablishment } from '../hooks/useEstablishments';

interface ModalNewEstablishmentProps {
	onFinish: () => void;
}

export const ModalNewEstablishment = ({ onFinish }: ModalNewEstablishmentProps) => {
	const [visible, close] = useModalVisible(ModalName.NewEstablishment);
	const [create, loading, error] = useCreateEstablishment();

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
