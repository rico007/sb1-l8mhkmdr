import React from 'react';
import { Property } from '../../types';
import { TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface TopPerformersProps {
  properties: Property[];
  data: {
    propertyId: string;
    revenue: number;
    occupancyRate: number;
  }[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ properties, data }) => {
  const getPropertyName = (id: string) => {
    return properties.find(p => p.id === id)?.name || 'Unknown Property';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Top Performing Properties</h3>
        <TrendingUp className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.propertyId} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{getPropertyName(item.propertyId)}</p>
              <p className="text-sm text-gray-500">{formatPercentage(item.occupancyRate)} Occupancy</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{formatCurrency(item.revenue)}</p>
              <p className="text-sm text-green-600">+{formatPercentage((item.revenue / 1000) * 2.5)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopPerformers;