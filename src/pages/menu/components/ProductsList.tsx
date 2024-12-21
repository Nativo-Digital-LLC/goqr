import { useMemo, Fragment } from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useGetAllProducts } from '../../../hooks/useProducts';
import { ModalProduct } from './ModalProduct';
import { ModalOpener$ } from '../../../utils/helpers';
import { ModalName } from '../../../types/Modals';
import { ProductCard } from './ProductCard';
import { ProductStatus } from '../../../types/Product';

const { Title } = Typography;

interface ProductsListProps {
	show: boolean;
	color: string;
	establishmentId: string;
	categoryId: string;
	subcategoryId: string | null;
	title: string;
	isEditable: boolean;
	enableMultiLanguage?: boolean;
}

export const ProductsList = (props: ProductsListProps) => {
	const {
		show,
		color,
		establishmentId,
		categoryId,
		subcategoryId,
		title,
		isEditable,
		enableMultiLanguage
	} = props;
	const [allProducts, , , reload] = useGetAllProducts(establishmentId);
	const products = useMemo(() => {
		return allProducts
			.filter((product) => product.categoryId === categoryId)
			.filter((product) => product.subcategoryId === subcategoryId)
			.sort((a, b) => a.order - b.order);
	}, [allProducts, categoryId, subcategoryId]);

	if (!show) {
		return <></>;
	}

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: 10,
				marginBottom: 20
			}}
		>
			<Title style={{ textAlign: 'center' }} level={5}>
				{title}
			</Title>

			{isEditable && (
				<Button
					type='primary'
					shape='round'
					icon={<PlusOutlined />}
					style={{
						width: '100%',
						backgroundColor: color
					}}
					onClick={() => ModalOpener$.next({
						name: ModalName.Products,
						extra: {
							order: 1,
							categoryId,
							subcategoryId,
							establishmentId
						}
					})}
				/>
			)}

			{products
				.filter(({ status }) => status !== ProductStatus.Hidden || isEditable)
				.map((product, index) => (
					<Fragment key={product.$id}>
						<ProductCard
							data={product}
							color={color}
							preview={!isEditable}
							isEditable={isEditable}
							showMoveUp={index > 0}
							showMoveDown={index < products.length - 1}
							onChange={() => reload(establishmentId)}
						/>

						{isEditable && (
							<Button
								type='primary'
								shape='round'
								icon={<PlusOutlined />}
								style={{
									width: '100%',
									backgroundColor: color
								}}
								onClick={() => ModalOpener$.next({
									name: ModalName.Products,
									extra: {
										order: product.order + 1,
										categoryId,
										subcategoryId,
										establishmentId
									}
								})}
							/>
						)}
					</Fragment>
				))}

			<ModalProduct
				onFinish={() => reload(establishmentId)}
				enableEnglishVersion={enableMultiLanguage || false}
			/>
		</div>
	);
}
