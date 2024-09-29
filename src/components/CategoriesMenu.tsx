import { CategoryProps } from '../types/Category';

interface CategoriesMenuProps {
	selectedCategoryId?: string;
	categories: CategoryProps[];
	color: string;
	onChange: (id: string) => void;
}

export const CategoriesMenu = ({ categories, color, selectedCategoryId, onChange }: CategoriesMenuProps) => {
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
			{categories.map((category) => (
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
			))}
		</div>
	);
}
