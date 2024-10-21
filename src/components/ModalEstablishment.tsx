import { useEffect, useState } from 'react';
import {
	Modal,
	Form,
	Input,
	Row,
	Col,
	Upload,
	Button,
	ColorPicker,
	Switch,
	Select,
	Typography,
	InputNumber
} from 'antd';
import { FileImageOutlined } from '@ant-design/icons';

import { useModalVisible } from '../hooks/useModal';
import { ModalName } from '../types/Modals';
import { avoidNotNumerics } from '../utils/helpers';
import { PaymentFrequency, PaymentMethod } from '../types/Bill';
import { useSaveEstablishment } from '../hooks/useEstablishments';
import { useSessionStore } from '../store/session';
import { EstablishmentProps } from '../types/Establishment';

const { Text } = Typography;

export const ModalEstablishment = ({ onFinish }: { onFinish: () => void }) => {
	const session = useSessionStore(({ session }) => session);
	const [visible, close, extra] = useModalVisible<EstablishmentProps | undefined>(ModalName.Establishment);
	const [requiresTaxReceipt, setRequiresTaxReceipt] = useState(false);
	const [form] = Form.useForm();

	const [save, saving, error] = useSaveEstablishment();
	if (error) {
		console.error(error);
	}

	useEffect(() => {
		form.resetFields();

		if (extra) {
			form.setFieldsValue(extra);
		}
	}, [visible, form, extra]);

	return (
		<Modal
			open={visible}
			onCancel={close}
			title={extra ? 'Modificar Local' : 'Nuevo Local'}
			width={800}
			okText='Guardar'
			cancelText='Cerrar'
			onOk={form.submit}
			okButtonProps={{
				loading: saving
			}}
		>
			<Form
				layout='vertical'
				form={form}
				onFinish={(data) => {
					const color = (data.mainHexColor.toHexString)
						? data.mainHexColor.toHexString()
						: undefined;

					save(
						{
							id: extra?.$id,
							userId: `${session?.userId}`,
							color,
							name: data.name,
							domain: data.domain,
							description: data.description,
							address: data.address,
							addressLink: data.addressLink,
							phone: data.phone,
							whatsapp: data.whatsapp,
							requiresTaxReceipt: data.requiresTaxReceipt,
							rnc: data.rnc,
							companyName: data.companyName,
							logo: data.logo?.file,
							banner: data.banner?.file
						},
						() => {
							onFinish();
							close();
						}
					);
				}}
			>
				<Row gutter={20}>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Nombre'
							name='name'
							rules={[{ required: true , message: 'Escribe el nombre' }]}
						>
							<Input />
						</Form.Item>

						<Form.Item
							label='URL'
							name='domain'
							rules={[{
								required: !extra,
								message: 'Elige tu URL'
							}]}
							tooltip='Escribe una URL única para tu negocio. Será parte del enlace que podrás compartir con tus clientes.'
						>
							<Input
								prefix='goqr.com.do/m/'
								disabled={!!extra}
								onInput={(event) => {
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									const value = event.target.value;
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-expect-error
									event.target.value = value
										.toLowerCase()
										.normalize("NFD")
										.replace(/\s+/g, "-")
										.replace(/-+/g, "-")
										.replace(/[\u0300-\u036f]/g, "")
										.replace(/[^a-z0-9\s-]/g, "");
								}}
							/>
						</Form.Item>

						<Form.Item
							label='Dirección'
							name='address'
						>
							<Input />
						</Form.Item>

						<Form.Item
							label='Enlace Google Maps'
							name='addressLink'
							rules={[{ type: 'url', message: 'URL inválida' }]}
							tooltip='Ingresa el enlace de Google Maps de tu negocio (copia el enlace desde ‘Compartir’ en Google Maps).'
						>
							<Input />
						</Form.Item>

						<Row gutter={20}>
							<Col span={12}>
								<Form.Item
									label='Logo'
									name='logo'
								>
									<Upload
										accept='image/*'
										multiple={false}
										beforeUpload={() => false}
									>
										<Button
											icon={<FileImageOutlined />}
										>
											Cargar Logo
										</Button>
									</Upload>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Banner'
									name='banner'
								>
									<Upload
										accept='image/*'
										multiple={false}
										beforeUpload={() => false}
									>
										<Button
											icon={<FileImageOutlined />}
										>
											Cargar Banner
										</Button>
									</Upload>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							label='Método de Pago'
							name='paymentMethod'
							rules={[{ required: true , message: 'Elige un método de pago' }]}
						>
							<Select
								options={[
									{
										label: 'Tarjeta de Crédito o Débito',
										value: PaymentMethod.CreditCard
									},
									{
										label: 'Transferencia o Depósito Bancario',
										value: PaymentMethod.BankTransfer
									}
								]}
							/>
						</Form.Item>

						<Form.Item
							label='Plan de Pagos'
							name='paymentFrequency'
							rules={[{ required: true , message: 'Elige un plan de pago' }]}
						>
							<Select
								options={[
									{
										label: (
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Text>Mensual</Text>
												<Text>$ 300</Text>
											</div>
										),
										value: PaymentFrequency.Monthly
									},
									{
										label: (
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Text>Anual</Text>
												<Text>$ 2,500</Text>
											</div>
										),
										value: PaymentFrequency.Annual
									},
									{
										label: (
											<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
												<Text>Pago Único</Text>
												<Text>$ 9,000</Text>
											</div>
										),
										value: PaymentFrequency.Never
									}
								]}
							/>
						</Form.Item>
					</Col>
					<Col xs={24} sm={12}>
						<Form.Item
							label='Teléfono'
							name='phone'
							rules={[{ type: 'number' }]}
						>
							<InputNumber
								onKeyDown={avoidNotNumerics}
								style={{ width: '100%' }}
								maxLength={10}
							/>
						</Form.Item>

						<Form.Item
							label='WhatsApp'
							name='whatsapp'
							rules={[{ type: 'number' }]}
						>
							<InputNumber
								onKeyDown={avoidNotNumerics}
								style={{ width: '100%' }}
								maxLength={10}
							/>
						</Form.Item>

						<Form.Item
							label='Descripción'
							name='description'
							rules={[{ required: true , message: 'Describe tu negocio' }]}
						>
							<Input.TextArea
								placeholder='Describe el ambiente, el tipo de cocina y las especialidades de tu restaurante'
								rows={5}
							/>
						</Form.Item>

						<Row>
							<Col span={12}>
								<Form.Item
									label='Color'
									name='mainHexColor'
									rules={[{ required: true , message: 'Selecciona un color' }]}
								>
									<ColorPicker
										size='middle'
										defaultFormat='hex'
										showText
										disabledAlpha
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									label='Comprobante Fiscal'
									name='requiresTaxReceipt'
									valuePropName='checked'
								>
									<Switch
										onChange={setRequiresTaxReceipt}
										defaultChecked={false}
									/>
								</Form.Item>
							</Col>
						</Row>

						{requiresTaxReceipt && (
							<>
								<Form.Item
									label='RNC'
									name='rnc'
									rules={[{ required: true , message: 'Escriba su RNC' }]}
								>
									<Input
										onKeyDown={avoidNotNumerics}
										minLength={9}
										maxLength={11}
									/>
								</Form.Item>

								<Form.Item
									label='Razón Social'
									name='companyName'
									rules={[{ required: true , message: 'Escriba su Razón Social' }]}
								>
									<Input />
								</Form.Item>
							</>
						)}
					</Col>
				</Row>
			</Form>
		</Modal>
	);
}
