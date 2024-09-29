import { createBrowserRouter } from 'react-router-dom';

import HomePage from './pages/home';
import LoginPage from './pages/auth/login';
import RegisterPage from './pages/auth/register';
import MenuPage from './pages/menu';
import DashboardPage from './pages/dashboard';
import VerifyEmailPage from './pages/verify-email';

const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/register',
		element: <RegisterPage />
	},
	{
		path: '/dashboard',
		element: <DashboardPage />
	},
	{
		path: '/verify',
		element: <VerifyEmailPage />
	},
	{
		path: '*',
		element: <MenuPage />
	}
]);

export default router;
