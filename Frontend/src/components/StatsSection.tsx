
import React, { useEffect, useState } from 'react';
import { getWasteStats } from '../utils/web3Utils';

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalWasteCollected: 0,
    totalTokensDistributed: 0,
    activeUsers: 0,
    impactMetric: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWasteStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="bg-waste-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
          <span className="block">Making an Impact</span>
          <span className="block text-waste-600 dark:text-waste-400">Real-time Statistics</span>
        </h2>
        <div className="mt-10">
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-6 animate-fade-in">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Total Waste Collected
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-waste-600 dark:text-waste-400">
                {loading ? "..." : `${stats.totalWasteCollected.toLocaleString()} kg`}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-6 animate-fade-in">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Tokens Distributed
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-waste-600 dark:text-waste-400">
                {loading ? "..." : stats.totalTokensDistributed.toLocaleString()}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-6 animate-fade-in">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Active Users
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-waste-600 dark:text-waste-400">
                {loading ? "..." : stats.activeUsers.toLocaleString()}
              </dd>
            </div>
            <div className="bg-white dark:bg-gray-700 overflow-hidden shadow rounded-lg p-6 animate-fade-in">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                Environmental Impact
              </dt>
              <dd className="mt-1 text-xl font-semibold text-waste-600 dark:text-waste-400">
                {loading ? "..." : stats.impactMetric}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
