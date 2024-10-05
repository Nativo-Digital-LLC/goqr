import { CloseOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Link } from "react-router-dom";

interface HeaderProps {
	bannerUrl?: string;
	logoUrl?: string;
	isEditable: boolean;
}

export const MenuHeader = ({ bannerUrl, logoUrl, isEditable }: HeaderProps) => {
	return (
		<header
			style={{
				height: 162,
				width: '100%',
				backgroundImage: `url(${bannerUrl})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				position: 'relative'
			}}
		>
			{isEditable && (
				<Link to='/dashboard'>
					<Button
						icon={<CloseOutlined />}
						shape='circle'
						style={{
							position: 'absolute',
							left: 20,
							top: 20
						}}
					/>
				</Link>
			)}

			{logoUrl && (
				<img
					src={logoUrl!}
					style={{
						marginTop: -30,
						width: 80,
						height: 80,
						borderRadius: 40,
						objectFit: 'contain',
						backgroundColor: '#FFF'
					}}
				/>
			)}
		</header>
	);
}
