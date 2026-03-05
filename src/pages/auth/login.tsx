import { useNavigate, useLocation, Link } from "react-router-dom";
import { Alert, Button, Form, Input } from "antd";
import { useEffect, useMemo } from "react";

import { useHandleOAuth2Session, useLogin } from "../../hooks/useAuth";

import { useSessionStore } from "../../store/session";


import { isAppleDevice } from "../../utils/helpers";

import GoogleIcon from "../../assets/images/icons/google-icon.svg";
import AppleIcon from "../../assets/images/icons/apple-icon.svg";

import HomeContainer from "../containers/HomeContainer";

export default function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const status = useMemo(() => {
		const params = new URLSearchParams(location.search);
		const status = params.get("status");

		return status as "success" | "failed" | undefined;
	}, [location]);

	const session = useSessionStore(({ session }) => session);
	const [login, loading, loginType, error] = useLogin();
	const [loadingOauth2, oauth2Error] = useHandleOAuth2Session(status);

	useEffect(() => {
		if (session) {
			navigate("/dashboard");
		}
	}, [session, navigate]);

	return (
		<HomeContainer>
			<div className="section-parent bg-[var(--secondary)]">
				<div className="w-full flex flex-col items-center p-[20px]">
					<div className="max-w-[450px] w-full">
						<div className="p-[30px] bg-[--primary] border border-[var(--text)] rounded-[15px] shadow-md shadow-[#00000030]">
							<h1 className="text-center text-[24px] font-[700] mb-[25px]">
								Iniciar Sesión
							</h1>
							<Form
								requiredMark={false}
								layout="vertical"
								onFinish={({ email, password }) =>
									login(
										"EmailAndPassword",
										{
											email,
											password,
											page: "login",
										},
										() => navigate("/dashboard")
									)
								}
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

								<Form.Item
									label="Contraseña"
									name="password"
									rules={[
										{
											required: true,
											message: "Ingresa tu contraseña",
										},
										{
											min: 8,
											message:
												"Tu contraseña debe tener almenos 8 caracteres",
										},
									]}
									validateTrigger="onBlur"
									className="font-[500]"
								>
									<Input.Password
										className="bg-[--field] font-[400] border border-[var(--text)]"
										size="large"
										minLength={8}
									/>
								</Form.Item>
								<div className='text-end mb-3'>
									<Link
										to='/request-reset-password'
									>
										¿Olvidaste tu contraseña?
									</Link>
								</div>

								<Button
									type="primary"
									htmlType="submit"
									loading={
										loading &&
										loginType === "EmailAndPassword"
									}
									className="border border-[var(--text)] mt-[10px] h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
								>
									Acceder
								</Button>

								{error && (
									<Alert
										style={{ marginTop: 20 }}
										type={
											error.code === 'auth/invalid-credential' ||
												error.code === 'auth/user-not-found' ||
												error.code === 'auth/wrong-password'
												? "warning"
												: "error"
										}
										message={
											error.code === 'auth/invalid-credential' ||
												error.code === 'auth/user-not-found' ||
												error.code === 'auth/wrong-password'
												? "Correo o contraseña incorrecta"
												: "Algo salió mal 😓, por favor intentalo más tarde"
										}
										showIcon
									/>
								)}

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
												page: "login",
											})
										}
										loading={
											loadingOauth2 ||
											(loading && loginType === "Google")
										}
									>
										<img
											className="h-[20px] w-[20px]"
											src={GoogleIcon}
											alt="Sign in with google"
										/>
										Ingresar con Google
									</Button>
									{isAppleDevice && (
										<Button
											type="primary"
											className="h-[38px] rounded-[8px] w-full bg-[--tertiary] border-[--border] text-[--text] shadow-none hover:!text-[--text] hover:!bg-[#FFF] outline-none hover:!border-[--border]"
											onClick={() =>
												login("Apple", {
													page: "login",
												})
											}
											loading={
												loadingOauth2 ||
												(loading &&
													loginType === "Apple")
											}
										>
											<img
												className="w-[14px]"
												src={AppleIcon}
												alt="Sign in with apple"
											/>
											Ingresar con Apple
										</Button>
									)}
								</div>

								{oauth2Error &&
									typeof oauth2Error === "string" && (
										<Alert
											message={oauth2Error}
											type="error"
											style={{ marginTop: 20 }}
											showIcon
										/>
									)}
							</Form>
						</div>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
