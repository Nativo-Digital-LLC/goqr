import { useEffect } from 'react';
import { Form, Modal, Input, Switch } from 'antd';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { useSaveCategory } from '../../../hooks/useCategories';

interface ExtraType {
	id?: string;
	order?: number;
	establishmentId: string;
	es_name?: string;
	en_name?: string;
	enableSubcategories?: string;
}

interface ModalCategoryProps {
	onFinish: () => void;
	enableEnglishVersion: boolean;
}

export const ModalCategory = ({ onFinish, enableEnglishVersion }: ModalCategoryProps) => {
	const [visible, close, extra] = useModalVisible<ExtraType>(ModalName.Category);
	const [save, saving] = useSaveCategory();
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();

		if (extra?.es_name) {
			form.setFieldsValue({
				es_name: extra.es_name,
				en_name: extra?.en_name,
				enableSubcategories: extra.enableSubcategories!
			});
		}
	}, [visible, form, extra]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title={extra?.es_name ? 'Modificar Menú': 'Nuevo Menú'}
			width={300}
			okText='Guardar'
			cancelText='Cerrar'
			okButtonProps={{ loading: saving }}
			onOk={form.submit}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={({ en_name, es_name, enableSubcategories }) => {
					const data = {
						en_name,
						es_name,
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
					label={`Nombre del menú${enableEnglishVersion ? ' (español)' : ''}`}
					name='es_name'
					rules={[{ required: true, message: 'Ingrese un nombre' }]}
				>
					<Input autoFocus />
				</Form.Item>
				{enableEnglishVersion && (
					<Form.Item
						label={`Nombre del menú${enableEnglishVersion ? ' (ingles)' : ''}`}
						name='en_name'
						rules={[{ required: true, message: 'Ingrese un nombre' }]}
					>
						<Input />
					</Form.Item>
				)}
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
