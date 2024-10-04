import { Fragment, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { useGetEstablishmentByDomain } from '../hooks/useEstablishments';
import {
	Header,
	SubcategoryCard,
	CategoriesMenu,
	EstablishmentInfo,
	ModalCategory,
	ModalEstablishment
} from '../components';
import { useSessionStore } from '../store/session';
import { ModalSubcategory } from '../components/ModalSubcategory';
import { ModalOpener$ } from '../utils/helpers';
import { ModalName } from '../types/Modals';

const { Text } = Typography;

export default function MenuPage() {
	const { establishmentUrl } = useParams();
	const session = useSessionStore(({ session }) => session);
	const location = useLocation();
	const navigate = useNavigate();

	const [establishment, loading, error, reload] = useGetEstablishmentByDomain(establishmentUrl);
	const isEditable = useMemo(() => {
		return establishment && session && session.userId === establishment.userId || false;
	}, [session, establishment]);
	const selected = useMemo(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get('categoryId');
		const subcategoryId = params.get('subcategoryId');

		return {
			categoryId,
			subcategoryId
		}
	}, [location]);
	const selectedCategory = useMemo(() => {
		if (!selected.categoryId || !establishment || establishment.categories.length === 0) {
			return null;
		}

		return establishment.categories.find(({ $id }) => $id === selected.categoryId) || null
	}, [establishment, selected.categoryId]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const categoryId = params.get('categoryId');
		if (!establishment || establishment.categories.length === 0 || categoryId) {
			return;
		}

		const category = establishment
			.categories
			.find(({ order }) => order === 1);

		if (!category) {
			return;
		}

		handleUrlChanges('categoryId', category.$id);
	}, [establishment]);

	if (error) {
		return <p>Error, {JSON.stringify(error, null, 4)}</p>
	}

	if (loading && !establishment) {
		return null;
	}

	if (!establishment) {
		return <p>No encontrado</p>;
	}

	function handleUrlChanges(key: string, value: string, reset = false) {
		const params = new URLSearchParams(location.search);
		if (reset) {
			const keys = Object.keys(
				Object.fromEntries(params.entries())
			);

			for (const key of keys) {
				params.delete(key);
			}
		}

		params.set(key, value);
		navigate(`${location.pathname}?${params.toString()}`);
	}

	return (
		<div style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
			<div style={{ maxWidth: 560, margin: '0 auto', height: '100vh', backgroundColor: '#FFF' }}>
				<Header
					bannerUrl={establishment.bannerUrl ?? undefined}
					logoUrl={establishment.logoUrl ?? undefined}
				/>
				<div
					style={{
						borderRadius: 30,
						marginTop: -30,
						width: '100%',
						height: 'calc(100vh - 132px)',
						zIndex: 100,
						backgroundColor: '#FFF',
						padding: 20,
						overflowY: 'scroll',
					}}
					className='hide-scrollbar-y'
				>
					<EstablishmentInfo
						establishment={establishment}
						isEditable={isEditable}
					/>
					<br />
					<br />

					<CategoriesMenu
						categories={establishment.categories}
						selectedCategoryId={selected.categoryId ?? undefined}
						color={establishment.mainHexColor}
						onSelect={(id) => handleUrlChanges('categoryId', id, true)}
						onChange={() => reload(establishmentUrl!)}
						establishmentId={establishment.$id}
						isEditable={isEditable}
					/>
					<br />

					<input
						placeholder='Buscar'
						style={{
							border: 'none',
							backgroundColor: 'rgba(0, 0, 0, 0.1)',
							width: '100%',
							padding: '10px 20px',
							borderRadius: 30,
							fontSize: 14
						}}
					/>
					<br />
					<br />

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
									backgroundColor: establishment.mainHexColor
								}}
								onClick={() => ModalOpener$.next({
									name: ModalName.Subcategory,
									extra: {
										order: 1,
										categoryId: selectedCategory?.$id
									}
								})}
							/>
						</div>
					)}

					{!selected?.subcategoryId && selectedCategory
						?.subcategories
						?.sort((a, b) => a.order - b.order)
						?.map((subcategory, index) => {
							const { $id, order } = subcategory;
							return (
								<Fragment key={$id}>
									<SubcategoryCard
										subcategory={subcategory}
										isEditable={isEditable}
										categoryId={selected.categoryId!}
										showMoveUp={index > 0}
										showMoveDown={index < selectedCategory?.subcategories?.length - 1}
										onPress={() => handleUrlChanges('subcategoryId', $id)}
										onChange={() => reload(establishmentUrl!)}
									/>

									{isEditable && (
										<Button
											type='primary'
											shape='round'
											icon={<PlusOutlined />}
											style={{
												width: '100%',
												backgroundColor: establishment.mainHexColor,
												marginBottom: 20
											}}
											onClick={() => ModalOpener$.next({
												name: ModalName.Subcategory,
												extra: {
													order: order + 1,
													categoryId: selectedCategory?.$id
												}
											})}
										/>
									)}
								</Fragment>
							);
						})}

					<Row justify='center'>
						<a
							href='https://goqr.com.do'
							target='_blank'
						>
							<Text>goqr.com.do</Text>
						</a>
					</Row>
				</div>
			</div>

			<ModalCategory
				onFinish={() => reload(establishmentUrl!)}
			/>

			<ModalEstablishment
				onFinish={() => reload(establishmentUrl!)}
			/>

			<ModalSubcategory
				onFinish={() => reload(establishmentUrl!)}
			/>
		</div>
	);
}
