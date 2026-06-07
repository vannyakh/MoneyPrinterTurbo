import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'
import RootLayout from '../layouts/root-layout'
import { CreatePage, NotFoundPage, SettingsPage, TasksPage } from './lazy-pages'

export const appRouter = createBrowserRouter([
  {
    path: ROUTES.home,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.create} replace />,
      },
      {
        path: ROUTES.create,
        element: <CreatePage />,
      },
      {
        path: ROUTES.tasks,
        element: <TasksPage />,
      },
      {
        path: ROUTES.settings,
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
