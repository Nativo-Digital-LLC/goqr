import { useNavigate } from "react-router-dom";

import {
	useSendVerificationEmail,
	useVerifyEmail
} from "../../hooks/useAuth";
import { StatusCard } from "./components/StatusCard";
import { useErrorHandler } from "../../hooks/useError";

export default function VerifyEmailPage() {
	const navigate = useNavigate();

	const [status, loading, error, changeStatus] = useVerifyEmail();
	const [sendVerification, sending, sendError] = useSendVerificationEmail();
	useErrorHandler(sendError);

	if (loading || status === null) {
		return <StatusCard loading />
	}

	if (error) {
		return <StatusCard status='error' />
	}

	return (
		<StatusCard
			status={status}
			loadingAction={sending}
			onPressActionButton={() => {
				if (status === 'error') {
					return navigate('/');
				}

				if (status === 'expired') {
					return sendVerification(
						() => changeStatus('resent'),
						() => changeStatus('verified')
					);
				}

				if (status === 'login-required') {
					return navigate('/login');
				}

				if (status === 'resent') {
					return navigate('/');
				}

				if (status === 'verified') {
					return navigate('/dashboard');
				}
			}}
		/>
	);
}

