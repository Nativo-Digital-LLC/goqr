import { Button, Checkbox, Form, Input, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

import { useRegister } from '../../hooks/useAuth';

export default function RegisterPage() {
	const navigate = useNavigate();
	const [register, loading, error] = useRegister();
	console.log(error);

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
					width: 540
				}}
			>
				<h1>Registro</h1>
				<br />

				<Form
					layout='vertical'
					onFinish={({ name, email, password }) => register(
						name,
						email,
						password,
						() => navigate('/dashboard')
					)}
				>
					<Form.Item
						label='Tu Nombre'
						name='name'
						required
					>
						<Input />
					</Form.Item>

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
						<Input.Password placeholder='6 Caracteres o más' />
					</Form.Item>

					<Form.Item
						name='accepted'
						valuePropName='checked'
						required
					>
						<Checkbox> La creación de una cuenta significa que aceptas nuestros Términos de Servicio </Checkbox>
					</Form.Item>

					<Space>
						<Button
							type='primary'
							htmlType='submit'
							loading={loading}
						>
							Crear Cuenta
						</Button>

						o

						<Button type='default'>
							Acceder
						</Button>
					</Space>
					<br />
					<br />

					<p>
						Podrás encontrar nuestros Términos de Servicio en este enlace.
					</p>
				</Form>
			</div>
		</div>
	);
}
