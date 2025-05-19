
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useContract } from '../context/ContractContext';

const Hero: React.FC = () => {
  const { account, isUser, tokenBalance } = useContract();

  return (
    <div className="relative bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pt-14 lg:pt-20 lg:pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block xl:inline">Turn Plastic Waste into </span>
                <span className="block text-waste-600 dark:text-waste-400 xl:inline">Digital Tokens</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                WasteVan connects waste collectors, recyclers, and environmentally conscious individuals
                in a blockchain-powered ecosystem that rewards sustainable actions.
              </p>

              {/* Show different content based on user state */}
              {account && isUser ? (
                // User is connected and registered
                <div className="mt-8">
                  <div className="bg-waste-50 dark:bg-waste-900 rounded-lg p-4 inline-block">
                    <p className="text-waste-700 dark:text-waste-300 font-medium">Welcome back!</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Your token balance: <span className="font-bold">{tokenBalance}</span> WVT</p>
                  </div>
                  <div className="mt-6 max-w-md mx-auto sm:flex sm:justify-center">
                    <div className="rounded-md shadow">
                      <Link to="/report-waste">
                        <Button className="w-full flex items-center justify-center px-8 py-6 border border-transparent text-base font-medium rounded-md text-white bg-waste-600 hover:bg-waste-700 md:py-6 md:text-lg md:px-10">
                          Report Waste
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                      <Link to="/token-wallet">
                        <Button variant="outline" className="w-full flex items-center justify-center px-8 py-6 border border-transparent text-base font-medium rounded-md border-waste-500 text-waste-700 bg-white hover:bg-waste-50 md:py-6 md:text-lg md:px-10">
                          View Wallet
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : account && !isUser ? (
                // User is connected but not registered
                <div className="mt-8">
                  <p className="text-waste-600 dark:text-waste-400 font-medium">Please register to start reporting waste</p>
                </div>
              ) : (
                // User is not connected
                <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center md:mt-12">
                  <div className="rounded-md shadow">
                    <Link to="/report-waste">
                      <Button className="w-full flex items-center justify-center px-8 py-6 border border-transparent text-base font-medium rounded-md text-white bg-waste-600 hover:bg-waste-700 md:py-6 md:text-lg md:px-10">
                        Report Waste
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Link to="/agent-dashboard">
                      <Button variant="outline" className="w-full flex items-center justify-center px-8 py-6 border border-transparent text-base font-medium rounded-md border-waste-500 text-waste-700 bg-white hover:bg-waste-50 md:py-6 md:text-lg md:px-10">
                        Become Agent
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex-1"></div>
            <div className="flex-1 w-full bg-waste-50 dark:bg-waste-900"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <img
              className="relative rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
              src="https://images.unsplash.com/photo-1616680214125-b4f1a74db5c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Plastic waste collection"
              width="2340"
              height="1560"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
