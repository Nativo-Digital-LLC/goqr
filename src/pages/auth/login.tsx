import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";

import { useLogin } from "../../hooks/useAuth";

import GoogleIcon from "../../assets/images/icons/google-icon.svg";

import HomeContainer from "../containers/HomeContainer";

export default function LoginPage() {
	const navigate = useNavigate();
	const [login, loading] = useLogin();

	return (
		<HomeContainer isAuth>
			<div className="w-full flex flex-col items-center pt-[40px]">
				<div className="max-w-[450px] w-full">
					<div className="p-[30px] bg-[--tertiary] rounded-[15px] shadow-md shadow-[#00000030]">
						<h1 className="text-center text-[24px] font-[700] mb-[25px]">
							Iniciar Sesión
						</h1>
						<Form
							requiredMark={false}
							layout="vertical"
							onFinish={({ email, password }) =>
								login(email, password, () =>
									navigate("/dashboard")
								)
							}
						>
							<Form.Item
								label="Correo Electrónico"
								name="email"
								required
								className="font-[500]"
							>
								<Input
									placeholder="test@example.com"
									type="email"
									className="bg-[--field] font-[400]"
									size="large"
								/>
							</Form.Item>

							<Form.Item
								label="Contraseña"
								name="password"
								required
								className="font-[500]"
							>
								<Input.Password
									className="bg-[--field] font-[400]"
									size="large"
								/>
							</Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
								className="h-[38px] rounded-[8px] w-full bg-[--secondary] shadow-none hover:!bg-[--secondary] outline-none hover:!border-none"
							>
								Acceder
							</Button>
							<div className="flex items-center my-[10px]">
								<div className="h-[1px] bg-[--border] w-full" />
								<span className="text-[--border] pb-[3px] mx-[10px]">
									o
								</span>
								<div className="h-[1px] bg-[--border] w-full" />
							</div>
							<Button
								type="primary"
								className="h-[38px] rounded-[8px] w-full bg-[--tertiary] border-[--border] text-[--text] shadow-none hover:!text-[--text] hover:!bg-[--tertiary] outline-none hover:!border-[--border]"
							>
								<img
									className="h-[20px] w-[20px]"
									src={GoogleIcon}
									alt="Sign in with google"
								/>
								Iniciar con Google
							</Button>
						</Form>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
