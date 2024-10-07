import HomeContainer from "./containers/HomeContainer";

export default function PrivacyPoliciesPage() {
	return (
		<HomeContainer defaultBackgroundColor="--primary">
			<div className="w-full flex flex-col items-center pt-[40px] mb-[10px] px-[10px]">
				<div className="max-w-[860px] w-full">
					<h1>Políticas de Privacidad de GoQR</h1>
					<br />

					<h4>1. Información General</h4>
					<p>
						GoQR <a href="https://goqr.com.do">(https://goqr.com.do)</a> se compromete a proteger la privacidad de sus usuarios. Esta política de privacidad describe cómo recopilamos, utilizamos y protegemos la información personal que los usuarios proporcionan al usar nuestro servicio.
					</p>
					<br />

					<h4>2. Datos Personales Recopilados</h4>
					<p>
						Recopilamos la siguiente información personal a través de nuestros formularios de registro:
					</p>
					<ul>
						<li>
							Correo Electrónico
						</li>
						<li>
							Teléfono o WhatsApp
						</li>
						<li>
							RNC y Razón Social (si aplica)
						</li>
					</ul>
					<br />

					<h4>3. Finalidad del Uso de los Datos</h4>
					<p>
						Los datos recopilados se utilizarán para:
					</p>
					<ul>
						<li>Facilitar el inicio de sesión en la plataforma</li>
						<li>Procesar la facturación y pagos</li>
						<li>Enviar información de marketing y promociones relevantes</li>
					</ul>
					<br />

					<h4>4. Uso de Servicios de Terceros</h4>
					<p>
						Compartimos ciertos datos con proveedores externos para brindar un mejor servicio:
					</p>
					<ul>
						<li>
							<b>UepaPay:</b> Compartimos el correo electrónico y número de WhatsApp para pagos con tarjeta.
						</li>
						<li>
							<b>Stripe:</b> Compartimos el correo electrónico para pagos con tarjeta.
						</li>
						<li>
							<b>Google Analytics y Google Search Console:</b> Utilizados para el análisis del tráfico del sitio web, sin compartir datos personales.
						</li>
						<li>
							<b>Meta Pixel:</b> Usado para seguimiento de campañas publicitarias, sin compartir datos personales.
						</li>
					</ul>
					<br />

					<h4>5. Seguridad de los Datos</h4>
					<p>
						Tomamos medidas de seguridad razonables para proteger la información personal de los usuarios:
					</p>
					<ul>
						<li>Uso de SSL para la transmisión de datos.</li>
						<li>Autenticación mediante correo electrónico y contraseña, con opción de 2FA (autenticación de dos factores) o inicio de sesión con Google.</li>
					</ul>
					<br />

					<h4>6. Derechos del Usuario</h4>
					<p>
						Los usuarios tienen derecho a:
					</p>
					<ul>
						<li>Solicitar la descarga de todos sus datos personales.</li>
						<li>Solicitar la eliminación permanente de sus datos de nuestra plataforma.</li>
					</ul>
					<br />

					<h4>7. Cambios en la Política de Privacidad</h4>
					<p>
						Cualquier cambio en esta política de privacidad se notificará a los usuarios mediante correo electrónico.
					</p>
				</div>
			</div>
		</HomeContainer>
	)
}
