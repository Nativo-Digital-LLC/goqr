import { useEffect } from 'react';
import { Form, Modal, Input, Switch } from 'antd';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { useSaveCategory } from '../../../hooks/useCategories';

interface ExtraType {
	id?: string;
	order?: number;
	establishmentId: string;
	name?: string;
}

export const ModalCategory = ({ onFinish }: { onFinish: () => void }) => {
	const [visible, close, extra] = useModalVisible<ExtraType>(ModalName.Category);
	const [save, saving] = useSaveCategory();
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();

		if (extra?.name) {
			form.setFieldValue('name', extra.name);
		}
	}, [visible, form, extra]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title={extra?.name ? 'Modificar Menú': 'Nuevo Menú'}
			width={300}
			okText='Guardar'
			cancelText='Cerrar'
			okButtonProps={{ loading: saving }}
			onOk={form.submit}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={({ name, enableSubcategories }) => {
					const data = {
						name,
						establishmentId: extra!.establishmentId,
						enableSubcategories,
						id: extra?.id,
						order: extra?.order
					};

					save(data, () => {
						onFinish();
						close();
					});
				}}
			>
				<Form.Item
					label='Nombre del menú'
					name='name'
					rules={[{ required: true, message: 'Ingrese un nombre' }]}
				>
					<Input autoFocus />
				</Form.Item>
				<Form.Item
					label='Mostrar Categorías'
					name='enableSubcategories'
				>
					<Switch defaultChecked={true} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
