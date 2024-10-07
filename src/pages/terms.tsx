import HomeContainer from "./containers/HomeContainer";

export default function TermsPage() {
	return (
		<HomeContainer
			defaultBackgroundColor="--tertiary"
			navBackgroundColor="--tertiary"
		>
			<div className="w-full flex flex-col items-center pt-[40px] mb-[10px] px-[20px]">
				<div className="max-w-[890px] w-full">
					<h1 className="text-center text-[25px] font-[700] mb-[30px]">
						Términos y Condiciones de GoQR
					</h1>

					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							1. Uso del Servicio
						</h4>
						<ul className="ml-[18px]">
							<li className="mb-[5px]">
								El usuario podrá probar la aplicación de manera
								gratuita durante un mes.
							</li>
							<li className="mb-[5px]">
								Después del período de prueba, el usuario deberá
								seleccionar un plan de facturación o su enlace
								será bloqueado.
							</li>
							<li className="mb-[5px]">
								El usuario es responsable de pagar las tarifas
								de acuerdo con la frecuencia de facturación
								seleccionada, ya sea mediante tarjeta de
								crédito/débito o transferencia bancaria.
							</li>
							<li className="mb-[5px]">
								Si transcurren 30 días desde la última factura
								emitida y no se realiza el pago, el enlace de
								acceso y el código QR del usuario serán
								bloqueados.
							</li>
						</ul>
					</div>

					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							2. Requisitos
						</h4>
						<p className="ml-[18px]">
							Para utilizar GoQR, el usuario debe tener una
							dirección de correo electrónico válida.
						</p>
					</div>

					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							3. Propiedad Intelectual
						</h4>
						<ul className="ml-[18px]">
							<li className="mb-[5px]">
								Todos los datos y fotos utilizados por el
								usuario para crear el menú son de su propiedad.
							</li>
							<li className="mb-[5px]">
								GoQR se reserva el derecho de exhibir el nombre
								y el logo del usuario en nuestra lista de
								clientes y para fines publicitarios.
							</li>
						</ul>
					</div>

					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							4. Responsabilidad del Usuario
						</h4>
						<ul className="ml-[18px]">
							<li className="mb-[5px]">
								El usuario es responsable de registrarse y crear
								su menú en la plataforma.
							</li>
							<li className="mb-[5px]">
								El usuario también es responsable de imprimir su
								código QR y asumir los costos asociados.
							</li>
						</ul>
					</div>
					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							5. Responsabilidad y Exenciones de Garantía
						</h4>
						<p className="ml-[18px]">
							GoQR se compromete a mantener el servicio operativo
							las 24 horas del día, los 7 días de la semana,
							aunque no se garantiza un funcionamiento sin
							interrupciones.
						</p>
					</div>
					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							6. Información de Pago
						</h4>
						<ul className="ml-[18px]">
							<li className="mb-[5px]">
								No recolectamos información de pago
								directamente; todas las transacciones con
								tarjeta son procesadas por UepaPay o Stripe.
							</li>
							<li className="mb-[5px]">
								Las opciones de pago disponibles incluyen
								transferencia bancaria y pagos con tarjeta a
								través de Stripe o UepaPay.
							</li>
						</ul>
					</div>
					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							7. Política de Reembolsos y Cancelaciones
						</h4>
						<p className="ml-[18px]">
							No se ofrecen reembolsos, ya que ofrecemos un mes de
							prueba gratuito para que los usuarios puedan evaluar
							el servicio.
						</p>
					</div>

					<div className="mb-[20px]">
						<h4 className="font-[500] text-[17px] mb-[5px]">
							8. Cambios en los Términos y Condiciones
						</h4>
						<p className="ml-[18px]">
							Cualquier cambio en estos términos y condiciones se
							notificará a los usuarios mediante correo
							electrónico.
						</p>
					</div>
				</div>
			</div>
		</HomeContainer>
	);
}
