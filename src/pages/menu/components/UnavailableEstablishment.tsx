import { ShopOutlined, ExclamationCircleOutlined, ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";

export const UnavailableEstablishment = () => {
	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
			<div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 sm:py-24">
				<div className="bg-white rounded-2xl shadow-xl p-8 text-center">
					{/* Icono y estado */}
					<div className="flex justify-center mb-6">
						<div className="relative">
							<ShopOutlined className="text-4xl text-gray-300" />
							<div className="absolute -bottom-1 -right-1 bg-[#e6f7f8] rounded-full p-1">
								<ExclamationCircleOutlined className="text-base text-[#61b7ba]" />
							</div>
						</div>
					</div>

					{/* Mensaje principal */}
					<h1 className="text-3xl font-bold text-gray-900 mb-4">
						Establecimiento no disponible
					</h1>
					<p className="text-lg text-gray-600 mb-8">
						Lo sentimos, este establecimiento ha sido desactivado o
						eliminado de nuestra plataforma.
					</p>

					{/* Línea separadora */}
					<div className="border-t border-gray-200 my-8"></div>

					{/* Sugerencias */}
					<div className="text-left mb-8">
						<h2 className="text-lg font-semibold text-gray-900 mb-4">
							¿Qué puedo hacer?
						</h2>
						<ul className="space-y-3 text-gray-600">
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 text-[#61b7ba] mr-2">
									•
								</span>
								<span>
									Verificar que la URL del establecimiento sea
									correcta
								</span>
							</li>
							<li className="flex items-start">
								<span className="flex-shrink-0 h-6 w-6 text-[#61b7ba] mr-2">
									•
								</span>
								<span>
									Contactar directamente con el
									establecimiento si tienes su información
								</span>
							</li>
						</ul>
					</div>

					{/* Botones de acción */}
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button
							onClick={() => window.history.back()}
							className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
						>
							<ArrowLeftOutlined className="mr-2" />
							Regresar
						</button>
						<a
							href="/"
							className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-white bg-[#61b7ba] hover:bg-[#4d9296] transition-colors"
						>
							<HomeOutlined className="mr-2" />
							Ir al inicio
						</a>
					</div>
				</div>

				{/* Footer */}
				<p className="mt-8 text-center text-sm text-gray-500">
					¿Eres el dueño del establecimiento?
					<a
						href="/#contact"
						className="ml-1 text-[#61b7ba] hover:text-[#4d9296]"
					>
						Contáctanos
					</a>
				</p>
			</div>
		</div>
	);
}
