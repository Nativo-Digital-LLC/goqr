import { useEffect } from 'react';
import { Form, Modal, Input } from 'antd';

import { useModalVisible } from '../hooks/useModal';
import { ModalName } from '../types/Modals';
import { useCreateCategory } from '../hooks/useCategories';

interface ExtraType {
	order: number;
	establishmentId: string;
}

export const ModalNewCategory = ({ onFinish }: { onFinish: () => void }) => {
	const [visible, close, extra] = useModalVisible<ExtraType>(ModalName.NewCategory);
	const [save, saving] = useCreateCategory();
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();
	}, [visible, form]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title='Nuevo Menú'
			width={300}
			okText='Guardar'
			cancelText='Cerrar'
			okButtonProps={{ loading: saving }}
			onOk={form.submit}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={({ name }) => {
					save(
						extra!.establishmentId,
						name,
						extra!.order,
						() => {
							onFinish();
							close();
						}
					);
				}}
			>
				<Form.Item
					label='Nombre del menú'
					name='name'
					rules={[{ required: true, message: 'Ingrese un nombre' }]}
				>
					<Input autoFocus />
				</Form.Item>
			</Form>
		</Modal>
	);
}
