import { Link } from "react-router-dom";

import { MarketingLayout } from "@/layouts/MarketingLayout";

export default function NotFoundPage() {
	return (
		<MarketingLayout>
			<div className="section-parent">
				<div className=" section-child flex flex-col justify-center items-center flex-1">
					<div className="w-full grow flex flex-col mb-[40px] items-center">
						<h1 className="md:text-[100px] text-[60px] font-bold">
							404
						</h1>
						<p className="md:text-[22px] text-[18px]">
							Página no encontrada
						</p>
						<Link
							to="/"
							className="mt-[40px] underline underline-offset-4 decoration-[3px] decoration-(--legacy-secondary) font-medium"
						>
							Volver al incio
						</Link>
					</div>
				</div>
			</div>
		</MarketingLayout>
	);
}
