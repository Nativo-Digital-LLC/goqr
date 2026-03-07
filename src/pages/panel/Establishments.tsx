import { useEffect, useState } from "react";
import {
	Form,
	Input,
	Upload,
	Button,
	ColorPicker,
	Switch,
	Select,
	Typography,
	InputNumber,
	TimePicker,
	Space,
	Row,
} from "antd";
import {
	FileImageOutlined,
	PlusOutlined,
	InfoCircleOutlined,
	EnvironmentOutlined,
	CreditCardOutlined,
	ClockCircleOutlined,
	GlobalOutlined,
	DeleteOutlined
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";

import { avoidNotNumerics, maxFileSizeRule, getSocialUsername } from "../../utils/helpers";
import { PaymentFrequency, PaymentMethod } from "../../types/Bill";
import { useSaveEstablishment } from "../../hooks/useEstablishments";

import { EstablishmentProps } from "../../types/Establishment";
import { useErrorHandler } from "../../hooks/useError";
import { useSessionStore } from "../../store/session";

const { Text } = Typography;

interface EstablishmentsPageProps {
	establishment?: EstablishmentProps;
	disableReturn: boolean;
}

export function Establishments() {
	const navigate = useNavigate();
	const location = useLocation();

	const props = location.state as EstablishmentsPageProps;
	const establishment = props?.establishment;
	const session = useSessionStore(({ session }) => session);

	const [requiresTaxReceipt, setRequiresTaxReceipt] = useState(false);
	const [form] = Form.useForm();

	const [save, saving, error] = useSaveEstablishment();
	useErrorHandler(error);

	useEffect(() => {
		form.resetFields();

		if (establishment) {
			form.setFieldsValue({
				...establishment,
				...(establishment?.phone && {
					phone: Number(establishment.phone),
				}),
				...(establishment?.whatsapp && {
					whatsapp: Number(establishment.whatsapp),
				}),
				schedules: establishment?.schedules?.map((schedule) => {
					let parsedHours = null;
					if (schedule.hours) {
						const parts = schedule.hours.split(" - ");
						if (parts.length === 2) {
							const start = dayjs(new Date(`2000/01/01 ${parts[0]}`));
							const end = dayjs(new Date(`2000/01/01 ${parts[1]}`));
							if (start.isValid() && end.isValid()) {
								parsedHours = [start, end];
							}
						}
					}
					return {
						days: schedule.days ? schedule.days.split(", ") : [],
						hours: parsedHours,
					};
				}) || [],
				socialNetworks: establishment?.socialNetworks?.map((social) => ({
					...social,
					displayName: social.displayName || getSocialUsername(social.platform, social.link) || undefined,
				})) || [],
			});
		}
	}, [form, establishment]);

	function onFinish() {
		navigate("/dashboard");
	}

	return (
		<div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen font-display w-full">
			<div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
				<div className="layout-container flex h-full grow flex-col">
					<main className="flex flex-1 justify-center py-8">
						<div className="layout-content-container flex w-full max-w-[1024px] flex-col gap-8 px-6">
							{/* Page Header */}
							<div className="flex flex-col gap-2">
								<h1 className="text-4xl font-black tracking-tight text-slate-900 m-0">Configuración del Restaurante</h1>
								<p className="text-slate-500 text-lg m-0">Gestiona la identidad visual, contactos y operatividad de tu negocio.</p>
							</div>

							<Form
								layout="vertical"
								form={form}
								onFinish={(data) => {
									const mainHexColor = data.mainHexColor.toHexString
										? data.mainHexColor.toHexString()
										: establishment?.mainHexColor || null;

									save(
										{
											id: establishment?.id,
											userId: session?.userId,
											mainHexColor,
											name: data.name,
											domain: data.domain,
											description: data.description,
											address: data.address || null,
											addressLink: data.addressLink || null,
											phone: data.phone
												? data.phone.toString()
												: null,
											whatsapp: data.whatsapp
												? data.whatsapp.toString()
												: null,
											requiresTaxReceipt: data.requiresTaxReceipt || false,
											rnc: data.rnc || null,
											companyName: data.companyName || null,
											logo: data.logo?.file || null,
											banner: data.banner?.file || null,
											paymentMethod: data.paymentMethod,
											paymentFrequency: data.paymentFrequency,
											schedules: data.schedules?.map((s: any) => ({
												days: Array.isArray(s.days) ? s.days.join(", ") : s.days,
												hours:
													Array.isArray(s.hours) && s.hours.length === 2
														? `${s.hours[0].format("h:mm A")} - ${s.hours[1].format(
															"h:mm A"
														)}`
														: s.hours,
											})) || [],
											socialNetworks: data.socialNetworks?.map((s: any) => ({
												platform: s.platform,
												link: s.link,
												displayName: s.displayName || null,
											})) || [],
										},
										() => {
											onFinish();
										}
									);
								}}
							>
								<div className="flex flex-col gap-6 w-full shadow-none">
									{/* Section 1: General Information */}
									<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
										<div className="mb-6 flex items-center gap-2">
											<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
												<InfoCircleOutlined className="text-sm" />
											</div>
											<h2 className="text-lg font-bold m-0 text-slate-900">Información General</h2>
										</div>

										<div className="flex flex-col gap-6">
											{/* Banner and Logo Section */}
											<div className="relative w-full h-48 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden group">
												{/* Banner Image / Upload */}
												<div className="w-full h-full bg-slate-200 flex items-center justify-center relative">
													{establishment?.bannerUrl ? (
														<img src={establishment.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
													) : (
														<span className="text-slate-400">Sin banner</span>
													)}
													{/* Upload Banner Button Overlay */}
													<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
														<Form.Item name="banner" rules={[maxFileSizeRule]} valuePropName="fileList" className="m-0" getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}>
															<Upload accept="image/png, image/jpeg, image/jpg" multiple={false} beforeUpload={() => false} maxCount={1} showUploadList={false}>
																<Button type="primary" icon={<FileImageOutlined />} className="bg-primary border-none shadow-md">Cambiar Banner</Button>
															</Upload>
														</Form.Item>
													</div>
												</div>

												{/* Logo positioned overlapping the bottom left of banner */}
												<div className="absolute bottom-4 left-6 z-10">
													<div className="w-24 h-24 rounded-xl bg-white p-1 shadow-md border border-slate-200 overflow-hidden relative group/logo">
														<div className="w-full h-full rounded-lg bg-orange-200/50 flex items-center justify-center overflow-hidden">
															{establishment?.logoUrl ? (
																<img src={establishment.logoUrl} alt="Logo" className="w-full h-full object-cover" />
															) : (
																<span className="text-primary font-bold text-xs">Sin logo</span>
															)}
														</div>
														{/* Upload Logo overlay */}
														<div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer">
															<Form.Item name="logo" rules={[maxFileSizeRule]} valuePropName="fileList" className="m-0 absolute inset-0 z-20 w-full h-full opacity-0" getValueFromEvent={(e) => { if (Array.isArray(e)) return e; return e?.fileList; }}>
																<Upload accept="image/png, image/jpeg, image/jpg" multiple={false} beforeUpload={() => false} maxCount={1} showUploadList={false}>
																	<button className="w-full h-full" type="button" />
																</Upload>
															</Form.Item>
															<FileImageOutlined className="text-white text-xl z-10 pointer-events-none" />
														</div>
													</div>
												</div>
											</div>

											{/* Description area */}
											<div>
												<Form.Item
													label={<span className="text-sm font-semibold text-slate-700">Descripción del Restaurante</span>}
													name="description"
													rules={[{ required: true, message: "Describe tu negocio" }]}
													className="m-0"
												>
													<Input.TextArea
														placeholder="Cuenta la historia de tu cocina y qué hace especial a La Roca..."
														className="rounded-xl border-slate-200 bg-slate-50 p-4 focus:border-primary focus:ring-1 focus:ring-primary min-h-[120px] text-sm"
													/>
												</Form.Item>
											</div>

											{/* Missing Fields placed compactly below description */}
											<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
												<Form.Item label={<span className="text-sm font-semibold text-slate-700">Nombre del Local</span>} name="name" rules={[{ required: true, message: "Escribe el nombre" }]} className="m-0">
													<Input className="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary" />
												</Form.Item>
												<Form.Item label={<span className="text-sm font-semibold text-slate-700">URL del Menú</span>} name="domain" rules={[{ required: !establishment, message: "Elige tu URL" }]} className="m-0">
													<Input prefix="goqr.com.do/m/" disabled={!!establishment} className="rounded-lg border-slate-200 bg-slate-50 focus:border-primary focus:ring-1 focus:ring-primary"
														onInput={(event) => {
															const target = event.target as HTMLInputElement;
															target.value = target.value.toLowerCase().normalize("NFD").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s-]/g, "");
														}}
													/>
												</Form.Item>
												<Form.Item label={<span className="text-sm font-semibold text-slate-700">Color Principal</span>} name="mainHexColor" rules={[{ required: true, message: "Selecciona un color" }]} className="m-0">
													<ColorPicker size="large" defaultFormat="hex" showText disabledAlpha />
												</Form.Item>
											</div>
										</div>
									</section>

									{/* Section 2: Contact & Localization */}
									<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
										<div className="mb-6 flex items-center gap-2">
											<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
												<EnvironmentOutlined className="text-sm" />
											</div>
											<h2 className="text-lg font-bold m-0 text-slate-900">Contacto y Ubicación</h2>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
											<div className="flex flex-col gap-5">
												<Form.Item
													label='Teléfono'
													name="phone"
													rules={[{ type: "number" }]}
													className="m-0"
												>
													<InputNumber
														prefix={<span className="text-slate-400">📞</span>}
														controls={false}
														onKeyDown={avoidNotNumerics}
														style={{ width: '100%' }}
														maxLength={10}
														placeholder="+1 809-555-0123"
													/>
												</Form.Item>

												<Form.Item
													label='WhatsApp'
													name="whatsapp"
													rules={[{ type: "number" }]}
													className="m-0"
												>
													<InputNumber
														controls={false}
														prefix={<span className="text-slate-400">💬</span>}
														onKeyDown={avoidNotNumerics}
														maxLength={10}
														placeholder="+1 829-555-4567"
														style={{ width: '100%' }}
													/>
												</Form.Item>

												<Form.Item
													label='Dirección Física'
													name="address"
													className="m-0"
												>
													<Input
														prefix={<span className="text-slate-400">📍</span>}
														placeholder="Av. Abraham Lincoln 456, Santo Domingo"
														style={{ width: '100%' }}
													/>
												</Form.Item>
											</div>

											<div className="flex flex-col gap-2 relative">
												<span className="text-xs font-semibold text-slate-700 block mb-1">Enlace de Google Maps</span>
												<div className="w-full h-full min-h-[140px] rounded-xl bg-slate-100 border border-slate-200 relative overflow-hidden flex flex-col items-center justify-center p-4">
													{/* Map mockup background pattern could go here */}
													<div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')]"></div>
													<Form.Item name="addressLink" rules={[{ type: "url", message: "URL inválida" }]} className="m-0 z-10 w-full flex justify-center mt-2">
														<Input
															prefix={<span className="text-slate-400 mx-1">🔗</span>}
															className="w-full max-w-[200px] rounded-full border-slate-200 bg-white/90 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary py-2 text-center text-xs font-semibold text-slate-700"
															placeholder="Vincular Mapa"
														/>
													</Form.Item>
												</div>
											</div>
										</div>
									</section>

									{/* Section 3: Payments & Taxes */}
									<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
										<div className="mb-6 flex items-center gap-2">
											<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
												<CreditCardOutlined className="text-sm" />
											</div>
											<h2 className="text-lg font-bold m-0 text-slate-900">Pagos y Facturación</h2>
										</div>
										<div className="flex flex-col md:flex-row gap-8">
											<div className="flex-1 flex flex-col gap-2">
												<span className="text-xs font-semibold text-slate-700">Método de Pago</span>
												<Form.Item
													name="paymentMethod"
													rules={[{ required: true, message: "Elige un método" }]}
													className="m-0"
												>
													<Select
														className="w-full h-10 [&_.ant-select-selector]:rounded-lg [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-slate-50"
														options={[
															{ label: "Transferencia Bancaria", value: PaymentMethod.BankTransfer },
															{ label: "Tarjeta de Crédito o Débito", value: PaymentMethod.CreditCard },
														]}
													/>
												</Form.Item>
											</div>

											<div className="flex-1 flex flex-col gap-2">
												<span className="text-xs font-semibold text-slate-700">Plan de Pago Actual</span>
												<Form.Item
													name="paymentFrequency"
													rules={[{ required: true, message: "Elige un plan" }]}
													className="m-0"
												>
													<Select
														className="w-full h-10 [&_.ant-select-selector]:rounded-lg [&_.ant-select-selector]:border-slate-200 [&_.ant-select-selector]:bg-slate-50"
														options={[
															{ label: <div className="flex justify-between items-center"><Text className="font-semibold text-slate-800">Plan Mensual</Text><Text className="text-primary font-bold">$300 / mes</Text></div>, value: PaymentFrequency.Monthly },
															{ label: <div className="flex justify-between items-center"><Text className="font-semibold text-slate-800">Plan Anual</Text><Text className="text-primary font-bold">$2,500 / año</Text></div>, value: PaymentFrequency.Annual },
															{ label: <div className="flex justify-between items-center"><Text className="font-semibold text-slate-800">Plan Premium</Text><Text className="text-primary font-bold">$11,000 / mes</Text></div>, value: PaymentFrequency.Never },
														]}
													/>
												</Form.Item>
											</div>

											<div className="flex-1 flex flex-col gap-2">
												<span className="text-xs font-semibold text-slate-700">Comprobante Fiscal</span>
												<div className="flex items-center gap-3 h-10">
													<Form.Item
														name="requiresTaxReceipt"
														valuePropName="checked"
														className="m-0"
													>
														<Switch onChange={setRequiresTaxReceipt} defaultChecked={false} className="bg-slate-200 [&.ant-switch-checked]:bg-primary" />
													</Form.Item>
													<span className="text-sm text-slate-600">Habilitar NCF</span>
												</div>
											</div>
										</div>

										{requiresTaxReceipt && (
											<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6 pt-6 border-t border-slate-100">
												<div className="flex flex-col gap-2">
													<span className="text-xs font-semibold text-slate-700">RNC</span>
													<Form.Item
														name="rnc"
														rules={[{ required: true, message: "Escriba su RNC" }]}
														className="m-0"
													>
														<Input
															className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:border-primary"
															onKeyDown={avoidNotNumerics}
															minLength={9}
															maxLength={11}
														/>
													</Form.Item>
												</div>
												<div className="flex flex-col gap-2 md:col-span-2">
													<span className="text-xs font-semibold text-slate-700">Razón Social</span>
													<Form.Item
														name="companyName"
														rules={[{ required: true, message: "Escriba su Razón Social" }]}
														className="m-0"
													>
														<Input className="h-10 rounded-lg border-slate-200 bg-slate-50 focus:border-primary" />
													</Form.Item>
												</div>
											</div>
										)}
									</section>

									<div className="flex flex-col gap-6 w-full">
										{/* Section 4: Operating Hours */}
										<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full">
											<div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
												<div className="flex items-center gap-2">
													<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
														<ClockCircleOutlined className="text-sm" />
													</div>
													<h2 className="text-lg font-bold m-0 text-slate-900">Horarios de Operación</h2>
												</div>
												<Button type="text" onClick={() => { }} className="text-primary font-semibold hover:text-primary/80 hover:bg-transparent p-0 m-0">Añadir Excepción</Button>
											</div>
											<Form.List name="schedules">
												{(fields, { add, remove }) => (
													<div className="flex flex-col gap-2">
														{fields.map(({ key, name, ...restField }) => (
															<div key={key} className="flex items-center gap-4 py-2 px-4 rounded-xl bg-slate-50 border border-slate-100/50">
																{/* Dot Indicator */}
																<div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>

																{/* Days Select */}
																<div className="flex-1 w-full max-w-[200px]">
																	<Form.Item
																		{...restField}
																		name={[name, 'days']}
																		rules={[{ required: true, message: 'Días' }]}
																		className="m-0"
																	>
																		<Select
																			mode="tags"
																			placeholder="Días"
																			variant="borderless"
																			className="w-full text-sm font-semibold text-slate-700"
																			options={[
																				{ label: 'Lunes', value: 'Lunes' },
																				{ label: 'Martes', value: 'Martes' },
																				{ label: 'Miércoles', value: 'Miércoles' },
																				{ label: 'Jueves', value: 'Jueves' },
																				{ label: 'Viernes', value: 'Viernes' },
																				{ label: 'Sábado', value: 'Sábado' },
																				{ label: 'Domingo', value: 'Domingo' },
																			]}
																		/>
																	</Form.Item>
																</div>

																{/* Hours Range */}
																<div className="flex items-center gap-2 flex-1">
																	<Form.Item
																		{...restField}
																		name={[name, 'hours']}
																		rules={[{ required: true, message: 'Horario' }]}
																		className="m-0 w-full max-w-[280px]"
																	>
																		<TimePicker.RangePicker
																			use12Hours
																			format="hh:mm A"
																			variant="borderless"
																			separator={<span className="text-slate-400 text-xs px-2">a</span>}
																			className="w-full bg-white border border-slate-200 rounded-md py-1 px-3 text-sm shadow-sm"
																		/>
																	</Form.Item>
																</div>

																{/* Delete Button */}
																<Button
																	type="text"
																	icon={<DeleteOutlined className="text-slate-400 hover:text-red-500" />}
																	onClick={() => remove(name)}
																	className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-red-50"
																/>
															</div>
														))}

														<div className="flex items-center gap-4 py-2 px-4 rounded-xl mt-2 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => add()}>
															<div className="w-2 h-2 rounded-full bg-slate-300 flex-shrink-0"></div>
															<span className="text-sm font-semibold text-slate-500 flex-1">Nuevo Horario</span>
															<div className="flex-1 justify-center flex">
																<span className="text-xs text-slate-400 italic">Clic para configurar</span>
															</div>
															<div className="w-8 h-8 flex items-center justify-center">
																<PlusOutlined className="text-primary" />
															</div>
														</div>
													</div>
												)}
											</Form.List>
										</section>

										{/* Section 5: Social Networks */}
										<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm w-full">
											<div className="mb-6 flex items-center justify-between border-b border-slate-100 pb-4">
												<div className="flex items-center gap-2">
													<div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
														<GlobalOutlined className="text-sm" />
													</div>
													<h2 className="text-lg font-bold m-0 text-slate-900">Redes Sociales</h2>
												</div>
												<Button type="primary" ghost className="text-primary font-semibold border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-full px-4 h-8 text-xs flex items-center gap-1" onClick={() => {
													// Ensure add works by getting it from the render props or trigger manually
													// Since we are outside the Form.List scope here, we use form directly
													const socials = form.getFieldValue('socialNetworks') || [];
													form.setFieldsValue({ socialNetworks: [...socials, { platform: '', link: '', displayName: '' }] });
												}}>
													<PlusOutlined className="text-[10px]" /> Añadir Red
												</Button>
											</div>

											{/* Table Header */}
											<div className="grid grid-cols-12 gap-4 pb-3 mb-2 px-2 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">
												<div className="col-span-3">Plataforma</div>
												<div className="col-span-4">Enlace / Perfil</div>
												<div className="col-span-4">Nombre a mostrar</div>
												<div className="col-span-1 text-center">Acción</div>
											</div>

											<Form.List name="socialNetworks">
												{(fields, { remove }) => (
													<div className="flex flex-col">
														{fields.map(({ key, name, ...restField }) => (
															<div key={key} className="grid grid-cols-12 gap-4 items-center py-2 px-2 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors rounded-lg">
																<div className="col-span-3">
																	<Form.Item
																		{...restField}
																		name={[name, 'platform']}
																		rules={[{ required: true, message: 'Requerido' }]}
																		className="m-0"
																	>
																		<Select
																			variant="borderless"
																			placeholder="Seleccionar"
																			className="w-full font-semibold text-slate-800 text-sm"
																			options={[
																				{ label: 'Instagram', value: 'instagram' },
																				{ label: 'Facebook', value: 'facebook' },
																				{ label: 'TikTok', value: 'tiktok' },
																				{ label: 'X (Twitter)', value: 'x' },
																				{ label: 'Website', value: 'website' }
																			]}
																		/>
																	</Form.Item>
																</div>
																<div className="col-span-4 text-sm">
																	<Form.Item
																		{...restField}
																		name={[name, 'link']}
																		rules={[{ required: true, message: 'Requerido' }]}
																		className="m-0"
																	>
																		<Input
																			variant="borderless"
																			placeholder="instagram.com/miperfil"
																			className="w-full text-slate-600 px-0"
																			onChange={(e) => {
																				const val = e.target.value;
																				const platform = form.getFieldValue(['socialNetworks', name, 'platform']);
																				const currentDisplayName = form.getFieldValue(['socialNetworks', name, 'displayName']);
																				if (platform && val && !currentDisplayName) {
																					const inferred = getSocialUsername(platform, val);
																					if (inferred) {
																						const currentNetworks = form.getFieldValue('socialNetworks') || [];
																						if (currentNetworks[name]) {
																							currentNetworks[name] = { ...currentNetworks[name], displayName: inferred };
																							form.setFieldsValue({ socialNetworks: currentNetworks });
																						}
																					}
																				}
																			}}
																		/>
																	</Form.Item>
																</div>
																<div className="col-span-4 text-sm font-semibold">
																	<Form.Item
																		{...restField}
																		name={[name, 'displayName']}
																		className="m-0"
																	>
																		<Input variant="borderless" placeholder="@miperfil" className="w-full text-slate-800 px-0" />
																	</Form.Item>
																</div>
																<div className="col-span-1 flex justify-center">
																	<Button
																		type="text"
																		icon={<DeleteOutlined className="text-slate-400 hover:text-red-500" />}
																		onClick={() => remove(name)}
																		className="w-8 h-8 rounded-md hover:bg-red-50 flex items-center justify-center"
																	/>
																</div>
															</div>
														))}
													</div>
												)}
											</Form.List>
										</section>
									</div>
								</div>
								<br />

								<Row justify='end'>
									<Space style={{ alignSelf: 'flex-end' }}>
										<Button
											type='text'
											onClick={() => navigate(-1)}
											disabled={saving}
										>
											Descartar
										</Button>
										<Button
											// className="flex-1 md:flex-none rounded-lg bg-primary px-8 py-5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all border-none"
											loading={saving}
											onClick={form.submit}
											color="primary"
											type='primary'
										>
											Guardar Cambios
										</Button>
									</Space>
								</Row>
							</Form>
						</div>
					</main>
				</div>
			</div >
		</div >
	);
}
