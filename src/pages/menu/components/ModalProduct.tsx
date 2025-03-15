import { useEffect, useState } from 'react';
import {
	Button,
	Card,
	Col,
	Form,
	Input,
	InputNumber,
	Modal,
	Row,
	Select,
	Space,
	Switch,
	Upload
} from 'antd';
import { DeleteOutlined, InboxOutlined } from '@ant-design/icons';
import { ID } from 'appwrite';

import { useModalVisible } from '../../../hooks/useModal';
import { ModalName } from '../../../types/Modals';
import { ProductProps, ProductStatus } from '../../../types/Product';
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
	enableEnglishVersion: boolean;
}

export const ModalProduct = ({ onFinish, enableEnglishVersion }: ModalProductProps) => {
	const [visible, close, extra] = useModalVisible<ProductProps>(ModalName.Products);
	const [save, saving] = useSaveProduct();
	const [variants, setVariants] = useState<VariantProps[]>([]);
	const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null);
	const [form] = Form.useForm();

	useEffect(() => {
		form.resetFields();
		setVariants([]);
		setCurrentPhotoUrl(null);

		if (extra?.$id) {
			form.setFieldsValue({
				...extra,
				price: extra.prices[0].price
			});

			setCurrentPhotoUrl(extra.photoUrl);
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

					let photo: File | null | undefined = undefined;
					if (data?.photo) {
						photo = data.photo.file as File;
					}

					if (data?.photo === null) {
						photo = null;
					}

					save(
						{
							$id: extra?.$id,
							photo,
							prices: prices as { label: string; price: number }[],
							es_name: data.es_name,
							en_name: data.en_name,
							es_description: data.es_description,
							en_description: data.en_description,
							order: extra?.order,
							establishmentId: extra?.establishmentId,
							categoryId: extra?.categoryId,
							subcategoryId: extra?.subcategoryId,
							status: data.status,
							bestSeller: data.bestSeller
						},
						() => {
							close();
							onFinish();
						}
					);
				}}
			>
				<Form.Item
					name='es_name'
					label={`Nombre${enableEnglishVersion ? ' (español)' : ''}`}
					rules={[{ required: true, message: 'Introduzca un nombre' }]}
				>
					<Input />
				</Form.Item>

				{enableEnglishVersion && (
					<Form.Item
						name='en_name'
						label={`Nombre${enableEnglishVersion ? ' (ingles)' : ''}`}
						rules={[{ required: true, message: 'Introduzca un nombre' }]}
					>
						<Input />
					</Form.Item>
				)}

				{variants.length === 0 && (
					<Form.Item
						name='price'
						label='Precio'
						rules={[{ required: true, message: 'Introduzca un precio' }]}
					>
						<InputNumber
							onKeyDown={(event) => avoidNotNumerics(event, 2)}
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
											onKeyDown={(event) => avoidNotNumerics(event, 2)}
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
					label='Más vendido'
					name='bestSeller'
					valuePropName='checked'
				>
					<Switch defaultChecked={false} />
				</Form.Item>

				<Form.Item
					name='es_description'
					label={`Descripción${enableEnglishVersion ? ' (español)' : ''}`}
				>
					<Input.TextArea rows={4} />
				</Form.Item>

				{enableEnglishVersion && (
					<Form.Item
						name='en_description'
						label={`Descripción${enableEnglishVersion ? ' (ingles)' : ''}`}
					>
						<Input.TextArea rows={4} />
					</Form.Item>
				)}

				<Form.Item
					label='Foto'
					name='photo'
					rules={[maxFileSizeRule]}
				>
					{currentPhotoUrl && (
						<Card
							cover={<img src={currentPhotoUrl} />}
							styles={{
								body: {
									padding: 0
								}
							}}
							actions={[
								<Button
									onClick={() => {
										setCurrentPhotoUrl(null);
										form.setFieldsValue({ photo: null });
									}}
									size='small'
									icon={<DeleteOutlined />}
								>
									Eliminar
								</Button>
							]}
						/>
					)}

					{!currentPhotoUrl && (
						<Dragger
							name='photo'
							multiple={false}
							maxCount={1}
							accept='image/png, image/jpeg, image/jpg'
							beforeUpload={() => false}
						>
							<p className='ant-upload-drag-icon'>
								<InboxOutlined />
							</p>
							<p className='ant-upload-text'>Click o arrastra tu foto en esta area</p>
						</Dragger>
					)}
				</Form.Item>

				<Form.Item
					name='status'
					label='Estado'
					tooltip='Al seleccionar la opcion `No disponible`, el producto seguirá siendo visualizado por tus clientes pero con la etiqueta `No disponible`'
					initialValue={ProductStatus.Visible}
				>
					<Select
						options={[
							{
								label: 'Visible',
								value: ProductStatus.Visible
							},
							{
								label: 'Oculto',
								value: ProductStatus.Hidden
							},
							{
								label: 'No Disponible',
								value: ProductStatus.NotAvailable,
							}
						]}

					/>
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
