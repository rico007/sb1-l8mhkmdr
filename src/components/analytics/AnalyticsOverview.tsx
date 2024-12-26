import React from 'react';
import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { useOccupancyData, useRevenueData } from '../../hooks/useAnalytics';
import OverviewCard from './OverviewCard';

interface AnalyticsOverviewProps {
  propertyId: string;
}

const AnalyticsOverview: React.FC<AnalyticsOverviewProps> = ({ propertyId }) => {
  const { data: occupancyData } = useOccupancyData(propertyId);
  const { data: revenueData } = useRevenueData(propertyId);

  const currentOccupancy = occupancyData[0]?.rate || 0;
  const lastMonthOccupancy = occupancyData[occupancyData.length - 1]?.rate || 0;
  const occupancyTrend = lastMonthOccupancy ? 
    ((currentOccupancy - lastMonthOccupancy) / lastMonthOccupancy) * 100 : 0;

  const monthlyRevenue = revenueData.find(item => item.label === 'Monthly Revenue');

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <OverviewCard
        title="Occupancy Rate"
        value={`${Math.round(currentOccupancy)}%`}
        trend={Number(occupancyTrend.toFixed(1))}
        Icon={Users}
      />
      {monthlyRevenue && (
        <OverviewCard
          title="Monthly Revenue"
          value={`$${monthlyRevenue.value.toLocaleString()}`}
          trend={monthlyRevenue.trend}
          Icon={TrendingUp}
        />
      )}
      <OverviewCard
        title="Utilization"
        value="89%"
        trend={2.5}
        Icon={BarChart3}
      />
    </div>
  );
};

export default AnalyticsOverview;