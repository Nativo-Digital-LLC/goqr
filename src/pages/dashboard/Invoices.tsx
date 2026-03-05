import { Button, Table, Typography } from "antd";

import { useGetBillsByUserId } from "../../hooks/useBills";
import { useSessionStore } from "../../store/session";
import { BillProps } from "../../types/Bill";

const { Title } = Typography;

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
				<Button
					type="primary"
					onClick={() => window.open(record.paymentUrl, '_blank')}
				>
					Pagar
				</Button>
			)
		),
	},
];

export default function InvoicesPage() {
	const { session } = useSessionStore((session) => session);
	const [bills, loadingBills] = useGetBillsByUserId(session?.userId);

	return (
		<>
			<Title level={2}>Facturas</Title>
			<br />
			<Table
				columns={invoiceColumns}
				dataSource={bills}
				pagination={false}
				loading={loadingBills}
				rowKey={({ id }) => id}
			/>
		</>
	);
}