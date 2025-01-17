import { Tag, Button, Image, Typography, Space } from 'antd';
import {
	// CaretDownOutlined,
	// CaretUpOutlined,
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';

import { ProductProps, ProductStatus } from '../../../types/Product';
import { format, ModalOpener$ } from '../../../utils/helpers';
import {
	// useChangeProductOrder,
	useDeleteProduct
} from '../../../hooks/useProducts';
import { ModalName } from '../../../types/Modals';
import { useLanguageStore } from '../../../store/language';

const { Title, Text } = Typography;

const PandorasBoxId = '67466c610004d4e7c5bf';

interface ProductCardProps {
	data: ProductProps;
	color: string;
	preview?: boolean;
	isEditable?: boolean;
	showMoveUp?: boolean;
	showMoveDown?: boolean;
	onChange?: () => void;
}

export const ProductCard = (props: ProductCardProps) => {
	const {
		data,
		color,
		preview,
		isEditable,
		// showMoveDown,
		// showMoveUp,
		onChange
	} = props;
	const [_delete, deleting] = useDeleteProduct();
	// const [changeOrder, changingOrder] = useChangeProductOrder();
	const { lang, dictionary } = useLanguageStore((store) => store);

	return (
		<div style={{ position: 'relative', width: '100%', marginBottom: isEditable ? 0 : 15 }}>
			{isEditable && (
				<div
					style={{
						position: 'absolute',
						top: 10,
						right: 10,
						borderRadius: 4,
						overflow: 'hidden',
						backgroundColor: '#FFF',
						zIndex: 100,
						display: 'flex'
					}}
				>
					{/*
					{showMoveUp && (
						<Button
							type='text'
							icon={<CaretUpOutlined />}
							loading={changingOrder}
							onClick={() => changeOrder(data.subcategoryId, data.$id, 'up', onChange)}
						/>
					)}


					{showMoveDown && (
						<Button
							type='text'
							icon={<CaretDownOutlined />}
							// loading={changingOrder}
							// onClick={() => changeOrder(data.subcategoryId, data.$id, 'down', onChange)}
						/>
					)}
					*/}

					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => ModalOpener$.next({
							name: ModalName.Products,
							extra: data
						})}
					/>

					<Button
						type='text'
						icon={<DeleteOutlined />}
						loading={deleting}
						onClick={() => _delete(
							data.$id,
							onChange
						)}
					/>
				</div>
			)}

			{data?.photoUrl && (
				<Image
					src={data.photoUrl}
					style={{
						height: 250,
						objectFit: 'cover'
					}}
					wrapperStyle={{
						borderRadius: 15,
						width: '100%',
						overflow: 'hidden',
					}}
					preview={preview}
				/>
			)}

			<Space>
				{data.status === ProductStatus.NotAvailable && (
					<Tag color='#F50' >
						{dictionary.menu.product.notAvailable}
					</Tag>
				)}

				{data.bestSeller && (
					<Tag color='#87d068' >
						{dictionary.menu.product.bestSeller}
					</Tag>
				)}
			</Space>

			<Title level={5} style={{ marginBottom: 0 }}>
				{lang === 'es' && data.es_name}
				{lang === 'en' && data.en_name}
			</Title>
			<Text>
				{lang === 'es' && data.es_description}
				{lang === 'en' && data.en_description}
			</Text>
			{data.prices.length === 1 && data.$id !== PandorasBoxId && (
				<Title
					level={4}
					style={{ margin: 0, color }}
				>
					{(data.prices[0].price === 0)
						? dictionary.menu.product.price.free
						: '$' + format.cash(data.prices[0].price, 2)
					}
				</Title>
			)}
			{data.prices.length > 1 && data.prices.map(({ price, label }, index) => (
				<div
					key={`price-` + data.$id + '-' + index}
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}
				>
					<Text>{label}</Text>
					<Title
						level={4}
						style={{ margin: 0, color }}
					>
						{(price === 0)
							? dictionary.menu.product.price.free
							: '$' + format.cash(price, 2)
						}
					</Title>
				</div>
			))}
		</div>
	);
}
