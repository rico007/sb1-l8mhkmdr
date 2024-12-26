import React from 'react';
import { useOccupancyData } from '../../hooks/useAnalytics';

const OccupancyChart: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const { data, loading } = useOccupancyData(propertyId);

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Occupancy Rate</h3>
      <div className="h-64 flex items-end space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-full bg-indigo-500 rounded-t"
              style={{ height: `${item.rate}%` }}
            ></div>
            <span className="text-sm text-gray-600 mt-2">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OccupancyChart;