import React from 'react';
import { usePopularSpaces } from '../../hooks/useAnalytics';

const PopularSpaces: React.FC<{ propertyId: string }> = ({ propertyId }) => {
  const { data, loading } = usePopularSpaces(propertyId);

  if (loading) {
    return <div className="animate-pulse h-64 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Most Popular Spaces</h3>
      <div className="space-y-4">
        {data.map((space) => (
          <div key={space.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold text-indigo-600">
                  {space.utilization}%
                </span>
              </div>
              <div className="ml-4">
                <p className="font-medium text-gray-900">{space.name}</p>
                <p className="text-sm text-gray-500">{space.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">${space.revenue}</p>
              <p className="text-sm text-gray-500">This month</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularSpaces;