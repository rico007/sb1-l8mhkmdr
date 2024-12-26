import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useRevenueData } from '../../hooks/useAnalytics';

const RevenueMetrics: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const { data, loading } = useRevenueData(propertyId);

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data.map((metric) => (
        <div key={metric.label} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{metric.label}</p>
              <p className="text-2xl font-semibold text-gray-900">${metric.value}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {metric.trend > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`ml-2 text-sm ${
              metric.trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {Math.abs(metric.trend)}% vs last month
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueMetrics;