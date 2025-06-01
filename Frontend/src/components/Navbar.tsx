
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
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-waste-600 to-waste-400 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform duration-200">
                  W
                </div>
                <span className="gradient-text font-bold text-xl group-hover:scale-105 transition-transform duration-200">
                  Waste<span className="text-waste-800 dark:text-waste-200">Van</span>
                </span>
              </div>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {/* Always visible links */}
              <Link to="/" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                <Home className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Home
              </Link>
              <Link to="/community-impact" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                <BarChart2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Impact
              </Link>
              <Link to="/whitepaper" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                <FileText className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                Whitepaper
              </Link>

              {/* User-only links */}
              {account && isUser && (
                <Link to="/report-waste" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                  <Recycle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Report Waste
                </Link>
              )}

              {/* Agent-only links */}
              {account && isAgent && (
                <Link to="/agent-dashboard" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                  <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  Agent Dashboard
                </Link>
              )}

              {/* Authenticated user links */}
              {account && (
                <Link to="/token-wallet" className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200 group">
                  <Wallet className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
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
        <div className="sm:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Always visible links */}
            <Link to="/"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            <Link to="/community-impact"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Impact
            </Link>
            <Link to="/whitepaper"
              className="block px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-200 hover:text-waste-600 dark:hover:text-waste-400 hover:bg-waste-50 dark:hover:bg-waste-900/20 flex items-center transition-all duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FileText className="h-5 w-5 mr-3" />
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
