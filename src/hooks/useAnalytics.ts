import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useOccupancyData(propertyId: string) {
  const [data, setData] = useState<Array<{ date: string; rate: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: analytics } = await supabase
          .from('analytics_daily')
          .select('date, occupancy_rate')
          .eq('property_id', propertyId)
          .order('date', { ascending: true })
          .limit(7);

        if (analytics) {
          setData(analytics.map(day => ({
            date: day.date,
            rate: Number(day.occupancy_rate)
          })));
        }
      } catch (error) {
        console.error('Error fetching occupancy data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [propertyId]);

  return { data, loading };
}

export function useRevenueData(propertyId: string) {
  const [data, setData] = useState<Array<{
    label: string;
    value: number;
    trend: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: seats } = await supabase
          .from('seats')
          .select('hourly_rate, daily_rate, monthly_rate')
          .eq('property_id', propertyId);

        if (seats && seats.length > 0) {
          const monthlyRevenue = seats.reduce((sum, seat) => sum + Number(seat.monthly_rate), 0);
          const weeklyRevenue = seats.reduce((sum, seat) => sum + Number(seat.daily_rate) * 7, 0);
          const dailyRevenue = seats.reduce((sum, seat) => sum + Number(seat.daily_rate), 0);

          setData([
            {
              label: 'Monthly Revenue',
              value: monthlyRevenue,
              trend: 5.4
            },
            {
              label: 'Weekly Revenue',
              value: weeklyRevenue,
              trend: 3.2
            },
            {
              label: 'Daily Revenue',
              value: dailyRevenue,
              trend: 1.8
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [propertyId]);

  return { data, loading };
}

export function usePopularSpaces(propertyId: string) {
  const [data, setData] = useState<Array<{
    id: string;
    name: string;
    type: string;
    utilization: number;
    revenue: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: analytics } = await supabase
          .from('analytics_daily')
          .select(`
            seat_id,
            seats (
              id,
              name,
              type,
              daily_rate
            ),
            occupancy_rate,
            revenue
          `)
          .eq('property_id', propertyId)
          .eq('date', new Date().toISOString().split('T')[0]);

        if (analytics) {
          const spaces = analytics.map(item => ({
            id: item.seats.id,
            name: item.seats.name,
            type: item.seats.type,
            utilization: Number(item.occupancy_rate),
            revenue: Number(item.revenue)
          }))
          .sort((a, b) => b.utilization - a.utilization)
          .slice(0, 5);

          setData(spaces);
        }
      } catch (error) {
        console.error('Error fetching popular spaces:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [propertyId]);

  return { data, loading };
}