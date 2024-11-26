import { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Space,
	Upload
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { ID } from 'appwrite';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { ProductProps } from '../../../types/Product';
import { useSaveProduct } from '../../../hooks/useProducts';
import { avoidNotNumerics, maxFileSizeRule } from '../../../utils/helpers';

const { Dragger } = Upload;

interface VariantProps {
	price: number;
	label: string;
	id: string;
}

interface ModalProductProps {
	onFinish: () => void;
}

export const ModalProduct = ({ onFinish }: ModalProductProps) => {
	const [visible, close, extra] = useModalVisible<ProductProps>(ModalName.Products);
	const [save, saving] = useSaveProduct();
	const [variants, setVariants] = useState<VariantProps[]>([]);
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();
		setVariants([]);

		if (extra?.$id) {
			form.setFieldsValue({
				...extra,
				price: extra.prices[0].price
			});
		}

		if (extra?.prices && extra.prices.length > 1) {
			setVariants(
				extra
					.prices
					.map(({ price, label }) => ({
						price,
						label: label!,
						id: ID.unique()
					}))
			);

			extra.prices.forEach(({ label, price }, index) => {
				form.setFieldValue(`variants[${index}].label`, label);
				form.setFieldValue(`variants[${index}].price`, price);
			});
		}
	}, [visible, extra, form]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			width={400}
			title={extra?.$id ? 'Modificar Producto' : 'Nuevo Producto'}
			footer={false}
			maskClosable={false}
		>
			<Form
				form={form}
				layout='vertical'
				onFinish={(data) => {
					const prices: { label?: string; price?: number; }[] = [];
					if (variants.length === 0) {
						prices.push({
							price: data.price as number,
							label: ''
						});
					}

					for (const key in data) {
						const match = key.match(/variants\[(\d+)\]\.(\w+)/);
						if (match) {
							const index = Number(match[1]);
							const property = match[2] as 'label' | 'price';

							if (!prices[index]) {
								prices[index] = {};
							}

							prices[index][property] = data[key];
						}
					}

					save(
						{
							$id: extra?.$id,
							photo: (data?.photo)
								? data.photo.file
								: undefined,
							prices: prices as { label: string; price: number }[],
							name: data.name,
							description: data.description,
							order: extra?.order,
							establishmentId: extra?.establishmentId,
							categoryId: extra?.categoryId,
							subcategoryId: extra?.subcategoryId,
						},
						() => {
							close();
							onFinish();
						}
					);
				}}
			>
				<Form.Item
					name='name'
					label='Nombre'
					rules={[{ required: true, message: 'Introduzca un nombre' }]}
				>
					<Input />
				</Form.Item>

				{variants.length === 0 && (
					<Form.Item
						name='price'
						label='Precio'
						rules={[{ required: true, message: 'Introduzca un precio' }]}
					>
						<InputNumber
							onKeyDown={avoidNotNumerics}
							style={{ width: '100%' }}
						/>
					</Form.Item>
				)}

				{variants.length > 0 && (
					variants.map(({ price, label, id }, index) => (
						<Row gutter={[20, 20]} key={id}>
							<Col span={12}>
								<Form.Item
									label={'Variante ' + (index + 1)}
									name={`variants[${index}].label`}
									rules={[{ required: true, message: 'Ingrese un nombre' }]}
								>
									<Input defaultValue={label} />
								</Form.Item>
							</Col>

							<Col span={12}>
								<Space>
									<Form.Item
										label='Precio'
										name={`variants[${index}].price`}
										rules={[{ required: true, message: 'Ingrese un precio' }]}
									>
										<InputNumber
											defaultValue={price}
											style={{ width: '100%' }}
											onKeyDown={avoidNotNumerics}
										/>
									</Form.Item>

									<Button
										onClick={() => setVariants(variants.filter((_, i) => i !== index))}
										style={{ marginTop: 6 }}
									>
										Eliminar
									</Button>
								</Space>
							</Col>
						</Row>
					))
				)}

				<Button
					onClick={() => setVariants(variants.concat({ id: ID.unique(), label: '', price: 0 }))}
					style={{ width: '100%' }}
				>
					Agregar Variante
				</Button>
				<br />
				<br />

				<Form.Item
					name='description'
					label='Descripción'
				>
					<Input.TextArea rows={4} />
				</Form.Item>

				<Form.Item
					label='Foto'
					name='photo'
					rules={[{ required: !extra?.$id, message: 'Falta la foto' }, maxFileSizeRule]}
				>
					<Dragger
						name='photo'
						multiple={false}
						maxCount={1}
						accept='image/*'
						beforeUpload={() => false}
					>
						<p className='ant-upload-drag-icon'>
							<InboxOutlined />
						</p>
						<p className='ant-upload-text'>Click o arrastra tu foto en esta area</p>
					</Dragger>
				</Form.Item>

				<Row justify='end'>
					<Space>
						<Button onClick={close}>Cerrar</Button>
						<Button
							type='primary'
							htmlType='submit'
							loading={saving}
						>
							Guardar
						</Button>
					</Space>
				</Row>
			</Form>
		</Modal>
	);
}
