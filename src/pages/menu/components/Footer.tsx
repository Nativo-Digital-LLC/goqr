import { Link } from 'react-router-dom';
import { DollarOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { ReactElement } from 'react';

const { Text } = Typography;

export const MenuFooter = () => (
	<footer
		style={{
			display: 'flex',
			justifyContent: 'space-around',
			alignItems: 'center',
			padding: '10px 0'
		}}
	>
		<Button
			icon={<EditOutlined style={{ fontSize: 24 }} />}
			text='Editar Menú'
			to='/'
		/>

		<Button
			icon={<QrcodeOutlined style={{ fontSize: 24 }} />}
			text='Código QR'
			to='/'
		/>

		<Button
			icon={<DollarOutlined style={{ fontSize: 24 }} />}
			text='Facturación'
			to='/'
		/>
	</footer>
);

interface ButtonProps {
	icon: ReactElement;
	text: string;
	to: string;
}

const Button = ({ text, icon, to }: ButtonProps) => (
	<Link to={to} style={{ textAlign: 'center', cursor: 'pointer' }}>
		{icon}
		<br />
		<Text>{text}</Text>
	</Link>
);
