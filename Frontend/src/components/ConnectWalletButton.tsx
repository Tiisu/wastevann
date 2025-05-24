
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { formatAddress } from '../utils/web3Utils';
import { useContract } from '../context/ContractContext';
import { toast } from 'sonner';

const ConnectWalletButton: React.FC = () => {
  const navigate = useNavigate();
  const { account, connectWallet, disconnectWallet, needsRegistration } = useContract();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // Redirect to registration page if needed
  useEffect(() => {
    console.log('ConnectWalletButton useEffect triggered:', { account, needsRegistration });
    if (account && needsRegistration) {
      console.log('Redirecting to registration page...');
      toast.info('Please complete your registration');
      navigate('/registration');
    }
  }, [account, needsRegistration, navigate]);

  // Listen for custom needsRegistration event as backup
  useEffect(() => {
    const handleNeedsRegistration = (event: CustomEvent) => {
      console.log('Custom needsRegistration event received:', event.detail);
      if (event.detail.needsRegistration) {
        console.log('Redirecting via custom event...');
        navigate('/registration');
      }
    };

    window.addEventListener('needsRegistration', handleNeedsRegistration as EventListener);

    return () => {
      window.removeEventListener('needsRegistration', handleNeedsRegistration as EventListener);
    };
  }, [navigate]);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connectWallet();

      // Add a small delay to ensure state is updated before checking
      setTimeout(() => {
        console.log('Post-connect check:', { account, needsRegistration });
      }, 1000);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsDisconnecting(true);

    // Add a small delay to show the disconnecting state
    setTimeout(() => {
      disconnectWallet();
      setIsDisconnecting(false);
    }, 500);
  };

  return (
    <div>
      {account ? (
        <div className="flex items-center gap-2">
          <span className="hidden md:inline text-sm font-medium">{formatAddress(account)}</span>
          <Button
            variant="outline"
            onClick={handleDisconnect}
            disabled={isDisconnecting}
            className="border-waste-500 text-waste-700 hover:bg-waste-50 hover:text-waste-800 disabled:opacity-50"
          >
            <LogOut className={`h-4 w-4 mr-2 ${isDisconnecting ? 'animate-pulse' : ''}`} />
            {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          disabled={isConnecting}
          className="bg-waste-600 hover:bg-waste-700"
        >
          <Wallet className="h-4 w-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}
    </div>
  );
};

export default ConnectWalletButton;
