import React from 'react';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresUser?: boolean;
  requiresAgent?: boolean;
}

/**
 * A component that protects routes based on authentication and role requirements
 * @param children The component to render if access is granted
 * @param requiresAuth Whether the route requires authentication
 * @param requiresUser Whether the route requires the user role
 * @param requiresAgent Whether the route requires the agent role
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiresAuth = false,
  requiresUser = false,
  requiresAgent = false,
}) => {
  const { account, isUser, isAgent } = useContract();

  // If no authentication or role is required, render the children
  if (!requiresAuth && !requiresUser && !requiresAgent) {
    return <>{children}</>;
  }

  // If authentication is required but user is not connected
  if (requiresAuth && !account) {
    toast.error('Please connect your wallet to access this page');
    return <AccessDenied requiresAuth />;
  }

  // If user role is required but user is not registered
  if (requiresUser && !isUser) {
    toast.error('You need to register as a user to access this page');
    return <AccessDenied requiresUser />;
  }

  // If agent role is required but user is not an agent
  if (requiresAgent && !isAgent) {
    toast.error('You need to be registered as an agent to access this page');
    return <AccessDenied requiresAgent />;
  }

  // If all requirements are met, render the children
  return <>{children}</>;
};

export default ProtectedRoute;
