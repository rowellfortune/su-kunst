import { type ReactElement, cloneElement } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../lib/contextLib'

interface UnauthenticatedRouteProps {
  children: ReactElement
}

export default function UnauthenticatedRoute({
  children,
}: UnauthenticatedRouteProps): ReactElement | null {
  const { isAuthenticated } = useAppContext()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const redirectTo = params.get('redirect') || '/'

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If unauthenticated, render the child route/component
  return cloneElement(children)
}
