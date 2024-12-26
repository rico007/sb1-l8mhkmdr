import React from 'react';
import { useProperties } from '../hooks/useProperties';
import PropertySelector from '../components/PropertySelector';
import { useSelectedProperty } from '../hooks/useSelectedProperty';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';
import OccupancyChart from '../components/analytics/OccupancyChart';
import PopularSpaces from '../components/analytics/PopularSpaces';
import RevenueMetrics from '../components/analytics/RevenueMetrics';

const Analytics = () => {
  const { selectedPropertyId, setSelectedPropertyId, loading: propertyLoading } = useSelectedProperty();

  if (propertyLoading) {
    return <div className="animate-pulse h-screen bg-gray-100"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Property Analytics</h1>
          <p className="mt-2 text-sm text-gray-700">
            Detailed analytics for individual properties
          </p>
        </div>
        <PropertySelector 
          value={selectedPropertyId} 
          onChange={setSelectedPropertyId}
        />
      </div>

      {selectedPropertyId && (
        <>
          <AnalyticsOverview propertyId={selectedPropertyId} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OccupancyChart propertyId={selectedPropertyId} />
            <PopularSpaces propertyId={selectedPropertyId} />
          </div>

          <RevenueMetrics propertyId={selectedPropertyId} />
        </>
      )}
    </div>
  );
}

export default Analytics;