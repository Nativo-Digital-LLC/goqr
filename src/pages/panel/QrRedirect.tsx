import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import { auth } from "@/utils/firebase";

// Enlaces viejos /qr/:slug: el dueño va a su QR; quien no ingresó, al menú público.
export default function QrRedirect() {
	const { establishmentUrl } = useParams();
	const [to, setTo] = useState<string | null>(null);
	useEffect(() => {
		auth.authStateReady().then(() => setTo(auth.currentUser ? "/dashboard/qr" : `/m/${establishmentUrl}`));
	}, [establishmentUrl]);
	return to ? <Navigate to={to} replace /> : null;
}
