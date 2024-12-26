import React from 'react';
import { useProperties } from '../hooks/useProperties';
import { useGlobalAnalytics } from '../hooks/useGlobalAnalytics';
import GlobalOverview from '../components/dashboard/GlobalOverview';
import PropertyList from '../components/dashboard/PropertyList';
import RevenueChart from '../components/dashboard/RevenueChart';
import TopPerformers from '../components/dashboard/TopPerformers';

const Dashboard = () => {
  const { properties, loading: propertiesLoading } = useProperties();
  const { data: analytics, loading: analyticsLoading } = useGlobalAnalytics();

  if (propertiesLoading || analyticsLoading) {
    return <div className="animate-pulse h-screen bg-gray-100"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of all your properties
        </p>
      </div>

      <GlobalOverview data={analytics.overview} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={analytics.revenue} />
        <TopPerformers properties={properties} data={analytics.topPerformers} />
      </div>

      <PropertyList properties={properties} />
    </div>
  );
};

export default Dashboard;