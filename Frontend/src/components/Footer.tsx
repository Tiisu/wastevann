
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-waste-600 dark:text-waste-400 font-bold text-xl">Waste<span className="text-waste-800 dark:text-waste-200">Van</span></span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Turning plastic waste into tokens, making the world cleaner and more sustainable.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Navigation</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/report-waste" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Report Waste
                </Link>
              </li>
              <li>
                <Link to="/agent-dashboard" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Agent Dashboard
                </Link>
              </li>
              <li>
                <Link to="/community-impact" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Community Impact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Connect</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  Medium
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 dark:text-gray-400 hover:text-waste-600 dark:hover:text-waste-400">
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} WasteVan. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
