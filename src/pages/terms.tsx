import HomeContainer from "./containers/HomeContainer";

export default function TermsPage() {
	return (
		<HomeContainer defaultBackgroundColor="--primary">
			<div className="w-full flex flex-col items-center pt-[40px] mb-[10px] px-[10px]">
				<div className="max-w-[860px] w-full">
					<h1>Términos y Condiciones de GoQR</h1>

					<h4>1. Uso del Servicio</h4>
					<ul>
						<li>El usuario podrá probar la aplicación de manera gratuita durante un mes.</li>
						<li>Después del período de prueba, el usuario deberá seleccionar un plan de facturación o su enlace será bloqueado.</li>
						<li>El usuario es responsable de pagar las tarifas de acuerdo con la frecuencia de facturación seleccionada, ya sea mediante tarjeta de crédito/débito o transferencia bancaria.</li>
						<li>Si transcurren 30 días desde la última factura emitida y no se realiza el pago, el enlace de acceso y el código QR del usuario serán bloqueados.</li>
					</ul>
					<br />

					<h4>2. Requisitos</h4>
					<p>Para utilizar GoQR, el usuario debe tener una dirección de correo electrónico válida.</p>
					<br />

					<h4>3. Propiedad Intelectual</h4>
					<ul>
						<li>Todos los datos y fotos utilizados por el usuario para crear el menú son de su propiedad.</li>
						<li>GoQR se reserva el derecho de exhibir el nombre y el logo del usuario en nuestra lista de clientes y para fines publicitarios.</li>
					</ul>
					<br />

					<h4>4. Responsabilidad del Usuario</h4>
					<ul>
						<li>El usuario es responsable de registrarse y crear su menú en la plataforma.</li>
						<li>El usuario también es responsable de imprimir su código QR y asumir los costos asociados.</li>
					</ul>
					<br />

					<h4>5. Responsabilidad y Exenciones de Garantía</h4>
					<p>GoQR se compromete a mantener el servicio operativo las 24 horas del día, los 7 días de la semana, aunque no se garantiza un funcionamiento sin interrupciones.</p>
					<br />

					<h4>6. Información de Pago</h4>
					<ul>
						<ul>No recolectamos información de pago directamente; todas las transacciones con tarjeta son procesadas por UepaPay o Stripe.</ul>
						<ul>Las opciones de pago disponibles incluyen transferencia bancaria y pagos con tarjeta a través de Stripe o UepaPay.</ul>
					</ul>
					<br />

					<h4>7. Política de Reembolsos y Cancelaciones</h4>
					<p>No se ofrecen reembolsos, ya que ofrecemos un mes de prueba gratuito para que los usuarios puedan evaluar el servicio.</p>
					<br />

					<h4>8. Cambios en los Términos y Condiciones</h4>
					<p>Cualquier cambio en estos términos y condiciones se notificará a los usuarios mediante correo electrónico.</p>
				</div>
			</div>
		</HomeContainer>
	)
}
