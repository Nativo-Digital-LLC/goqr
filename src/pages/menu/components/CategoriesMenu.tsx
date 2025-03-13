import { Button, Popconfirm, Space, Typography } from 'antd';
import {
	CaretLeftOutlined,
	CaretRightOutlined,
	DeleteOutlined,
	EditOutlined,
	PlusOutlined
} from '@ant-design/icons';

import { CategoryProps } from '../../../types/Category';
import { ModalOpener$ } from '../../../utils/helpers';
import { ModalName } from '../../../types/Modals';
import { useDeleteCategory, useUpdateCategoryOrder } from '../../../hooks/useCategories';
import { useLanguageStore } from '../../../store/language';

const { Text } = Typography;

interface CategoriesMenuProps {
	selectedCategoryId?: string;
	establishmentId: string;
	categories: CategoryProps[];
	color: string;
	isEditable: boolean;
	onSelect: (id: string) => void;
	onChange: () => void;
}

export const CategoriesMenu = (props: CategoriesMenuProps) => {
	const {
		categories,
		color,
		selectedCategoryId,
		onChange,
		onSelect,
		isEditable,
		establishmentId
	} = props;
	const [_delete, deleting] = useDeleteCategory();
	const [updateOrder, updatingOrder] = useUpdateCategoryOrder();
	const lang = useLanguageStore(({ lang }) => lang);

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
						name: ModalName.Category,
						extra: {
							order: 1,
							establishmentId
						}
					})}
				/>
			)}
			{categories
				.sort((a, b) => a.order - b.order)
				.map((category) => (
					<div
						key={category.$id}
						style={{
							display: 'flex',
							gap: 10
						}}
					>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 10
							}}
						>
							<Button
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
								onClick={() => onSelect(category.$id)}
								data-umami-event='Category'
								data-umami-event-id={category.$id}
								data-umami-event-name={category.es_name}
							>
								{category[lang + '_name' as 'es_name' | 'en_name']}
							</Button>

							{isEditable && (
								<div
									style={{
										backgroundColor: color,
										borderRadius: 4,
										flexWrap: 'nowrap',
										display: 'flex',
										width: 'auto',
										justifySelf: 'center'
									}}
								>
									{category.order > Math.min(...categories.map(({ order }) => order)) && (
										<Button
											type='text'
											icon={<CaretLeftOutlined style={{ color: '#FFF' }} />}
											loading={updatingOrder}
											onClick={() => updateOrder(establishmentId, category.$id, 'left', onChange)}
										/>
									)}

									{category.order < Math.max(...categories.map(({ order }) => order)) && (
										<Button
											type='text'
											icon={<CaretRightOutlined style={{ color: '#FFF' }} />}
											loading={updatingOrder}
											onClick={() => updateOrder(establishmentId, category.$id, 'right', onChange)}
										/>
									)}

									<Button
										type='text'
										icon={<EditOutlined style={{ color: '#FFF' }} />}
										onClick={() => ModalOpener$.next({
											name: ModalName.Category,
											extra: {
												id: category.$id,
												establishmentId,
												es_name: category.es_name,
												en_name: category.en_name,
												enableSubcategories: category.enableSubcategories
											}
										})}
									/>

									<Popconfirm
										placement='bottom'
										title='¿Eliminar menú?'
										description={(
											<Space direction='vertical'>
												<Text>Se eliminará "{category[lang + '_name' as 'es_name' | 'en_name']}"</Text>
												<Text type='danger'>junto con todas sus categorías!</Text>
											</Space>
										)}
										okText='Si, eliminar'
										cancelText='No'
										onConfirm={() => _delete(
											category.$id,
											establishmentId,
											onChange
										)}
									>
										<Button
											type='text'
											icon={<DeleteOutlined style={{ color: '#FFF' }} />}
											loading={deleting}
										/>
									</Popconfirm>

								</div>
							)}
						</div>

						{isEditable && (
							<Button
								icon={<PlusOutlined />}
								shape='circle'
								style={{ alignSelf: 'start' }}
								onClick={() => ModalOpener$.next({
									name: ModalName.Category,
									extra: {
										order: category.order + 1,
										establishmentId
									}
								})}
							/>
						)}
					</div>
				))}
		</div>
	);
}
