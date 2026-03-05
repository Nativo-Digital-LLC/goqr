import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom';
import * as Sentry from '@sentry/react';

Sentry.init({
	dsn: import.meta.env.VITE_APP_SENTRY_DSN
});

import './index.css'
import router from './router';

createRoot(document.getElementById('root')!).render(
	<RouterProvider router={router} />
)
