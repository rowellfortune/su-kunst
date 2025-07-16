import { type ReactElement, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../lib/contextLib'

interface AuthenticatedRouteProps {
  children: ReactElement
}

export default function AuthenticatedRoute({
  children,
}: AuthenticatedRouteProps): ReactElement | null {
  const { isAuthenticated } = useAppContext()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  // Build and encode the redirect query param once
  const redirectParam = encodeURIComponent(`${pathname}${search}`)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${redirectParam}`, { replace: true })
    }
  }, [isAuthenticated, navigate, redirectParam])

  // While redirecting, render nothing
  if (!isAuthenticated) {
    return null
  }

  // Otherwise render the protected children
  return children
}


