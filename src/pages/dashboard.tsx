import { Button, Card, Col, Row, Space, Typography } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useGetEstablishmentsByUserId } from "../hooks/useEstablishments";
import { useSessionStore } from "../store/session";
import { useLogout } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { account } from "../utils/appwrite";

const { Text } = Typography;

export default function DashboardPage() {
	const navigate = useNavigate();
	const [loadingSession, setLoadingSession] = useState(true);

	const { session, setSession } = useSessionStore((session) => session);
	const [establishments, loadingEstablishments] =
		useGetEstablishmentsByUserId(session?.userId);
	const [logout, closingSession] = useLogout();

	useEffect(() => {
		const id = session?.$id ?? "";
		account
			.getSession(id)
			.then(() => {
				setLoadingSession(false);
			})
			.catch(() => {
				setSession(null);
				navigate("/login");
			});
	}, [session, setSession, navigate]);

	// Temp solution - Pending refactor
	useEffect(() => {
		if (loadingEstablishments) return;

		if (establishments.length === 0)
			navigate("/panel/establishments", {
				state: { props: { disableReturn: true } },
			});
	}, [establishments, loadingEstablishments, navigate]);

	if (loadingSession || loadingEstablishments) return "";

	return (
		<div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
			<h2>Establecimientos</h2>
			<br />
			<div>
				<Row gutter={[20, 20]}>
					{establishments.map(({ $id, name, domain }) => (
						<Col xs={24} sm={12} md={8} lg={6} key={$id}>
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
			<br />
			<br />

			<Button
				onClick={() => logout(() => (location.href = "/"))}
				loading={closingSession}
			>
				Salir
			</Button>
		</div>
	);
}
