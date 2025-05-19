
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, FileText, Home, Recycle, Users, Wallet, BarChart2 } from 'lucide-react';
import ConnectWalletButton from './ConnectWalletButton';
import { Button } from '../components/ui/button';
import { useContract } from '../context/ContractContext';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, isUser, isAgent } = useContract();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-waste-600 dark:text-waste-400 font-bold text-xl">Waste<span className="text-waste-800 dark:text-waste-200">Van</span></span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {/* Always visible links */}
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link to="/community-impact" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                <BarChart2 className="h-4 w-4 mr-1" />
                Impact
              </Link>
              <Link to="/whitepaper" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                Whitepaper
              </Link>

              {/* User-only links */}
              {account && isUser && (
                <Link to="/report-waste" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                  <Recycle className="h-4 w-4 mr-1" />
                  Report Waste
                </Link>
              )}

              {/* Agent-only links */}
              {account && isAgent && (
                <Link to="/agent-dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  Agent Dashboard
                </Link>
              )}

              {/* Authenticated user links */}
              {account && (
                <Link to="/token-wallet" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center">
                  <Wallet className="h-4 w-4 mr-1" />
                  Wallet
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:flex items-center">
            <ConnectWalletButton />
          </div>
          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Always visible links */}
            <Link to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
            <Link to="/community-impact"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Impact
            </Link>
            <Link to="/whitepaper"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5 mr-2" />
              Whitepaper
            </Link>

            {/* User-only links */}
            {account && isUser && (
              <Link to="/report-waste"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Recycle className="h-5 w-5 mr-2" />
                Report Waste
              </Link>
            )}

            {/* Agent-only links */}
            {account && isAgent && (
              <Link to="/agent-dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5 mr-2" />
                Agent Dashboard
              </Link>
            )}

            {/* Authenticated user links */}
            {account && (
              <Link to="/token-wallet"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 flex items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet className="h-5 w-5 mr-2" />
                Wallet
              </Link>
            )}

            <div className="pt-4">
              <ConnectWalletButton />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
