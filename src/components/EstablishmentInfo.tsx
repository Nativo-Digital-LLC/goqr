interface EstablishmentInfoProps {
	name: string;
	description: string;
	address: string;
	phone: string;
}

export const EstablishmentInfo = ({ name, description, address, phone }: EstablishmentInfoProps) => {
	return (
		<>
			<h1>{name}</h1>
			<span>
				{description}
			</span>
			<br />
			<span>
				{address}
			</span>
			<br />
			<span>
				{phone}
			</span>
		</>
	);
}
