import { useEffect } from 'react';
import { Button, Form, Input, Modal, Upload } from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { SubcategoryProps } from '../../../types/Subcategory';
import { useSaveSubcategory } from '../../../hooks/useSubcategories';
import { maxFileSizeRule } from '../../../utils/helpers';

type ExtraType = Partial<SubcategoryProps> & { categoryId: string; };

interface ModalSubcategoryProps {
	onFinish: () => void;
	enableEnglishVersion: boolean;
}

export const ModalSubcategory = ({ onFinish, enableEnglishVersion }: ModalSubcategoryProps) => {
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
				onFinish={({ es_name, en_name, photo }) => {
					const data = {
						id: extra?.$id,
						categoryId: extra!.categoryId,
						en_name,
						es_name,
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
					label={`Nombre${enableEnglishVersion ? ' (español)' : ''}`}
					name='es_name'
					rules={[{ required: true, message: 'Escribe un nombre' }]}
				>
					<Input autoFocus />
				</Form.Item>

				{enableEnglishVersion && (
					<Form.Item
						label={`Nombre${enableEnglishVersion ? ' (ingles)' : ''}`}
						name='en_name'
						rules={[{ required: true, message: 'Escribe un nombre' }]}
					>
						<Input />
					</Form.Item>
				)}

				<Form.Item
					label='Imagen'
					name='photo'
					rules={[{ required: !extra?.$id }, maxFileSizeRule]}
				>
					<Upload
						accept='image/png, image/jpeg, image/jpg'
						multiple={false}
						beforeUpload={() => false}
						maxCount={1}
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
