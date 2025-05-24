
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import UserRegistration from '../components/UserRegistration';
import WalletConnectionTest from '../components/WalletConnectionTest';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Report Waste",
      description: "Submit details about your plastic waste through our easy-to-use form.",
      icon: "📱",
    },
    {
      title: "Get QR Code",
      description: "Receive a unique QR code for each waste report you submit.",
      icon: "🔄",
    },
    {
      title: "Meet an Agent",
      description: "Our verified agents will collect your waste and scan your QR code.",
      icon: "🤝",
    },
    {
      title: "Earn Tokens",
      description: "Receive WasteVan tokens as rewards for your contribution.",
      icon: "💰",
    },
  ];

  return (
    <div className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-waste-600 dark:text-waste-400 font-semibold tracking-wide uppercase">Process</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            How WasteVan Works
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Follow these simple steps to convert your plastic waste into digital tokens.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center p-6 bg-waste-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-waste-100 dark:bg-waste-900 text-3xl">
                  {step.icon}
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400 text-center">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const CallToAction: React.FC = () => {
  const { account, isUser, isAgent } = useContract();

  return (
    <div className="bg-waste-600 dark:bg-waste-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {account && isUser ? (
            <>
              <span className="block">Ready to collect more waste?</span>
              <span className="block text-waste-200">Every piece of plastic makes a difference.</span>
            </>
          ) : account && isAgent ? (
            <>
              <span className="block">Ready to collect waste?</span>
              <span className="block text-waste-200">Help users turn waste into tokens.</span>
            </>
          ) : (
            <>
              <span className="block">Ready to make an impact?</span>
              <span className="block text-waste-200">Join the WasteVan community today.</span>
            </>
          )}
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          {account && isUser ? (
            // User is registered
            <div className="inline-flex rounded-md shadow">
              <Link to="/report-waste">
                <Button className="py-4 px-6 text-lg font-medium rounded-md text-waste-700 bg-white hover:bg-gray-50">
                  Report Waste
                </Button>
              </Link>
            </div>
          ) : account && isAgent ? (
            // Agent is registered
            <div className="inline-flex rounded-md shadow">
              <Link to="/agent-dashboard">
                <Button className="py-4 px-6 text-lg font-medium rounded-md text-waste-700 bg-white hover:bg-gray-50">
                  View Dashboard
                </Button>
              </Link>
            </div>
          ) : account && !isUser && !isAgent ? (
            // Connected but not registered
            <div className="inline-flex rounded-md shadow">
              <Link to="#registration">
                <Button className="py-4 px-6 text-lg font-medium rounded-md text-waste-700 bg-white hover:bg-gray-50">
                  Register Now
                </Button>
              </Link>
            </div>
          ) : (
            // Not connected
            <>
              <div className="inline-flex rounded-md shadow">
                <Link to="/report-waste">
                  <Button className="py-4 px-6 text-lg font-medium rounded-md text-waste-700 bg-white hover:bg-gray-50">
                    Report Waste
                  </Button>
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link to="/agent-dashboard">
                  <Button variant="secondary" className="py-4 px-6 text-lg font-medium rounded-md text-white bg-waste-700 hover:bg-waste-800">
                    Become an Agent
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => {
  const { account, isUser } = useContract();

  return (
    <div>
      <Hero />
      <StatsSection />

      {/* Temporary test component */}
      <div className="py-8">
        <WalletConnectionTest />
      </div>

      {/* Show user registration form if user is connected but not registered */}
      {account && !isUser && <div id="registration"><UserRegistration /></div>}

      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
