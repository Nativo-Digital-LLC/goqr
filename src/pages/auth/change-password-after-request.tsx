import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ClockCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import HomeContainer from "../containers/HomeContainer";
import { useResetPasswordWithSecret } from "../../hooks/useAuth";
import { useErrorHandler } from "../../hooks/useError";

export default function ChangePasswordAfterRequestPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const { userId, secret, expire } = useMemo(() => {
		const params = new URLSearchParams(location.search);

		return {
			userId: params.get('userId'),
			secret: params.get('secret'),
			expire: params.get('expire')
		}
	}, [location]);
	const [reset, loading, error] = useResetPasswordWithSecret();
	useErrorHandler(error);

	if (!userId || !secret || !expire) {
		return (
			<HomeContainer>
				<div className="section-parent bg-[var(--secondary)]">
					<div className="w-full flex flex-col items-center p-[20px]">
						<div className="max-w-[450px] w-full">
							<div className="p-[30px] bg-[--primary] border border-[var(--text)] rounded-[15px] shadow-md shadow-[#00000030]">
								<CloseCircleOutlined style={{ fontSize: 100, color: '#e74c3c' }} />
								<br />
								<br />
								<h1 className="text-center text-[24px] font-[700] mb-[25px]">
									Enlace Inválido
								</h1>
								<p>El enlace para restablecer no es válido, por favor solicita un nuevo enlace.</p>
								<br />

								<Link to='/request-reset-password'>
									<Button
										type="primary"
										className="border border-[var(--text)] mt-[10px] h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
									>
										Solicitar nuevo enlace
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</HomeContainer>
		);
	}

	if (dayjs().isAfter(dayjs(expire))) {
		return (
			<HomeContainer>
				<div className="section-parent bg-[var(--secondary)]">
					<div className="w-full flex flex-col items-center p-[20px]">
						<div className="max-w-[450px] w-full">
							<div className="p-[30px] bg-[--primary] border border-[var(--text)] rounded-[15px] shadow-md shadow-[#00000030]">
								<ClockCircleOutlined style={{ fontSize: 100, color: '#f39c12' }} />
								<br />
								<br />
								<h1 className="text-center text-[24px] font-[700] mb-[25px]">
									Enlace Expirado
								</h1>
								<p>El enlace para restablecer tu contraseña ha expirado.</p>
								<br />

								<Link to='/request-reset-password'>
									<Button
										type="primary"
										className="border border-[var(--text)] mt-[10px] h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
									>
										Solicitar nuevo enlace
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</HomeContainer>
		);
	}

	return (
		<HomeContainer>
			<div className="section-parent bg-[var(--secondary)]">
				<div className="w-full flex flex-col items-center p-[20px]">
					<div className="max-w-[450px] w-full">
						<div className="p-[30px] bg-[--primary] border border-[var(--text)] rounded-[15px] shadow-md shadow-[#00000030]">
							<h1 className="text-center text-[24px] font-[700] mb-[25px]">
								Nueva Contraseña
							</h1>
							<p>Por favor ingresa y confirma tu nueva contraseña.</p>
							<br />
							<Form
								requiredMark={false}
								layout="vertical"
								onFinish={({ password }) => reset(
									userId,
									secret,
									password,
									async () => {
										const { isConfirmed } = await Swal.fire({
											title: 'Nueva contraseña guardada',
											text: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
											icon: 'success',
											confirmButtonText: 'Iniciar Sesión',
											cancelButtonText: 'Cerrar',
											showCancelButton: true,
											reverseButtons: true
										});

										if (isConfirmed) {
											navigate('/login');
										}
									}
								)}
							>
								<Form.Item
									label="Nueva Contraseña"
									name="password"
									rules={[
										{
											required: true,
											message: "Ingresa tu nueva contraseña",
										},
										{
											min: 8,
											message: "Tu contraseña debe tener almenos 8 caracteres",
										},
									]}
									className="font-[500]"
									hasFeedback
								>
									<Input.Password
										className="bg-[--field] font-[400] border border-[var(--text)]"
										size="large"
									/>
								</Form.Item>

								<Form.Item
									label="Confirmar Contraseña"
									name="passwordConfirmation"
									dependencies={['password']}
									rules={[
										{
											required: true,
											message: "Confirma tu nueva contraseña",
										},
										{
											min: 8,
											message: "Tu contraseña debe tener almenos 8 caracteres",
										},
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue('password') === value) {
													return Promise.resolve();
												}

												return Promise.reject(new Error('Las contraseñas no coinciden'));
											}
										})
									]}
									className="font-[500]"
								>
									<Input.Password
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
									Guardar Nueva Contraseña
								</Button>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
