import { createBrowserRouter, Navigate } from "react-router-dom";

import HomePage from "./pages/home/index";
import LoginPage from "./pages/auth/login";
import RequestResetPasswordPage from "./pages/auth/request-reset-password";
import ChangePasswordAfterRequestPage from "./pages/auth/change-password-after-request";
import RegisterPage from "./pages/auth/register";
import MenuPage from "./pages/menu";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import MenusPage from "./pages/dashboard/Menus";
import InvoicesPage from "./pages/dashboard/Invoices";
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
