
import React, { useEffect, useState } from 'react';
import { getWasteStats } from '../utils/web3Utils';

// Counter animation hook
const useCountUp = (end: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isVisible || end === 0) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return { count, setIsVisible };
};

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState({
    totalWasteCollected: 0,
    totalTokensDistributed: 0,
    activeUsers: 0,
    impactMetric: ""
  });

  const [loading, setLoading] = useState(true);

  // Counter animations
  const wasteCounter = useCountUp(stats.totalWasteCollected);
  const tokenCounter = useCountUp(stats.totalTokensDistributed);
  const userCounter = useCountUp(stats.activeUsers);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getWasteStats();
        setStats(data);
        // Trigger counter animations when data is loaded
        setTimeout(() => {
          wasteCounter.setIsVisible(true);
          tokenCounter.setIsVisible(true);
          userCounter.setIsVisible(true);
        }, 500);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="relative bg-gradient-to-br from-waste-50 via-white to-waste-100 dark:from-gray-800 dark:via-gray-900 dark:to-waste-900 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-waste-200 dark:bg-waste-700 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-float"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-waste-300 dark:bg-waste-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-xl opacity-50 animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-20 lg:px-8 relative">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl text-shadow-lg">
            <span className="block">Making an Impact</span>
            <span className="block gradient-text mt-2">Real-time Statistics</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            See the collective impact of our community working together for a cleaner environment
          </p>
        </div>
        <div className="mt-12">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="glass-card floating-card rounded-2xl p-8 text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
              <div className="text-4xl mb-4">🗑️</div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                Total Waste Collected
              </dt>
              <dd className="text-4xl font-bold gradient-text">
                {loading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  `${wasteCounter.count.toLocaleString()} kg`
                )}
              </dd>
            </div>

            <div className="glass-card floating-card rounded-2xl p-8 text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl mb-4">💰</div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                Tokens Distributed
              </dt>
              <dd className="text-4xl font-bold gradient-text">
                {loading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  `${tokenCounter.count.toLocaleString()} WVT`
                )}
              </dd>
            </div>

            <div className="glass-card floating-card rounded-2xl p-8 text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <div className="text-4xl mb-4">👥</div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                Active Users
              </dt>
              <dd className="text-4xl font-bold gradient-text">
                {loading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  userCounter.count.toLocaleString()
                )}
              </dd>
            </div>

            <div className="glass-card floating-card rounded-2xl p-8 text-center animate-fade-in" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl mb-4">🌱</div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider mb-3">
                Environmental Impact
              </dt>
              <dd className="text-2xl font-bold gradient-text">
                {loading ? (
                  <div className="animate-pulse">...</div>
                ) : (
                  stats.impactMetric
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
