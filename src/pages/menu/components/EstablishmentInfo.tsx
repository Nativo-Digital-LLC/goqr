import { Button, Space, Typography } from 'antd';
import {
	EditOutlined,
	EnvironmentOutlined,
	PhoneOutlined,
	StarOutlined,
	WhatsAppOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';

import { format, ModalOpener$ } from '../../../utils/helpers';
import { ModalName } from '../../../types/Modals';
import { EstablishmentProps } from '../../../types/Establishment';

const { Title, Text } = Typography;

interface EstablishmentInfoProps {
	establishment: EstablishmentProps;
	isEditable: boolean;
}

export const EstablishmentInfo = ({ establishment, isEditable }: EstablishmentInfoProps) => {
	const location = useLocation();

	const {
		name,
		description,
		address,
		phone,
		whatsapp,
		addressLink
	} = establishment;
	return (
		<Space direction='vertical' size='small'>
			<Space>
				<Title level={3} style={{ margin: 0 }}>{name}</Title>
				{isEditable && (
					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => ModalOpener$.next({
							name: ModalName.Establishment,
							extra: establishment
						})}
					/>
				)}
			</Space>

			<Text style={{ opacity: 0.7 }}>{description}</Text>

			{address && (
				<a href={addressLink + ''} target='_blank' style={{ opacity: 0.7 }}>
					<Space>
						<EnvironmentOutlined />
						<Text>{address}</Text>
					</Space>
				</a>
			)}
			<Space>
				{phone && (
					<a href={'tel:' + phone} style={{ opacity: 0.7 }}>
						<Space>
							<PhoneOutlined />
							<Text>{format.phone(phone + '')}</Text>
						</Space>
					</a>
				)}

				{whatsapp && (
					<a href={'https://wa.me/1' + whatsapp} target='_blank' style={{ opacity: 0.7 }}>
						<Space>
							<WhatsAppOutlined style={{ color: '#128C7E' }} />
							<Text>{format.phone(whatsapp + '')}</Text>
						</Space>
					</a>
				)}
			</Space>

			{location.pathname.includes('pandora') && (
				<a
					href='https://search.google.com/local/writereview?placeid=ChIJedOsv5mzHIwRRIpW55r0Jf4'
					target='_blank'
					style={{ margin: '10px 0' }}
				>
					<Space>
						<StarOutlined style={{ color: '#e0d206' }} />
						<Text>Déjanos tu reseña</Text>
					</Space>
				</a>
			)}
		</Space>
	);
}
