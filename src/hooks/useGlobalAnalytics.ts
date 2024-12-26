import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface GlobalAnalytics {
  overview: {
    totalProperties: number;
    totalRevenue: number;
    occupancyRate: number;
    monthlyGrowth: number;
  };
  revenue: {
    date: string;
    amount: number;
  }[];
  topPerformers: {
    propertyId: string;
    revenue: number;
    occupancyRate: number;
  }[];
}

export function useGlobalAnalytics() {
  const [data, setData] = useState<GlobalAnalytics>({
    overview: {
      totalProperties: 0,
      totalRevenue: 0,
      occupancyRate: 0,
      monthlyGrowth: 0
    },
    revenue: [],
    topPerformers: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGlobalAnalytics();
  }, []);

  async function loadGlobalAnalytics() {
    try {
      // Get total properties
      const { count: totalProperties } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      // Get revenue and occupancy data
      const { data: analytics } = await supabase
        .from('analytics_daily')
        .select(`
          property_id,
          date,
          revenue,
          occupancy_rate
        `)
        .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (analytics) {
        // Calculate overview metrics
        const totalRevenue = analytics.reduce((sum, day) => sum + Number(day.revenue), 0);
        const avgOccupancy = analytics.reduce((sum, day) => sum + Number(day.occupancy_rate), 0) / analytics.length;

        // Calculate revenue by date
        const revenueByDate = analytics.reduce((acc, day) => {
          const date = day.date;
          acc[date] = (acc[date] || 0) + Number(day.revenue);
          return acc;
        }, {} as Record<string, number>);

        // Calculate top performers
        const propertyMetrics = analytics.reduce((acc, day) => {
          if (!acc[day.property_id]) {
            acc[day.property_id] = { revenue: 0, occupancyRates: [] };
          }
          acc[day.property_id].revenue += Number(day.revenue);
          acc[day.property_id].occupancyRates.push(Number(day.occupancy_rate));
          return acc;
        }, {} as Record<string, { revenue: number; occupancyRates: number[] }>);

        const topPerformers = Object.entries(propertyMetrics)
          .map(([propertyId, metrics]) => ({
            propertyId,
            revenue: metrics.revenue,
            occupancyRate: metrics.occupancyRates.reduce((a, b) => a + b, 0) / metrics.occupancyRates.length
          }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);

        setData({
          overview: {
            totalProperties: totalProperties || 0,
            totalRevenue,
            occupancyRate: avgOccupancy,
            monthlyGrowth: 5.4 // This should be calculated based on previous month's data
          },
          revenue: Object.entries(revenueByDate).map(([date, amount]) => ({
            date,
            amount
          })),
          topPerformers
        });
      }
    } catch (error) {
      console.error('Error loading global analytics:', error);
    } finally {
      setLoading(false);
    }
  }

  return { data, loading };
}