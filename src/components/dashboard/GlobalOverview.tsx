import React from 'react';
import { Building2, EuroIcon, Users, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface GlobalOverviewProps {
  data: {
    totalProperties: number;
    totalRevenue: number;
    occupancyRate: number;
    monthlyGrowth: number;
  };
}

const GlobalOverview: React.FC<GlobalOverviewProps> = ({ data }) => {
  const stats = [
    {
      name: 'Total Properties',
      value: data.totalProperties,
      icon: Building2,
      change: null,
    },
    {
      name: 'Total Revenue',
      value: formatCurrency(data.totalRevenue),
      icon: EuroIcon,
      change: data.monthlyGrowth,
    },
    {
      name: 'Average Occupancy',
      value: formatPercentage(data.occupancyRate),
      icon: Users,
      change: 2.5,
    },
    {
      name: 'Monthly Growth',
      value: formatPercentage(data.monthlyGrowth),
      icon: TrendingUp,
      change: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">{stat.value}</div>
                    {stat.change && (
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        <span className="ml-1">{formatPercentage(stat.change)}</span>
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GlobalOverview;