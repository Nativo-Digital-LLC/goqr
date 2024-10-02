import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { CategoryProps } from '../types/Category';
import { ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';

interface CategoriesMenuProps {
	selectedCategoryId?: string;
	establishmentId: string;
	categories: CategoryProps[];
	color: string;
	isEditable: boolean;
	onChange: (id: string) => void;
}

export const CategoriesMenu = (props: CategoriesMenuProps) => {
	const { categories, color, selectedCategoryId, onChange, isEditable, establishmentId } = props;

	return (
		<div
			style={{
				display: 'flex',
				gap: 10,
				width: '100%',
				overflowX: 'scroll',
				paddingBottom: 15
			}}
		>
			{isEditable && (
				<Button
					icon={<PlusOutlined />}
					shape='circle'
					onClick={() => ModalOpener$.next({
						name: ModalName.NewCategory,
						extra: {
							order: 1,
							establishmentId
						}
					})}
				/>
			)}
			{categories.map((category) => (
				<Space key={category.$id}>
					<button
						key={category.$id}
						style={{
							border: `3px solid ${color}`,
							background: (selectedCategoryId === category.$id)
								? color
								: 'none',
							boxShadow: 'none',
							borderRadius: 20,
							padding: '4px 16px',
							color: (selectedCategoryId === category.$id)
								? '#FFF'
								: color,
							fontSize: 14,
							fontWeight: 'bold',
							height: 34,
							textWrap: 'nowrap',
							cursor: 'pointer'
						}}
						onClick={() => onChange(category.$id)}
					>
						{category.name}
					</button>

					{isEditable && (
						<Button
							icon={<PlusOutlined />}
							shape='circle'
							onClick={() => ModalOpener$.next({
								name: ModalName.NewCategory,
								extra: {
									order: category.order + 1,
									establishmentId
								}
							})}
						/>
					)}
				</Space>
			))}
		</div>
	);
}
