import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import PandorasIntro from '../../assets/pandora-intro.mp4';

export const Loading = ({ showPandoraIntro }: { showPandoraIntro?: boolean; }) => {
	if (showPandoraIntro) {
		return (
			<div
				style={{
					maxWidth: 560,
					margin: '0 auto',
					backgroundColor: '#000',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					minHeight: '100vh'
				}}
			>
				<video
					autoPlay
					muted
					loop
					playsInline
					src={PandorasIntro}
				/>
			</div>
		);
	}

	return (
		<div
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.05)',
				height: '100vh',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center'
			}}
		>
			<Spin indicator={<LoadingOutlined style={{ fontSize: 80 }} />} />
		</div>
	);
}
