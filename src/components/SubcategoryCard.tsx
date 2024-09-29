interface SubcategoryCardProps {
	name: string;
	photoUrl?: string;
	onPress: () => void;
}

export const SubcategoryCard = ({ photoUrl, name, onPress }: SubcategoryCardProps) => {
	return (
		<div
			style={{
				height: 176,
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundImage: `url(${photoUrl})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				borderRadius: 20,
				color: '#FFF',
				fontSize: 30,
				position: 'relative',
				overflow: 'hidden',
				cursor: 'pointer',
				marginBottom: 20
			}}
			onClick={() => onPress()}
		>
			<span
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					bottom: 0,
					right: 0,
					backgroundColor: '#000',
					opacity: 0.4,
					display: 'block',
					zIndex: 10
				}}
			/>
			<span style={{ zIndex: 20 }}>{name}</span>
		</div>
	);
}
