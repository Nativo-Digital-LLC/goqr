import { Button, Card, Col, Row, Space, Typography, Layout, Menu, Table, Dropdown } from "antd";
import { AppstoreAddOutlined, MenuOutlined, FileTextOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useGetEstablishmentsByUserId } from "../hooks/useEstablishments";
import { useSessionStore } from "../store/session";
import { useLogout } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { auth } from "../utils/firebase";
import { useGetBillsByUserId } from "../hooks/useBills";
import { BillProps } from "../types/Bill";

const { Text } = Typography;

const invoiceColumns = [
	{
		title: 'Número de Órden',
		dataIndex: 'orderNumber',
		key: 'orderNumber',
	},
	{
		title: 'Fecha de Emisión',
		dataIndex: 'createdAt',
		key: 'createdAt',
		render: (date: string) => new Date(date).toLocaleDateString(),
	},
	{
		title: 'Estado',
		dataIndex: 'isPayed',
		key: 'isPayed',
		render: (isPayed: boolean) => isPayed ? 'Pagada' : 'Pendiente',
	},
	{
		title: 'Monto',
		dataIndex: 'amount',
		key: 'amount',
		render: (amount: number) => `$${amount}`,
	},
	{
		title: 'Periodo Facturado',
		dataIndex: 'billingPeriod',
		key: 'billingPeriod',
	},
	{
		title: 'Acción',
		key: 'action',
		render: (record: BillProps) => (
			record.isPayed ? (
				<Button disabled>Pagada</Button>
			) : (
				<Button type="primary" onClick={() => window.open(record.paymentUrl, '_blank')}>
					Pagar
				</Button>
			)
		),
	},
];

export default function DashboardPage() {
	const navigate = useNavigate();
	const [loadingSession, setLoadingSession] = useState(true);
	const [selectedMenu, setSelectedMenu] = useState('menus');

	const { session, setSession } = useSessionStore((session) => session);
	const [establishments, loadingEstablishments] = useGetEstablishmentsByUserId(session?.userId);
	const [bills, loadingBills] = useGetBillsByUserId(session?.userId);
	const [logout] = useLogout();

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				setLoadingSession(false);
			} else {
				setSession(null);
				navigate("/login");
			}
		});

		return () => unsubscribe();
	}, [setSession, navigate]);

	// Temp solution - Pending refactor
	useEffect(() => {
		if (loadingEstablishments) return;

		if (establishments.length === 0)
			navigate("/panel/establishments", {
				state: { disableReturn: true },
			});
	}, [establishments, loadingEstablishments, navigate]);

	if (loadingSession || loadingEstablishments) return "";

	const { Content, Sider, Header } = Layout;

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src="/icon.svg" alt="Logo" style={{ height: 32, marginRight: 8 }} />
					<span style={{ fontSize: 18, fontWeight: 'bold' }}>GoQR</span>
				</div>
				<div>
					<BellOutlined style={{ fontSize: 18, marginRight: 16, cursor: 'pointer' }} />
					<Dropdown
						menu={{
							items: [
								{ key: 'profile', label: 'Perfil' },
								{ key: 'settings', label: 'Configuración' },
								{ key: 'billing', label: 'Facturación', onClick: () => setSelectedMenu('invoices') },
								{ key: 'logout', label: 'Cerrar Sesión', onClick: () => logout(() => (location.href = "/")) },
							],
						}}
					>
						<UserOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
					</Dropdown>
				</div>
			</Header>
			<Layout>
				<Sider style={{ background: '#fff' }}>
					<Menu
						mode="inline"
						selectedKeys={[selectedMenu]}
						onClick={({ key }) => setSelectedMenu(key)}
						items={[
							{
								key: 'menus',
								icon: <MenuOutlined />,
								label: 'Menús',
							},
							{
								key: 'invoices',
								icon: <FileTextOutlined />,
								label: 'Facturas',
							},
						]}
					/>
				</Sider>
				<Layout>
					<Content style={{ padding: 20 }}>
						{selectedMenu === 'menus' && (
							<>
								<h2>Establecimientos</h2>
								<br />
								<div>
									<Row gutter={[20, 20]}>
										{establishments.map(({ id, name, domain }) => (
											<Col xs={24} sm={12} md={8} lg={6} key={id}>
												<Card>
													<Space direction="vertical">
														<Text strong>{name}</Text>
														<Text copyable>goqr.com.do/m/{domain}</Text>
													</Space>
													<br />
													<br />
													<br />

													<Link to={`/m/${domain}`}>
														<Button
															type="primary"
															style={{ width: "100%" }}
														>
															Editar Menú
														</Button>
													</Link>
												</Card>
											</Col>
										))}

										<Col xs={24} sm={12} md={8} lg={6}>
											<Card
												style={{
													height: "100%",
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
												onClick={() => navigate("/panel/establishments")}
												hoverable
											>
												<AppstoreAddOutlined
													style={{ fontSize: 32, display: "block" }}
												/>
												<br />
												<Text strong>Añadir Local</Text>
											</Card>
										</Col>
									</Row>
								</div>
							</>
						)}
						{selectedMenu === 'invoices' && (
							<>
								<h2>Facturas</h2>
								<br />
								<Table
									columns={invoiceColumns}
									dataSource={bills}
									pagination={false}
									loading={loadingBills}
								/>
							</>
						)}
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}
