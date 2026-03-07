import { Button, Row, Space, Typography } from "antd";
import {
	EditOutlined,
	EnvironmentOutlined,
	PhoneOutlined,
	StarOutlined,
	WhatsAppOutlined,
	ClockCircleOutlined,
	InstagramOutlined,
	FacebookOutlined,
	TikTokOutlined,
	TwitterOutlined,
	GlobalOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { format, formatConsecutiveDays, getSocialUsername } from "../../../utils/helpers";
import { EstablishmentProps } from "../../../types/Establishment";
import { ToggleLanguageButton } from "./ToggleLanguageButton";
import { useLanguageStore } from "../../../store/language";

const { Title, Text } = Typography;

const getSocialIcon = (platform: string) => {
	switch (platform) {
		case 'instagram': return <InstagramOutlined />;
		case 'facebook': return <FacebookOutlined />;
		case 'tiktok': return <TikTokOutlined />;
		case 'x': return <TwitterOutlined />;
		case 'website': return <GlobalOutlined />;
		default: return <GlobalOutlined />;
	}
};

const getSocialLink = (platform: string, link: string) => {
	if (platform === 'website') return link.startsWith('http') ? link : `https://${link}`;
	if (link.startsWith('http')) return link;
	const cleanLink = link.replace('@', '');
	switch (platform) {
		case 'instagram': return `https://instagram.com/${cleanLink}`;
		case 'facebook': return `https://facebook.com/${cleanLink}`;
		case 'tiktok': return `https://tiktok.com/@${cleanLink}`;
		case 'x': return `https://x.com/${cleanLink}`;
		default: return `https://${cleanLink}`;
	}
};

interface EstablishmentInfoProps {
	establishment: EstablishmentProps;
	isEditable: boolean;
}

export const EstablishmentInfo = ({
	establishment,
	isEditable,
}: EstablishmentInfoProps) => {
	const navigate = useNavigate();
	const dictionary = useLanguageStore(({ dictionary }) => dictionary);

	const {
		name,
		description,
		address,
		phone,
		whatsapp,
		addressLink,
		enableMultiLanguage,
		googlePlaceId,
		schedules,
		socialNetworks,
	} = establishment;

	return (
		<Space direction="vertical" size="small" style={{ width: "100%" }}>
			<Row justify="space-between">
				<Space>
					<Title level={3} style={{ margin: 0 }}>
						{name}
					</Title>
					{isEditable && (
						<Button
							type="text"
							icon={<EditOutlined />}
							onClick={() =>
								navigate("/panel/establishments", {
									state: {
										establishment,
									},
								})
							}
						/>
					)}
				</Space>

				{enableMultiLanguage && !isEditable && (
					<ToggleLanguageButton
						esFlag={
							establishment.domain === "la-roca-restaurant"
								? "dom"
								: undefined
						}
					/>
				)}
			</Row>

			{description.split('\n').map((item, index) => {
				const isBold = item.charAt(0) === '*' && item.charAt(item.length - 1);
				return (
					<Text
						style={{
							opacity: 0.7,
							...(isBold && {
								fontWeight: 'bold'
							})
						}}
						key={'description-' + index}
					>
						{(isBold)
							? item.replace(/\*/g, '')
							: item
						}
					</Text>
				);
			})}
			<div style={{ height: 10 }} />

			{address && (
				<a
					href={addressLink + ""}
					target="_blank"
					style={{ opacity: 0.7 }}
				>
					<Space>
						<EnvironmentOutlined />
						<Text>{address}</Text>
					</Space>
				</a>
			)}

			{schedules && schedules.length > 0 && (
				<Space direction="vertical" size={2}>
					{schedules.map((schedule, index) => (
						<Space key={'schedule-' + index} style={{ opacity: 0.7 }}>
							<ClockCircleOutlined />
							<Text>{formatConsecutiveDays(schedule.days)}: {schedule.hours}</Text>
						</Space>
					))}
				</Space>
			)}

			{(phone || whatsapp) && (
				<Space>
					{phone && (
						<a href={"tel:" + phone} style={{ opacity: 0.7 }}>
							<Space>
								<PhoneOutlined />
								<Text>{format.phone(phone + "")}</Text>
							</Space>
						</a>
					)}

					{whatsapp && (
						<a
							href={"https://wa.me/1" + whatsapp}
							target="_blank"
							style={{ opacity: 0.7 }}
						>
							<Space>
								<WhatsAppOutlined
									style={{ color: "#128C7E" }}
								/>
								<Text>{format.phone(whatsapp + "")}</Text>
							</Space>
						</a>
					)}
				</Space>
			)}

			{googlePlaceId && (
				<a
					href={`https://search.google.com/local/writereview?placeid=${googlePlaceId}`}
					target="_blank"
					style={{ margin: "10px 0" }}
				>
					<Space>
						<StarOutlined style={{ color: "#e0d206" }} />
						<Text>{dictionary.menu.establishment.leaveReview}</Text>
					</Space>
				</a>
			)}

			{socialNetworks && socialNetworks.length > 0 && (
				<Space size="middle" style={{ marginTop: 10, flexWrap: "wrap" }}>
					{socialNetworks.map((social, index) => {
						const socialLink = getSocialLink(social.platform, social.link);
						const socialUsername = getSocialUsername(social.platform, social.link);
						const displayUsername = social.displayName || socialUsername;

						return (
							<a
								key={'social-' + index}
								href={socialLink}
								target="_blank"
								style={{ color: 'inherit', display: 'flex', alignItems: 'center' }}
							>
								<span style={{ fontSize: 24, color: establishment.mainHexColor || 'inherit', opacity: 0.8, marginRight: 5 }}>
									{getSocialIcon(social.platform)}
								</span>
								{displayUsername && (
									<Text strong style={{ fontSize: 13, opacity: 0.8, letterSpacing: -0.2 }}>
										{displayUsername}
									</Text>
								)}
							</a>
						);
					})}
				</Space>
			)}
		</Space>
	);
};
