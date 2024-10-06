import HomeContainer from "./containers/HomeContainer";

export default function NotFoundPage() {
	return (
		<HomeContainer defaultBackgroundColor="--tertiary">
			<div className="flex flex-col justify-center items-center flex-1">
				<div className="bg-[--tertiary] w-full flex-grow flex flex-col mt-[50px] items-center">
					<h1 className="md:text-[100px] text-[60px] font-[700]">
						404
					</h1>
					<p className="md:text-[22px] text-[18px]">
						Página no encontrada
					</p>
					<a
						href="/"
						className="mt-[40px] underline underline-offset-[4px] decoration-[3px] decoration-[--secondary] font-[500]"
					>
						Volver al incio
					</a>
				</div>
			</div>
		</HomeContainer>
	);
}
