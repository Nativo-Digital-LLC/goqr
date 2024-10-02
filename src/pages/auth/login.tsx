import { Button, Form, Input, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import { useLogin } from '../../hooks/useAuth';

export default function LoginPage() {
	const navigate = useNavigate();
	const [login, loading] = useLogin();

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: 'rgba(0, 0, 0, 0.04)',
				height: '100vh'
			}}
		>
			<div
				style={{
					borderRadius: 15,
					backgroundColor: '#FFF',
					padding: 20,
					width: 400
				}}
			>
				<h1>Login</h1>
				<br />

				<Form
					layout='vertical'
					onFinish={({ email, password }) => login(
						email,
						password,
						() => navigate('/dashboard')
					)}
				>
					<Form.Item
						label='Correo Electrónico'
						name='email'
						required
					>
						<Input type='email' />
					</Form.Item>

					<Form.Item
						label='Contraseña'
						name='password'
						required
					>
						<Input.Password />
					</Form.Item>

					<Space>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading}
						>
							Acceder

						</Button>

						o

						<Link to='/register'>
							<Button type='default'>
								Crear Cuenta
							</Button>
						</Link>
					</Space>
				</Form>
			</div>
		</div>
	);
}
