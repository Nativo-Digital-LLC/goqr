import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Row, Typography } from 'antd';

import { useGetEstablishmentByDomain } from '../../hooks/useEstablishments';
import {
	ModalCategory,
	SubcategoriesList,
	ProductsList,
	ModalSubcategory,
	MenuFooter,
	MenuHeader,
	EstablishmentInfo,
	CategoriesMenu
} from './components';
import { useSessionStore } from '../../store/session';
import { ModalEstablishment } from '../../components';

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
			<div
				style={{
					maxWidth: 560,
					margin: '0 auto',
					height: '100vh',
					backgroundColor: '#FFF',
					display: 'flex',
					flexDirection: 'column',

				}}
			>
				<MenuHeader
					bannerUrl={establishment.bannerUrl ?? undefined}
					logoUrl={establishment.logoUrl ?? undefined}
				/>
				<div
					style={{
						borderRadius: 30,
						marginTop: -30,
						width: '100%',
						flex: 1,
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

					{!selected.subcategoryId && (
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
					)}
					<br />
					<br />

					<SubcategoriesList
						subcategories={selectedCategory?.subcategories || []}
						mainColor={establishment.mainHexColor}
						isEditable={isEditable}
						category={{
							name: selectedCategory?.name || '',
							id: selectedCategory?.$id || ''
						}}
						show={!selected.subcategoryId}
						onChange={() => reload(establishmentUrl!)}
						onPress={(id) => handleUrlChanges('subcategoryId', id)}
					/>

					<ProductsList
						// show={}
					/>

					<Row justify='center'>
						<a
							href='https://goqr.com.do'
							target='_blank'
						>
							<Text>goqr.com.do</Text>
						</a>
					</Row>
				</div>

				{isEditable && (
					<MenuFooter domain={establishmentUrl!} />
				)}
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
