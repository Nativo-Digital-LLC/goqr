import { Link } from "react-router-dom";

import HomeContainer from "./containers/HomeContainer";

export default function PrivacyPoliciesPage() {
	return (
		<HomeContainer>
			<div className="section-parent bg-[#FFF]">
				<div className="section-child w-full text-left flex flex-col items-center !p-[20px]">
					<div className="max-w-[890px] w-full">
						<h1 className="text-center text-[25px] font-[700] mb-[30px]">
							Políticas de Privacidad de GoQR
						</h1>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								1. Información General
							</h4>
							<p className="ml-[18px]">
								GoQR{" "}
								<Link to="https://goqr.com.do">
									(https://goqr.com.do)
								</Link>{" "}
								se compromete a proteger la privacidad de sus
								usuarios. Esta política de privacidad describe
								cómo recopilamos, utilizamos y protegemos la
								información personal que los usuarios
								proporcionan al usar nuestro servicio.
							</p>
						</div>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								2. Datos Personales Recopilados
							</h4>
							<p className="ml-[18px] mb-[5px]">
								Recopilamos la siguiente información personal a
								través de nuestros formularios de registro:
							</p>
							<ul className="ml-[18px]">
								<li className="mb-[5px]">Correo Electrónico</li>
								<li className="mb-[5px]">
									Teléfono o WhatsApp
								</li>
								<li className="mb-[5px]">
									RNC y Razón Social (si aplica)
								</li>
							</ul>
						</div>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								3. Finalidad del Uso de los Datos
							</h4>
							<p className="ml-[18px] mb-[5px]">
								Los datos recopilados se utilizarán para:
							</p>
							<ul className="ml-[18px]">
								<li className="mb-[5px]">
									Facilitar el inicio de sesión en la
									plataforma
								</li>
								<li className="mb-[5px]">
									Procesar la facturación y pagos
								</li>
								<li className="mb-[5px]">
									Enviar información de marketing y
									promociones relevantes
								</li>
							</ul>
						</div>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								4. Uso de Servicios de Terceros
							</h4>
							<p className="ml-[18px] mb-[5px]">
								Compartimos ciertos datos con proveedores
								externos para brindar un mejor servicio:
							</p>
							<ul className="ml-[18px]">
								<li className="mb-[5px]">
									<b className="font-[500]">UepaPay:</b>{" "}
									Compartimos el correo electrónico y número
									de WhatsApp para pagos con tarjeta.
								</li>
								<li className="mb-[5px]">
									<b className="font-[500]">Stripe:</b>{" "}
									Compartimos el correo electrónico para pagos
									con tarjeta.
								</li>
								<li className="mb-[5px]">
									<b className="font-[500]">
										Google Analytics y Google Search
										Console:
									</b>{" "}
									Utilizados para el análisis del tráfico del
									sitio web, sin compartir datos personales.
								</li>
								<li className="mb-[5px]">
									<b className="font-[500]">Meta Pixel:</b>{" "}
									Usado para seguimiento de campañas
									publicitarias, sin compartir datos
									personales.
								</li>
							</ul>
						</div>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								5. Seguridad de los Datos
							</h4>
							<p className="ml-[18px] mb-[5px]">
								Tomamos medidas de seguridad razonables para
								proteger la información personal de los
								usuarios:
							</p>
							<ul className="ml-[18px]">
								<li className="mb-[5px]">
									Uso de SSL para la transmisión de datos.
								</li>
								<li className="mb-[5px]">
									Autenticación mediante correo electrónico y
									contraseña, con opción de 2FA (autenticación
									de dos factores) o inicio de sesión con
									Google.
								</li>
							</ul>
						</div>
						<div className="mb-[20px]">
							<h4 className="font-[500] text-[17px] mb-[5px]">
								6. Derechos del Usuario
							</h4>
							<p className="ml-[18px] mb-[5px]">
								Los usuarios tienen derecho a:
							</p>
							<ul className="ml-[18px]">
								<li className="mb-[5px]">
									Solicitar la descarga de todos sus datos
									personales.
								</li>
								<li className="mb-[5px]">
									Solicitar la eliminación permanente de sus
									datos de nuestra plataforma.
								</li>
							</ul>
							<br />

							<h4 className="font-[500] text-[17px] mb-[5px]">
								7. Cambios en la Política de Privacidad
							</h4>
							<p className="ml-[18px]">
								Cualquier cambio en esta política de privacidad
								se notificará a los usuarios mediante correo
								electrónico.
							</p>
						</div>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
