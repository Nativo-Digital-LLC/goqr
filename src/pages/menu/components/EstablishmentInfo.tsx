import { Button, Space, Typography } from 'antd';
import {
	EditOutlined,
	EnvironmentOutlined,
	PhoneOutlined,
	WhatsAppOutlined
} from '@ant-design/icons';

import { format, ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';
import { EstablishmentProps } from '../types/Establishment';

const { Title, Text } = Typography;

interface EstablishmentInfoProps {
	establishment: EstablishmentProps;
	isEditable: boolean;
}

export const EstablishmentInfo = ({ establishment, isEditable }: EstablishmentInfoProps) => {
	const {
		name,
		description,
		address,
		phone,
		whatsapp,
		addressLink
	} = establishment;
	return (
		<>
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
			<br />
			<Text>{description}</Text>
			<br />
			<a href={addressLink + ''} target='_blank'>
				<Space>
					<EnvironmentOutlined />
					<Text>{address}</Text>
				</Space>
			</a>

			<br />
			<Space>
				<a href={'tel:' + phone}>
					<Space>
						<PhoneOutlined />
						<Text>{format.phone(phone + '')}</Text>
					</Space>
				</a>

				<a href={'https://wa.me/1' + whatsapp} target='_blank'>
					<Space>
						<WhatsAppOutlined style={{ color: '#128C7E' }} />
						<Text>{format.phone(whatsapp + '')}</Text>
					</Space>
				</a>
			</Space>
		</>
	);
}
