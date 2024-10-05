import { Button, Image, Typography } from 'antd';
import {
	CaretDownOutlined,
	CaretUpOutlined,
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';

import { ProductProps } from '../../../types/Product';
import { format, ModalOpener$ } from '../../../utils/helpers';
import { useChangeProductOrder, useDeleteProduct } from '../../../hooks/useProducts';
import { ModalName } from '../../../types/Modals';

const { Title, Text } = Typography;

interface ProductCardProps {
	data: ProductProps;
	color: string;
	preview: boolean;
	isEditable: boolean;
	showMoveUp: boolean;
	showMoveDown: boolean;
	onChange: () => void;
}

export const ProductCard = (props: ProductCardProps) => {
	const {
		data,
		color,
		preview,
		isEditable,
		showMoveDown,
		showMoveUp,
		onChange
	} = props;
	const [_delete, deleting] = useDeleteProduct();
	const [changeOrder, changingOrder] = useChangeProductOrder();

	return (
		<div style={{ position: 'relative' }}>
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
							loading={changingOrder}
							onClick={() => changeOrder(data.subcategoryId, data.$id, 'down', onChange)}
						/>
					)}

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

			<Image
				src={data.photoUrl}
				style={{
					height: 250,
					objectFit: 'cover'
				}}
				wrapperStyle={{
					borderRadius: 15,
					overflow: 'hidden',
				}}
				preview={preview}
			/>
			<Title level={5} style={{ marginBottom: 0 }}>{data.name}</Title>
			<Text>{data.description}</Text>
			{data.prices.length === 1 && (
				<Title
					level={4}
					style={{ margin: 0, color }}
				>
					${format.cash(data.prices[0].price)}
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
						${format.cash(price)}
					</Title>
				</div>
			))}
		</div>
	);
}