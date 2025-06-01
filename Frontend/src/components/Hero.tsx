
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useContract } from '../context/ContractContext';

const Hero: React.FC = () => {
  const { account, isUser, tokenBalance } = useContract();

  return (
    <div className="relative bg-gradient-to-br from-waste-50 via-white to-waste-100 dark:from-gray-900 dark:via-gray-800 dark:to-waste-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-waste-200 dark:bg-waste-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-waste-300 dark:bg-waste-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-waste-400 dark:bg-waste-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-70 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="relative z-10 pt-14 lg:pt-20 lg:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl animate-fade-in text-shadow-lg">
                <span className="block xl:inline">Turn Plastic Waste into </span><br />
                <span className="block gradient-text xl:inline animate-pulse-slow">Digital Tokens</span>
              </h1>
              <p className="mt-6 max-w-md mx-auto text-base text-gray-600 dark:text-gray-300 sm:text-lg md:mt-8 md:text-xl md:max-w-3xl animate-fade-in leading-relaxed" style={{animationDelay: '0.2s'}}>
                WasteVan connects waste collectors, recyclers, and environmentally conscious individuals
                in a blockchain-powered ecosystem that rewards sustainable actions.
              </p>

              {/* Show different content based on user state */}
              {account && isUser ? (
                // User is connected and registered
                <div className="mt-10 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="glass-card rounded-2xl p-6 inline-block shadow-2xl">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="text-waste-700 dark:text-waste-300 font-semibold text-lg">Welcome back!</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600 dark:text-gray-400 text-sm">Your token balance:</p>
                      <div className="text-3xl font-bold gradient-text mt-1">{tokenBalance} WVT</div>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">WasteVan Tokens</p>
                    </div>
                  </div>
                  <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center gap-4">
                    <div className="floating-card">
                      <Link to="/report-waste">
                        <Button className="w-full flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-waste-600 to-waste-500 hover:from-waste-700 hover:to-waste-600 shadow-lg hover:shadow-xl transition-all duration-300 md:text-lg md:px-12">
                          🗑️ Report Waste
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 sm:mt-0 floating-card">
                      <Link to="/token-wallet">
                        <Button variant="outline" className="w-full flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-waste-500 text-waste-700 dark:text-waste-300 bg-white/80 dark:bg-gray-800/80 hover:bg-waste-50 dark:hover:bg-waste-900/50 shadow-lg hover:shadow-xl transition-all duration-300 md:text-lg md:px-12">
                          💰 View Wallet
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : account && !isUser ? (
                // User is connected but not registered
                <div className="mt-10 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="glass-card rounded-2xl p-6 inline-block shadow-2xl">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <p className="text-waste-600 dark:text-waste-400 font-semibold text-lg">Please register to start reporting waste</p>
                    </div>
                  </div>
                </div>
              ) : (
                // User is not connected
                <div className="mt-12 max-w-lg mx-auto sm:flex sm:justify-center gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <div className="floating-card">
                    <Link to="/report-waste">
                      <Button className="w-full flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl text-white bg-gradient-to-r from-waste-600 to-waste-500 hover:from-waste-700 hover:to-waste-600 shadow-lg hover:shadow-xl transition-all duration-300 md:text-lg md:px-12">
                        🗑️ Report Waste
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 floating-card">
                    <Link to="/agent-dashboard">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-4 text-base font-semibold rounded-xl border-2 border-waste-500 text-waste-700 dark:text-waste-300 bg-white/80 dark:bg-gray-800/80 hover:bg-waste-50 dark:hover:bg-waste-900/50 shadow-lg hover:shadow-xl transition-all duration-300 md:text-lg md:px-12">
                        🤝 Become Agent
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative mt-16">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1"></div>
            <div className="flex-1 w-full waste-gradient-subtle"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <div className="relative floating-card">
              <img
                className="relative rounded-2xl shadow-2xl border-2 border-white/50 dark:border-gray-700/50 overflow-hidden"
                src="https://images.unsplash.com/photo-1616680214125-b4f1a74db5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
                alt="Plastic waste collection"
                width="2340"
                height="1560"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
