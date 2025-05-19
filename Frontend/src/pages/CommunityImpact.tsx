
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import Footer from '@/components/Footer';
import { PlasticType } from '@/utils/web3Utils';

// Mock data for demonstration
const impactData = [
  { month: 'Jan', wasteCollected: 185, tokens: 370, treesEquivalent: 24 },
  { month: 'Feb', wasteCollected: 220, tokens: 440, treesEquivalent: 28 },
  { month: 'Mar', wasteCollected: 310, tokens: 620, treesEquivalent: 39 },
  { month: 'Apr', wasteCollected: 275, tokens: 550, treesEquivalent: 35 },
  { month: 'May', wasteCollected: 340, tokens: 680, treesEquivalent: 43 },
  { month: 'Jun', wasteCollected: 390, tokens: 780, treesEquivalent: 49 },
];

const topContributors = [
  { rank: 1, address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", wasteCollected: 87.5, tokens: 175 },
  { rank: 2, address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", wasteCollected: 75.2, tokens: 150 },
  { rank: 3, address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", wasteCollected: 62.8, tokens: 126 },
  { rank: 4, address: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", wasteCollected: 56.3, tokens: 113 },
  { rank: 5, address: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", wasteCollected: 49.1, tokens: 98 },
];

const plasticTypeData = [
  { name: "PET", value: 42, color: "#38bdf8" },
  { name: "HDPE", value: 28, color: "#4ade80" },
  { name: "PVC", value: 7, color: "#fb7185" },
  { name: "LDPE", value: 12, color: "#facc15" },
  { name: "PP", value: 8, color: "#c084fc" },
  { name: "PS", value: 3, color: "#f97316" },
];

const impactMetrics = [
  {
    title: "CO2 Emissions Saved",
    value: "37.2 tons",
    description: "Equivalent to planting 620 trees",
    color: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
  },
  {
    title: "Plastic Kept from Oceans",
    value: "12.4 tons",
    description: "Equivalent to 620,000 plastic bottles",
    color: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
  },
  {
    title: "Energy Saved",
    value: "184,000 kWh",
    description: "Enough to power 17 homes for a year",
    color: "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
  },
  {
    title: "Water Conserved",
    value: "3.7 million L",
    description: "Enough for 82,000 showers",
    color: "bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200",
  },
];

const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

const CommunityImpact: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Community Impact
          </h1>
          <p className="mt-3 max-w-2xl text-xl text-gray-500 dark:text-gray-400">
            See how WasteVan is making a difference for our planet.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {/* Impact metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {impactMetrics.map((metric, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className={metric.color}>
                    <CardTitle>{metric.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-waste-600 dark:text-waste-400 mb-2">
                      {metric.value}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Collection Trends</CardTitle>
                  <CardDescription>Waste collected and tokens distributed</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={impactData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="wasteCollected"
                          name="Waste (kg)"
                          stroke="#14b8a6"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="tokens"
                          name="Tokens"
                          stroke="#7e69ab"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plastic Types Collected</CardTitle>
                  <CardDescription>Distribution by plastic category</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={plasticTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {plasticTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top contributors */}
            <Card>
              <CardHeader>
                <CardTitle>Top Contributors</CardTitle>
                <CardDescription>Users with the most significant impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="py-3 px-4 text-left">Rank</th>
                        <th className="py-3 px-4 text-left">Address</th>
                        <th className="py-3 px-4 text-right">Waste Collected (kg)</th>
                        <th className="py-3 px-4 text-right">Tokens Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topContributors.map((contributor) => (
                        <tr key={contributor.rank} className="border-b border-gray-100 dark:border-gray-800">
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-waste-100 dark:bg-waste-900 text-waste-700 dark:text-waste-300">
                              {contributor.rank}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono">
                            {formatAddress(contributor.address)}
                          </td>
                          <td className="py-3 px-4 text-right">
                            {contributor.wasteCollected.toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right text-waste-600 dark:text-waste-400 font-medium">
                            {contributor.tokens.toLocaleString()} WVT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Environmental impact */}
            <Card>
              <CardHeader>
                <CardTitle>Environmental Equivalent</CardTitle>
                <CardDescription>The impact of our waste collection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={impactData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="treesEquivalent" name="Trees Equivalent" fill="#4ade80" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CommunityImpact;
