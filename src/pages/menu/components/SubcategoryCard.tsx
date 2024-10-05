import {
	CaretDownOutlined,
	CaretUpOutlined,
	DeleteOutlined,
	EditOutlined
} from '@ant-design/icons';
import { Button } from 'antd';

import { useDeleteSubcategory, useUpdateSubcategoryOrder } from '../../../hooks/useSubcategories';
import { ModalOpener$ } from '../../../utils/helpers';
import { ModalName } from '../../../types/Modals';
import { SubcategoryProps } from '../../../types/Subcategory';

interface SubcategoryCardProps {
	subcategory: SubcategoryProps;
	categoryId: string;
	isEditable: boolean;
	showMoveUp: boolean;
	showMoveDown: boolean;
	onPress: () => void;
	onChange: () => void;
}

export const SubcategoryCard = (props: SubcategoryCardProps) => {
	const {
		subcategory,
		isEditable,
		categoryId,
		showMoveDown,
		showMoveUp,
		onPress,
		onChange
	} = props;
	const [_delete, deleting] = useDeleteSubcategory();
	const [updateOrder, updatingOrder] = useUpdateSubcategoryOrder();

	return (
		<div
			style={{
				height: 176,
				width: '100%',
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				backgroundImage: `url(${subcategory.photoUrl})`,
				backgroundPosition: 'center',
				backgroundSize: 'cover',
				borderRadius: 20,
				color: '#FFF',
				fontSize: 30,
				position: 'relative',
				overflow: 'hidden',
				cursor: 'pointer',
				marginBottom: 20,
			}}
			className='subcategory-card'
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			onClick={({ target }: any) => target.tagName === 'SPAN' && onPress()}
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
			<span style={{ zIndex: 20 }}>{subcategory.name}</span>

			{isEditable && (
				<div
					style={{
						position: 'absolute',
						right: 10,
						top: 10,
						borderRadius: 10,
						backgroundColor: '#FFF',
						display: 'flex',
						gap: 4,
						zIndex: 20
					}}
					className='subcategory-options'
				>
					{showMoveUp && (
						<Button
							type='text'
							icon={<CaretUpOutlined />}
							loading={updatingOrder}
							onClick={() => updateOrder(categoryId, subcategory.$id, 'up', onChange)}
						/>
					)}

					{showMoveDown && (
						<Button
							type='text'
							icon={<CaretDownOutlined />}
							loading={updatingOrder}
							onClick={() => updateOrder(categoryId, subcategory.$id, 'down', onChange)}
						/>
					)}

					<Button
						type='text'
						icon={<EditOutlined />}
						onClick={() => ModalOpener$.next({
							name: ModalName.Subcategory,
							extra: subcategory
						})}
					/>

					<Button
						type='text'
						icon={<DeleteOutlined />}
						loading={deleting}
						onClick={() => _delete(
							subcategory.$id,
							categoryId,
							onChange
						)}
					/>
				</div>
			)}
		</div>
	);
}
