import { Link } from "react-router-dom";
import { Button, Form, Input } from "antd";
import Swal from "sweetalert2";

import HomeContainer from "../containers/HomeContainer";
import { useRequestResetPasswordEmail } from "../../hooks/useAuth";
import { useErrorHandler } from "../../hooks/useError";

export default function RequestResetPasswordPage() {
	const [request, loading, error] = useRequestResetPasswordEmail();
	useErrorHandler(error);

	return (
		<HomeContainer>
			<div className="section-parent bg-[var(--secondary)]">
				<div className="w-full flex flex-col items-center p-[20px]">
					<div className="max-w-[450px] w-full">
						<div className="p-[30px] bg-[--primary] border border-[var(--text)] rounded-[15px] shadow-md shadow-[#00000030]">
							<h1 className="text-center text-[24px] font-[700] mb-[25px]">
								Restablecer Contraseña
							</h1>
							<p>Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.</p>
							<br />
							<Form
								requiredMark={false}
								layout="vertical"
								onFinish={({ email }) => request(email, () => Swal.fire(
									'📩 Correo enviado exitosamente',
									'Recibirás un enlace para restablecer tu contraseña en unos minutos. No olvides revisar tu bandeja de spam o correo no deseado.',
									'success'
								))}
							>
								<Form.Item
									label="Correo Electrónico"
									name="email"
									validateTrigger="onBlur"
									rules={[
										{
											required: true,
											message:
												"Ingresa tu correo electrónico",
										},
										{
											type: "email",
											message: "Correo inválido",
										},
									]}
									className="font-[500]"
								>
									<Input
										placeholder="jhon@gmail.com"
										type="email"
										className="bg-[--field] font-[400] border border-[var(--text)]"
										size="large"
									/>
								</Form.Item>

								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="border border-[var(--text)] mt-[10px] h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
								>
									Enviar Instrucciones
								</Button>

								<div className="flex items-center my-[10px]">
									<div className="h-[1px] bg-[--border] w-full" />
									<span className="text-[--border] pb-[3px] mx-[10px]">
										o
									</span>
									<div className="h-[1px] bg-[--border] w-full" />
								</div>
								<Link to='/login'>
									<Button
										type="text"
										className="border border-[var(--text)] h-[38px] rounded-[8px] w-full bg-[#FFF] text-[--text] shadow-none hover:!text-[--text] hover:!bg-[#FFF] outline-none hover:!border-[--border]"
									>
										Volver a Inicio de Sesión
									</Button>
								</Link>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
