import { createBrowserRouter, Navigate } from "react-router-dom";

import QrRedirect from "./pages/panel/QrRedirect";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/account/LoginPage";
import ForgotPasswordPage from "./pages/account/ForgotPasswordPage";
import ResetPasswordPage from "./pages/account/ResetPasswordPage";
import RegisterPage from "./pages/account/RegisterPage";
import MenuPage from "./pages/menu/MenuPage";
import VerifyEmailPage from "./pages/account/VerifyEmailPage";
import EmailActionRouter from "./pages/account/EmailActionRouter";
import NotFoundPage from "./pages/404";
import TermsPage from "./pages/terms";
import PrivacyPoliciesPage from "./pages/privacy-policies";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import PanelLayout from "./pages/panel/PanelLayout";
import HomePage from "./pages/panel/HomePage";
import ProductEditPage from "./pages/panel/menu/ProductEditPage";
import QrPage from "./pages/panel/qr/QrPage";
import MenuEditorPage from "./pages/panel/menu/MenuEditorPage";
import EstablishmentPage from "./pages/panel/establishment/EstablishmentPage";
import SoonPage from "./pages/panel/SoonPage";
import BillingPage from "./pages/panel/BillingPage";

const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/terms",
		element: <TermsPage />,
	},
	{
		path: "/privacy-policies",
		element: <PrivacyPoliciesPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/forgot-password",
		element: <ForgotPasswordPage />,
	},
	{
		path: "/reset-password",
		element: <EmailActionRouter><ResetPasswordPage /></EmailActionRouter>,
	},
	// Rutas viejas: los enlaces de correo existentes siguen funcionando con su query.
	{
		path: "/request-reset-password",
		element: <EmailActionRouter><ForgotPasswordPage /></EmailActionRouter>,
	},
	{
		path: "/change-password-after-request",
		element: <EmailActionRouter><ResetPasswordPage /></EmailActionRouter>,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/dashboard",
		element: <PanelLayout />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "menu", element: <MenuEditorPage /> },
			{ path: "menu/product/new", element: <ProductEditPage /> },
			{ path: "menu/product/:productId", element: <ProductEditPage /> },
			{ path: "establishment", element: <EstablishmentPage /> },
			{ path: "qr", element: <QrPage /> },
			{
				path: "stats",
				element: (
					<SoonPage
						title="Estadísticas"
						body="Muy pronto verás aquí cuántas personas abren tu menú, los escaneos del QR y los platos más vistos."
					/>
				),
			},
			{ path: "billing", element: <BillingPage /> },
			{ path: "menus", element: <Navigate to="/dashboard" replace /> },
			{ path: "invoices", element: <Navigate to="/dashboard/billing" replace /> },
		],
	},
	{
		path: "/panel/establishments",
		element: <Navigate to="/dashboard/establishment" replace />,
	},
	{
		path: "/onboarding",
		element: <OnboardingPage />,
	},
	{
		path: "/verify",
		element: <EmailActionRouter><VerifyEmailPage /></EmailActionRouter>,
	},
	{
		path: "/m/:establishmentUrl",
		element: <MenuPage />,
	},
	{
		path: "/qr/:establishmentUrl",
		element: <QrRedirect />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
