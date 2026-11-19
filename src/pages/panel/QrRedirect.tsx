import { Navigate, useParams } from "react-router-dom";

// Enlaces viejos /qr/:slug: siempre al menú público de ese slug (el dueño tiene su QR en el panel).
export default function QrRedirect() {
	const { establishmentUrl } = useParams();
	return <Navigate to={`/m/${establishmentUrl}`} replace />;
}
