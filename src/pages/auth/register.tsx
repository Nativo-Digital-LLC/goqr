import { useMemo } from "react";
import { Alert, Button, Checkbox, Form, Input } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
	useHandleOAuth2Session,
	useLogin,
	useRegister,
} from "../../hooks/useAuth";

import { isAppleDevice } from "../../utils/helpers";

import GoogleIcon from "../../assets/images/icons/google-icon.svg";
import AppleIcon from "../../assets/images/icons/apple-icon.svg";

import HomeContainer from "../containers/HomeContainer";

export default function RegisterPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const status = useMemo(() => {
		const params = new URLSearchParams(location.search);
		const status = params.get("status");

		return status as "success" | "failed" | undefined;
	}, [location]);

	const [register, loading] = useRegister();
	const [loadingOauth2, oauth2Error] = useHandleOAuth2Session(status);
	const [login, loadingLogin, loginType] = useLogin();

	return (
		<HomeContainer>
			<div className="section-parent bg-[var(--secondary)]">
				<div className="w-full flex flex-col items-center p-[20px]">
					<div className="max-w-[450px] w-full">
						<div className="p-[30px] bg-[--primary] rounded-[15px] shadow-md shadow-[#00000030] border border-[var(--text)]">
							<h1 className="text-center text-[24px] font-[700] mb-[25px]">
								Registro
							</h1>
							<Form
								requiredMark={false}
								layout="vertical"
								onFinish={({ name, email, password }) =>
									register(name, email, password, () =>
										navigate("/dashboard")
									)
								}
							>
								<Form.Item
									label="Nombre"
									name="name"
									rules={[
										{
											required: true,
											message: "Ingresa tu nombre",
										},
									]}
									className="font-[500]"
								>
									<Input
										className="bg-[--field] font-[400] border border-[var(--text)]"
										size="large"
										placeholder="James"
									/>
								</Form.Item>

								<Form.Item
									label="Correo Electrónico"
									name="email"
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
										type="email"
										size="large"
										placeholder="jhon@gmail.com"
										className="bg-[--field] font-[400] border border-[var(--text)]"
									/>
								</Form.Item>

								<Form.Item
									label="Contraseña"
									name="password"
									rules={[
										{
											required: true,
											message: "Ingresa una contraseña",
										},
										{
											min: 8,
											message:
												"La contraseña debe tener 8 caracteres o mas",
										},
									]}
									validateTrigger="onBlur"
									className="font-[500]"
								>
									<Input.Password
										placeholder="8 caracteres o más"
										className="bg-[--field] font-[400] border border-[var(--text)]"
										size="large"
									/>
								</Form.Item>
								<Form.Item
									name="accepted"
									valuePropName="checked"
									rules={[
										{
											required: true,
											message:
												"Debes aceptar los términos y condiciones para crear una cuenta",
										},
									]}
									className="mt-[30px]"
								>
									<Checkbox className="text-[14px] font-[500]">
										Aceptar términos y condiciones
									</Checkbox>
								</Form.Item>

								<Button
									type="primary"
									htmlType="submit"
									loading={loading}
									className="border border-[var(--text)] h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
								>
									Crear Cuenta
								</Button>
								<div className="flex items-center my-[10px]">
									<div className="h-[1px] bg-[--border] w-full" />
									<span className="text-[--border] pb-[3px] mx-[10px]">
										o
									</span>
									<div className="h-[1px] bg-[--border] w-full" />
								</div>
								<div className="flex justify-between items-center gap-3">
									<Button
										type="primary"
										className="border border-[var(--text)] h-[38px] rounded-[8px] w-full bg-[#FFF] text-[--text] shadow-none hover:!text-[--text] hover:!bg-[#FFF] outline-none hover:!border-[--border]"
										onClick={() =>
											login("Google", {
												page: "register",
											})
										}
										loading={
											loginType === "Google" &&
											(loadingOauth2 || loadingLogin)
										}
									>
										<img
											className="h-[20px] w-[20px]"
											src={GoogleIcon}
											alt="Sign up with google"
										/>
										Registrarse con Google
									</Button>
									{isAppleDevice && (
										<Button
											type="primary"
											className="h-[38px] rounded-[8px] w-full bg-[--tertiary] border-[--border] text-[--text] shadow-none hover:!text-[--text] hover:!bg-[--tertiary] outline-none hover:!border-[--border]"
											onClick={() =>
												login("Apple", {
													page: "register",
												})
											}
											loading={
												loginType === "Apple" &&
												(loadingOauth2 || loadingLogin)
											}
										>
											<img
												className="w-[14px]"
												src={AppleIcon}
												alt="Sign up with apple"
											/>
											Registrarse con Apple
										</Button>
									)}
								</div>
								{oauth2Error &&
									typeof oauth2Error === "string" && (
										<Alert
											message={oauth2Error}
											type="error"
											showIcon
										/>
									)}

								<p className="text-[12px] text-center mt-[30px]">
									Podrás encontrar nuestros Términos de
									Servicio en este{" "}
									<Link
										to="/terms"
										className="text-[--secondary] hover:text-[--secondary]"
									>
										enlace
									</Link>
									.
								</p>
							</Form>
						</div>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
