import { Link } from 'react-router-dom';
import { DollarOutlined, EditOutlined, QrcodeOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

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
		<Link to='/' style={{ textAlign: 'center' }}>
			<EditOutlined style={{ fontSize: 24 }} />
			<br />
			<Text>Editar Menú</Text>
		</Link>

		<Link to='/' style={{ textAlign: 'center' }}>
			<QrcodeOutlined style={{ fontSize: 24 }} />
			<br />
			<Text>Código QR</Text>
		</Link>

		<Link to='/' style={{ textAlign: 'center' }}>
			<DollarOutlined style={{ fontSize: 24 }} />
			<br />
			Facturación
		</Link>
	</footer>
)
