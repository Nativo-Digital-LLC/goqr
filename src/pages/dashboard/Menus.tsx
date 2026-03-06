import { Button, Card, Col, Row, Space, Typography } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

import { useGetEstablishmentsByUserId } from "../../hooks/useEstablishments";
import { useSessionStore } from "../../store/session";
import { useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";

const { Text } = Typography;

export default function MenusPage() {
	const navigate = useNavigate();
	const [loadingSession, setLoadingSession] = useState(true);

	const { session, setSession } = useSessionStore((session) => session);
	const [establishments, loadingEstablishments] = useGetEstablishmentsByUserId(session?.userId);

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

	return (
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
				<br />

				<Row gutter={[20, 20]}>
					<Col span={24}>
						<Button
							type="primary"
							danger
							onClick={async () => {
								await signOut(auth);
								setSession(null);
								navigate("/login");
							}}
						>
							Cerrar Sesión
						</Button>
					</Col>
				</Row>
			</div>
		</>
	);
}