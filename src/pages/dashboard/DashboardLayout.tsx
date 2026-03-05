import {
	Layout,
	// Menu,
	// Dropdown
} from "antd";
// import { BellOutlined, UserOutlined, MenuOutlined, FileTextOutlined } from "@ant-design/icons";
import {
	// Link,
	Outlet
} from "react-router-dom";

// import { useLogout } from "../../hooks/useAuth";

const {
	// Header,
	Content,
	// Sider
} = Layout;

export default function DashboardLayout() {
	// const [logout] = useLogout();

	return (
		<Layout style={{ minHeight: '100vh' }}>
			{/* <Header style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
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
								{ key: 'billing', label: <Link to="/dashboard/invoices">Facturación</Link> },
								{ key: 'logout', label: 'Cerrar Sesión', onClick: () => logout(() => (location.href = "/")) },
							],
						}}
					>
						<UserOutlined style={{ fontSize: 18, cursor: 'pointer' }} />
					</Dropdown>
				</div>
			</Header> */}
			<Layout>
				{/* <Sider style={{ background: '#fff' }}>
					<Menu
						mode="inline"
						items={[
							{
								key: 'menus',
								icon: <MenuOutlined />,
								label: <Link to="/dashboard/menus">Menús</Link>,
							},
							{
								key: 'invoices',
								icon: <FileTextOutlined />,
								label: <Link to="/dashboard/invoices">Facturas</Link>,
							},
						]}
					/>
				</Sider> */}
				<Layout>
					<Content style={{ padding: 20 }}>
						<Outlet />
					</Content>
				</Layout>
			</Layout>
		</Layout>
	);
}