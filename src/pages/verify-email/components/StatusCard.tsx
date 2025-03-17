import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	CloseCircleOutlined,
	LoadingOutlined,
	SendOutlined,
	UserSwitchOutlined
} from '@ant-design/icons';

import { EmailVerificationStatus } from '../../../types/Auth';

interface StatusCardProps {
	status?: EmailVerificationStatus | null;
	loading?: boolean;
	onPressActionButton?: () => void;
	loadingAction?: boolean;
}

export const StatusCard = ({ status, onPressActionButton, loading, loadingAction }: StatusCardProps) => {
	if (loading || !status) {
		return (
			<div
				className={`min-h-screen bg-[url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2395d1c9' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] transition-colors duration-500 flex items-center justify-center p-4`}
			>
				{/* Estado actual */}
				<div className="relative">
					<div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl transform -rotate-3"></div>
					<div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl min-w-[400px] transform rotate-3 transition-all duration-500">
						<div className="flex flex-col items-center text-center space-y-6">
							<div className="transform transition-transform duration-500 hover:scale-110">
								<LoadingOutlined className="text-[#8ECAC1]" style={{ fontSize: 100 }} />
							</div>
							<h1 className={`text-3xl font-bold text-[#8ECAC1]`}>
								Verificando tu correo electrónico
							</h1>
							<p className="text-gray-600 text-lg">
								Esto solo tomará un momento...
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`min-h-screen ${Config[status].pattern} transition-colors duration-500 flex items-center justify-center p-4`}>
			{/* Estado actual */}
			<div className="relative">
				<div className="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl transform -rotate-3"></div>
				<div className="relative bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-xl min-w-[400px] transform rotate-3 transition-all duration-500">
					<div className="flex flex-col items-center text-center space-y-6">
						<div className="transform transition-transform duration-500 hover:scale-110">
							{Config[status].icon}
						</div>
						<h1 className={`text-3xl font-bold ${Config[status].textColor}`}>
							{Config[status].title}
						</h1>
						<p className="text-gray-600 text-lg">{Config[status].message}</p>
						{onPressActionButton && (
							<button
								className={`${Config[status].bgColor} text-white px-8 py-3 rounded-xl text-lg font-medium transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
								onClick={onPressActionButton}
							>
								{loadingAction && <LoadingOutlined />}
								{Config[status].buttonText}
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

const Config = {
	verified: {
		icon: <CheckCircleOutlined className="text-emerald-500" style={{ fontSize: 100 }} />,
		title: "¡Email verificado!",
		message: "Tu cuenta ha sido verificada exitosamente.",
		buttonText: "Ir a mi panel",
		path: "/dashboard",
		bgColor: "bg-emerald-500",
		textColor: "text-emerald-500",
		pattern:
			"bg-[url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2334d399' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]",
	},
	error: {
		icon: <CloseCircleOutlined className="text-red-500" style={{ fontSize: 100 }} />,
		title: "Error de verificación",
		message: "No pudimos verificar tu correo electrónico.",
		buttonText: "Volver al inicio",
		bgColor: "bg-red-500",
		textColor: "text-red-500",
		pattern:
			"bg-[url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]",
	},
	expired: {
		icon: <ClockCircleOutlined className="text-amber-500" style={{ fontSize: 100 }} />,
		title: "Enlace expirado",
		message:
			"El enlace de verificación ha expirado. Puedes solicitar otro correo de verificación.",
		buttonText: "Solicitar nuevo enlace",
		bgColor: "bg-amber-500",
		textColor: "text-amber-500",
		pattern:
			"bg-[url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")]",
	},
	resent: {
		icon: <SendOutlined className="text-blue-500" style={{ fontSize: 100 }} />,
		title: '¡Enlace enviado!',
		message: 'Hemos enviado un nuevo enlace de verificación a tu correo electrónico.',
		buttonText: 'Volver al inicio',
		bgColor: 'bg-blue-500',
		textColor: 'text-blue-500',
		pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%233b82f6\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
	},
	'login-required': {
		icon: <UserSwitchOutlined className="text-purple-500" style={{ fontSize: 100 }} />,
		title: 'Inicio de sesión requerido',
		message: 'Para verificar tu cuenta, necesitas iniciar sesión primero.',
		buttonText: 'Iniciar sesión',
		bgColor: 'bg-purple-500',
		textColor: 'text-purple-500',
		pattern: 'bg-[url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a855f7\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")]',
	}
}
