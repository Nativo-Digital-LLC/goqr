import { createBrowserRouter } from "react-router-dom";

import HomePage from "./pages/home/index";
import LoginPage from "./pages/auth/login";
import RequestResetPasswordPage from "./pages/auth/request-reset-password";
import ChangePasswordAfterRequestPage from "./pages/auth/change-password-after-request";
import RegisterPage from "./pages/auth/register";
import MenuPage from "./pages/menu";
import DashboardPage from "./pages/dashboard";
import VerifyEmailPage from "./pages/verify-email";
import NotFoundPage from "./pages/404";
import QrPage from "./pages/menu/qr";
import TermsPage from "./pages/terms";
import PrivacyPoliciesPage from "./pages/privacy-policies";
import { Establishments } from "./pages/panel/Establishments";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
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
		path: "/request-reset-password",
		element: <RequestResetPasswordPage />,
	},
	{
		path: "/change-password-after-request",
		element: <ChangePasswordAfterRequestPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/dashboard",
		element: <DashboardPage />,
	},
	{
		path: "/panel/establishments",
		element: <Establishments />,
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
