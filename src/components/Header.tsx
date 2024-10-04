interface HeaderProps {
	bannerUrl?: string;
	logoUrl?: string;
}

export const Header = ({ bannerUrl, logoUrl }: HeaderProps) => {
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
				alignItems: 'center'
			}}
		>
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
