import { Navigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes'

export default function HomePage() {
  return <Navigate to={ROUTES.create} replace />
}
