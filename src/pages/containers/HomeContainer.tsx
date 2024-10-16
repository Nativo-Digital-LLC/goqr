import { ReactNode } from "react";
import { Link, ScrollRestoration } from "react-router-dom";

interface HomeContainerProps {
	children: ReactNode;
	navBackgroundColor?: string;
	footerBackgroundColor?: string;
	defaultBackgroundColor?: string;
}

export default function HomeContainer(props: HomeContainerProps) {
	const { children, defaultBackgroundColor, navBackgroundColor } = props;
	return (
		<div
			className={`landing-page bg-[${
				defaultBackgroundColor ? defaultBackgroundColor : "--primary"
			}]`}
		>
			{/* NAVIGATION */}
			<div
				className={`md:relative md:z-[2] py-4 flex justify-center ${
					navBackgroundColor
						? "bg-[" + navBackgroundColor + "]"
						: "bg-[--primary]"
				}`}
			>
				<div className="flex justify-between max-w-[890px] w-full px-[20px]">
					<Link to="/" className={`text-[25px]`}>
						<b className="z-[2] relative">GoQr</b>
					</Link>
					<div className="items-center flex">
						<Link to="/login" className="mx-5">
							Ingresar
						</Link>
						<Link
							to="/register"
							className="bg-[--secondary] px-4 py-[6px] rounded-[7px] text-[--tertiary]"
						>
							Crear menú
						</Link>
					</div>
				</div>
			</div>
			<div className={`flex-grow flex flex-col`}>{children}</div>
			{/* FOOTER */}
			<div
				className={`${
					defaultBackgroundColor
						? "bg-[" + defaultBackgroundColor + "]"
						: "bg-[--primary]"
				} flex justify-center`}
			>
				<div className="max-w-[890px] w-full">
					<div className="flex justify-between items-center px-[20px] pb-[40px]">
						<div className="flex flex-col justify-between">
							<Link to="/" className={`text-[25px]`}>
								<b className="z-[2] relative">GoQr</b>
							</Link>
							<div className="flex flex-col text-[11px] md:text-[14px]">
								<Link to="/terms" className="my-[4px]">
									Terminos del servicio
								</Link>
								<Link
									to="/privacy-policies"
									className="my-[4px]"
								>
									Políticas de privacidad
								</Link>
							</div>
						</div>
						<div className="flex flex-col items-end text-[15px] md:text-[17px]">
							<span>Contacto</span>
							<a
								href="mailto:contacto@goqr.com.do"
								className="flex justify-center items-center"
							>
								<svg
									className="mr-[5px]"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 256 256"
									width="16"
									height="16"
									fill="currentColor"
								>
									<g>
										<path
											d="M32,56H224a0,0,0,0,1,0,0V192a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V56A0,0,0,0,1,32,56Z"
											fill="none"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="16"
										></path>{" "}
										<polyline
											points="224 56 128 144 32 56"
											fill="none"
											stroke="currentColor"
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="16"
										></polyline>
									</g>
								</svg>
								<b className="text-[--secondary] font-[500]">
									contacto
								</b>
								@goqr.com.do
							</a>
						</div>
					</div>
				</div>
			</div>

			<ScrollRestoration />
		</div>
	);
}
