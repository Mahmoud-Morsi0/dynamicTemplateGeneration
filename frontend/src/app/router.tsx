import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import Home from '../pages/Home'
import UploadInspect from '../pages/UploadInspect'
import RenderPage from '../pages/RenderPage'
import Docs from '../pages/Docs'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'upload',
        element: <UploadInspect />,
      },
      {
        path: 'render',
        element: <RenderPage />,
      },
      {
        path: 'docs',
        element: <Docs />,
      },
    ],
  },
])
