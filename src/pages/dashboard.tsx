import { Button, Card, Col, Row, Space, Typography } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { useGetEstablishmentsByUserId } from '../hooks/useEstablishments';
import { ModalEstablishment } from '../components';
import { ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';
import { useSessionStore } from '../store/session';

const { Text } = Typography;

export default function DashboardPage() {
	const session = useSessionStore(({ session }) => session);
	const [establishments, , , reload] = useGetEstablishmentsByUserId(session?.userId);

	return (
		<div style={{ maxWidth: 900, margin: '0 auto', padding: 20 }}>
			<h2>Establecmimientos</h2>
			<br />
			<div>
				<Row gutter={20}>
					{establishments.map(({ $id, name, domain }) => (
						<Col
							xs={24}
							sm={12}
							md={8}
							lg={6}
							key={$id}
						>
							<Card>
								<Space direction='vertical'>
									<Text strong>{name}</Text>
									<Text copyable>goqr.com.do/m/{domain}</Text>
								</Space>
								<br />
								<br />
								<br />

								<Link to={`/m/${domain}`}>
									<Button type='primary' style={{ width: '100%' }}>
										Editar Menú
									</Button>
								</Link>
							</Card>
						</Col>
					))}

					<Col
						xs={24}
						sm={12}
						md={8}
						lg={6}
					>
						<Card
							style={{
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
							onClick={() => ModalOpener$.next({ name: ModalName.Establishment })}
							hoverable
						>
							<AppstoreAddOutlined style={{ fontSize: 32, display: 'block' }} />
							<br />
							<Text strong>Añadir Local</Text>
						</Card>
					</Col>
				</Row>
			</div>

			<ModalEstablishment
				onFinish={() => reload(`${session?.userId}`)}
			/>
		</div>
	)
}
