
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import UserRegistration from '../components/UserRegistration';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import { useContract } from '../context/ContractContext';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: "Report Waste",
      description: "Submit details about your plastic waste through our easy-to-use form.",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Get QR Code",
      description: "Receive a unique QR code for each waste report you submit.",
      icon: "🔄",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Meet an Agent",
      description: "Our verified agents will collect your waste and scan your QR code.",
      icon: "🤝",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Earn Tokens",
      description: "Receive WasteVan tokens as rewards for your contribution.",
      icon: "💰",
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-waste-50 dark:from-gray-900 dark:via-gray-800 dark:to-waste-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-waste-200 dark:bg-waste-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-waste-300 dark:bg-waste-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-waste-100 dark:bg-waste-800 rounded-full mb-6">
            <h2 className="text-sm text-waste-700 dark:text-waste-300 font-bold tracking-wide uppercase">Process</h2>
          </div>
          <h3 className="text-4xl leading-tight font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl text-shadow-lg">
            How WasteVan Works
          </h3>
          <p className="mt-6 max-w-3xl text-xl text-gray-600 dark:text-gray-300 mx-auto leading-relaxed">
            Follow these simple steps to convert your plastic waste into digital tokens and make a positive environmental impact.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                {/* Connection line for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-waste-300 to-waste-400 dark:from-waste-600 dark:to-waste-500 z-0"></div>
                )}

                <div className="glass-card floating-card rounded-2xl p-8 text-center h-full animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r ${step.color} text-4xl mb-6 shadow-lg animate-bounce-slow`} style={{animationDelay: `${index * 0.2}s`}}>
                    {step.icon}
                  </div>
                  <div className="absolute top-4 right-4 text-6xl font-bold text-waste-100 dark:text-waste-800 opacity-50">
                    {index + 1}
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{step.title}</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.description}</p>
                </div>
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
    <><div className="relative bg-gradient-to-r from-waste-600 via-waste-500 to-waste-600 dark:from-waste-800 dark:via-waste-700 dark:to-waste-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full" /></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
      <div className="absolute bottom-10 left-10 w-24 h-24 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
    </div><div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 lg:flex lg:items-center lg:justify-between relative">
        <div className="lg:w-0 lg:flex-1">
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl text-shadow-lg">
            {account && isUser ? (
              <>
                <span className="block animate-fade-in">Ready to collect more waste?</span>
                <span className="block text-waste-100 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Every piece of plastic makes a difference.</span>
              </>
            ) : account && isAgent ? (
              <>
                <span className="block animate-fade-in">Ready to collect waste?</span>
                <span className="block text-waste-100 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Help users turn waste into tokens.</span>
              </>
            ) : (
              <>
                <span className="block animate-fade-in">Ready to make an impact?</span>
                <span className="block text-waste-100 mt-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>Join the WasteVan community today.</span>
              </>
            )}
          </h2>
          <p className="mt-6 text-xl text-waste-100 max-w-3xl animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Be part of the solution. Transform waste into value and help create a sustainable future for our planet.
          </p>
        </div>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {account && isUser ? (
            // User is registered
            <div className="floating-card">
              <Link to="/report-waste">
                <Button className="py-4 px-8 text-lg font-semibold rounded-xl text-waste-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  🗑️ Report Waste
                </Button>
              </Link>
            </div>
          ) : account && isAgent ? (
            // Agent is registered
            <div className="floating-card">
              <Link to="/agent-dashboard">
                <Button className="py-4 px-8 text-lg font-semibold rounded-xl text-waste-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  📊 View Dashboard
                </Button>
              </Link>
            </div>
          ) : account && !isUser && !isAgent ? (
            // Connected but not registered
            <div className="floating-card">
              <Link to="#registration">
                <Button className="py-4 px-8 text-lg font-semibold rounded-xl text-waste-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  ✨ Register Now
                </Button>
              </Link>
            </div>
          ) : (
            // Not connected
            <>
              <div className="floating-card">
                <Link to="/report-waste">
                  <Button className="py-4 px-8 text-lg font-semibold rounded-xl text-waste-700 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300">
                    🗑️ Report Waste
                  </Button>
                </Link>
              </div>
              <div className="floating-card">
                <Link to="/agent-dashboard">
                  <Button variant="outline" className="py-4 px-8 text-lg font-semibold rounded-xl text-white border-2 border-white/50 bg-white/10 hover:bg-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    🤝 Become an Agent
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div></>
  );
};

const Index: React.FC = () => {
  const { account, isUser } = useContract();

  return (
    <div>
      <Hero />
      <StatsSection />
      {/* Show user registration form if user is connected but not registered */}
      {account && !isUser && <div id="registration"><UserRegistration /></div>}

      <HowItWorks />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Index;
