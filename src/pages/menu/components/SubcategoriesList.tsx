import { Fragment } from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { SubcategoryProps } from '../types/Subcategory';
import { SubcategoryCard } from './SubcategoryCard';
import { ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';

const { Text } = Typography;

interface SubcategoriesListProps {
	category: {
		name: string;
		id: string;
	};
	mainColor: string;
	subcategories: SubcategoryProps[];
	isEditable: boolean;
	show: boolean;
	onChange: () => void;
	onPress: (id: string) => void;
}

export const SubcategoriesList = (props: SubcategoriesListProps) => {
	const {
		isEditable,
		subcategories,
		category,
		show,
		mainColor,
		onChange,
		onPress
	} = props;

	if (!show) {
		return null;
	}

	return (
		<>
			{isEditable && (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 10,
						marginBottom: 20
					}}
				>
					<Text style={{ textAlign: 'center' }}>AÑADIR CATEGORÍA</Text>
					<Button
						type='primary'
						shape='round'
						icon={<PlusOutlined />}
						style={{
							width: '100%',
							backgroundColor: mainColor
						}}
						onClick={() => ModalOpener$.next({
							name: ModalName.Subcategory,
							extra: {
								order: 1,
								categoryId: category.id
							}
						})}
					/>
				</div>
			)}

			{subcategories
				?.sort((a, b) => a.order - b.order)
				?.map((subcategory, index) => {
					const { $id, order } = subcategory;
					return (
						<Fragment key={$id}>
							<SubcategoryCard
								subcategory={subcategory}
								isEditable={isEditable}
								categoryId={category.id!}
								showMoveUp={index > 0}
								showMoveDown={index < subcategories?.length - 1}
								onPress={() => onPress($id)}
								onChange={onChange}
							/>

							{isEditable && (
								<Button
									type='primary'
									shape='round'
									icon={<PlusOutlined />}
									style={{
										width: '100%',
										backgroundColor: mainColor,
										marginBottom: 20
									}}
									onClick={() => ModalOpener$.next({
										name: ModalName.Subcategory,
										extra: {
											order: order + 1,
											categoryId: category.id
										}
									})}
								/>
							)}
						</Fragment>
					);
				})}
		</>
	)
}
