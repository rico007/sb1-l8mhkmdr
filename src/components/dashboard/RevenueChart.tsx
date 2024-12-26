import React from 'react';
import { BarChart3 } from 'lucide-react';

interface RevenueChartProps {
  data: {
    date: string;
    amount: number;
  }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const maxAmount = Math.max(...data.map(d => d.amount));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
        <BarChart3 className="h-5 w-5 text-gray-400" />
      </div>
      
      <div className="mt-4 h-64">
        <div className="relative h-full">
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-[calc(100%-24px)]">
            {data.map((item, index) => {
              const height = (item.amount / maxAmount) * 100;
              return (
                <div
                  key={item.date}
                  className="relative flex-1 mx-1"
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-indigo-500 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-sm text-gray-500">
            {data.map((item) => (
              <div key={item.date} className="flex-1 text-center">
                {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;