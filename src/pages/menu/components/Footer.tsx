import { Link } from 'react-router-dom';
import { DollarOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { ReactElement } from 'react';

const { Text } = Typography;

export const MenuFooter = ({ domain }: { domain: string; }) => (
	<footer
		style={{
			display: 'flex',
			justifyContent: 'space-around',
			alignItems: 'center',
			padding: '10px 0',
			position: 'sticky',
			bottom: 0,
			zIndex: 100,
			backgroundColor: '#FFF'
		}}
	>
		<Button
			icon={<EditOutlined style={{ fontSize: 24 }} />}
			text='Editar Menú'
			to={`/m/${domain}`}
		/>

		<Button
			icon={<QrcodeOutlined style={{ fontSize: 24 }} />}
			text='Código QR'
			to={`/qr/${domain}`}
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
	<Link
		to={to}
		style={{ textAlign: 'center', cursor: 'pointer' }}
	>
		{icon}
		<br />
		<Text>{text}</Text>
	</Link>
);
