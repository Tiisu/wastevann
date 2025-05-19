import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useContract } from '../context/ContractContext';

interface AccessDeniedProps {
  message?: string;
  requiresAuth?: boolean;
  requiresUser?: boolean;
  requiresAgent?: boolean;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({
  message,
  requiresAuth = false,
  requiresUser = false,
  requiresAgent = false,
}) => {
  const { account } = useContract();
  
  // Determine the appropriate message based on the requirements
  const getDefaultMessage = () => {
    if (requiresAuth && !account) {
      return 'Please connect your wallet to access this page';
    }
    if (requiresUser) {
      return 'You need to register as a user to access this page';
    }
    if (requiresAgent) {
      return 'You need to be registered as an agent to access this page';
    }
    return 'You do not have permission to access this page';
  };
  
  const displayMessage = message || getDefaultMessage();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <ShieldAlert className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{displayMessage}</p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link to="/" className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </Button>
        
        {requiresAuth && !account && (
          <Button variant="outline" asChild>
            <Link to="/" className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Connect Wallet
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccessDenied;
