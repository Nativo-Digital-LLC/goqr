import { Link } from "react-router-dom";

import HomeContainer from "./containers/HomeContainer";

export default function NotFoundPage() {
	return (
		<HomeContainer>
			<div className="section-parent">
				<div className=" section-child flex flex-col justify-center items-center flex-1">
					<div className="w-full flex-grow flex flex-col mb-[40px] items-center">
						<h1 className="md:text-[100px] text-[60px] font-[700]">
							404
						</h1>
						<p className="md:text-[22px] text-[18px]">
							Página no encontrada
						</p>
						<Link
							to="/"
							className="mt-[40px] underline underline-offset-[4px] decoration-[3px] decoration-[--secondary] font-[500]"
						>
							Volver al incio
						</Link>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
