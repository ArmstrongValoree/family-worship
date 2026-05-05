import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { ROUTES } from '../../lib/constants'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuthContext()

  if (loading) return null
  if (!user) return <Navigate to={ROUTES.LOGIN} replace />
  return <>{children}</>
}
