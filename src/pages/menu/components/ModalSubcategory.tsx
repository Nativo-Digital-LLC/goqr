import { useEffect } from 'react';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { SubcategoryProps } from '../../../types/Subcategory';
import { useSaveSubcategory } from '../../../hooks/useSubcategories';

type ExtraType = Partial<SubcategoryProps> & { categoryId: string; };

export const ModalSubcategory = ({ onFinish }: { onFinish: () => void }) => {
	const [visible, close, extra] = useModalVisible<ExtraType>(ModalName.Subcategory)
	const [save, saving] = useSaveSubcategory();
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();

		if (extra) {
			form.setFieldsValue(extra);
		}
	}, [visible, extra, form]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title={extra?.$id ? 'Modificar Categoría' : 'Nueva Categoría'}
			width={300}
			okText='Guardar'
			cancelText='Cerrar'
			okButtonProps={{
				loading: saving
			}}
			onOk={form.submit}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={({ name, photo }) => {
					const data = {
						id: extra?.$id,
						categoryId: extra!.categoryId,
						name,
						photo: photo?.file,
						order: extra?.order
					};

					save(data, () => {
						onFinish();
						close();
					});
				}}
			>
				<Form.Item
					label='Nombre'
					name='name'
					rules={[{ required: true, message: 'Escribe un nombre' }]}
				>
					<Input />
				</Form.Item>

				<Form.Item
					label='Imagen'
					name='photo'
					rules={[{ required: !extra?.$id }]}
				>
					<Upload
						accept='image/*'
						multiple={false}
						beforeUpload={() => false}
					>
						<Button
							icon={<FileImageOutlined />}
						>
							Cargar Imagen
						</Button>
					</Upload>
				</Form.Item>
			</Form>
		</Modal>
	);
}
