import { Button, QRCode, Row, Typography } from 'antd';
import { useParams } from 'react-router-dom';

import { MenuFooter } from './components';

const { Text, Title } = Typography;

export default function QrPage() {
	const { establishmentUrl } = useParams();

	function download() {
		const svg = document.getElementById('qr_container')?.querySelector<SVGElement>('svg');
		const svgData = new XMLSerializer().serializeToString(svg!);
		const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.download = `QR - GoQR - ${establishmentUrl}.svg`;
		a.href = url;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	}

	return (
		<div style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
			<div
				style={{
					maxWidth: 560,
					margin: '0 auto',
					height: '100vh',
					backgroundColor: '#FFF',
					display: 'flex',
					flexDirection: 'column',

				}}
			>
				<div
					style={{
						width: '100%',
						flex: 1,
						zIndex: 100,
						backgroundColor: '#FFF',
						padding: 20,
						overflowY: 'scroll',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center'
					}}
					className='hide-scrollbar-y'
					id='qr_container'
				>
					<Title level={4} style={{ margin: 0 }}>
						Código QR
					</Title>
					<br />
					<br />

					<QRCode
						value={`https://goqr.com.do/m/${establishmentUrl}`}
						size={200}
						type='svg'
					/>
					<br />
					<br />

					<Button
						type='primary'
						onClick={download}
					>
						Descargar
					</Button>
					<br />
					<br />

					<Row justify='center'>
						<a
							href='https://goqr.com.do'
							target='_blank'
						>
							<Text>goqr.com.do</Text>
						</a>
					</Row>
				</div>

				<MenuFooter domain={establishmentUrl!} />
			</div>
		</div>
	);
}
