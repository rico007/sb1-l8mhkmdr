import React from 'react';
import { LucideIcon } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  value: string;
  trend: number;
  Icon: LucideIcon;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, value, trend, Icon }) => {
  const trendColor = trend >= 0 ? 'text-green-500' : 'text-red-500';
  const trendSign = trend >= 0 ? '+' : '';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm ${trendColor}`}>
          {trendSign}{trend}% vs last month
        </span>
      </div>
    </div>
  );
};

export default OverviewCard;