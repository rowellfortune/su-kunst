import { type ReactElement, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../lib/contextLib'

interface AdminRouteProps {
  children: ReactElement
}

export default function AdminRoute({
  children,
}: AdminRouteProps): ReactElement | null {
  const { isAuthenticated, user } = useAppContext()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  // Build and encode the redirect query param once
  const redirectParam = encodeURIComponent(`${pathname}${search}`)

  useEffect(() => {
    // 1) If not logged in, send to login
    if (!isAuthenticated) {
      navigate(`/login?redirect=${redirectParam}`, { replace: true })
      return
    }

    // 2) If logged in, but not an admin, send to unauthorized
    //    Replace `user.roles` with whatever your context actually provides.
    if (!user?.attributes["custom:role"]?.includes('admin')) {
      navigate('/unauthorized', { replace: true })
    }
  }, [isAuthenticated, user, navigate, redirectParam])

  // While we're redirecting, or if they lack permissions, render nothing
  if (!isAuthenticated || !user?.attributes["custom:role"]?.includes('admin')) {
    return null
  }

  // OK, they're an admin—render the protected content
  return children
}
