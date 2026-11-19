import { createBrowserRouter, Navigate } from "react-router-dom";

import LandingPage from "./pages/landing/LandingPage";
import LoginPage from "./pages/account/LoginPage";
import ForgotPasswordPage from "./pages/account/ForgotPasswordPage";
import ResetPasswordPage from "./pages/account/ResetPasswordPage";
import RegisterPage from "./pages/account/RegisterPage";
import MenuPage from "./pages/menu";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MenusPage from "./pages/dashboard/Menus";
import InvoicesPage from "./pages/dashboard/Invoices";
import VerifyEmailPage from "./pages/account/VerifyEmailPage";
import NotFoundPage from "./pages/404";
import QrPage from "./pages/menu/qr";
import TermsPage from "./pages/terms";
import PrivacyPoliciesPage from "./pages/privacy-policies";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import { Establishments } from "./pages/panel/Establishments";

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
		element: <ResetPasswordPage />,
	},
	// Rutas viejas: los enlaces de correo existentes siguen funcionando con su query.
	{
		path: "/request-reset-password",
		element: <ForgotPasswordPage />,
	},
	{
		path: "/change-password-after-request",
		element: <ResetPasswordPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/dashboard",
		element: <DashboardLayout />,
		children: [
			{
				index: true,
				element: <Navigate to="/dashboard/menus" replace />,
			},
			{
				path: "menus",
				element: <MenusPage />,
			},
			{
				path: "invoices",
				element: <InvoicesPage />,
			},
		],
	},
	{
		path: "/panel/establishments",
		element: <Establishments />,
	},
	{
		path: "/onboarding",
		element: <OnboardingPage />,
	},
	{
		path: "/verify",
		element: <VerifyEmailPage />,
	},
	{
		path: "/m/:establishmentUrl",
		element: <MenuPage />,
	},
	{
		path: "/qr/:establishmentUrl",
		element: <QrPage />,
	},
	{
		path: "*",
		element: <NotFoundPage />,
	},
]);

export default router;
