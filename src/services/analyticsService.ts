import { supabase } from '../lib/supabase';
import { Property, Seat } from '../types';

export const analyticsService = {
  async calculateOccupancyRate(propertyId: string): Promise<number> {
    const { data: seats } = await supabase
      .from('seats')
      .select('status')
      .eq('property_id', propertyId);
    
    if (!seats || seats.length === 0) return 0;
    
    const occupiedSeats = seats.filter(seat => seat.status === 'reserved').length;
    return (occupiedSeats / seats.length) * 100;
  },

  async calculateUtilization(propertyId: string): Promise<number> {
    const { data: seats } = await supabase
      .from('seats')
      .select('status')
      .eq('property_id', propertyId);
    
    if (!seats || seats.length === 0) return 0;
    
    const activeSeats = seats.filter(seat => seat.status !== 'blocked').length;
    return (activeSeats / seats.length) * 100;
  },

  async getPopularSpaces(propertyId: string) {
    const { data: seats } = await supabase
      .from('seats')
      .select('*')
      .eq('property_id', propertyId);

    if (!seats) return [];

    return seats
      .map(seat => ({
        id: seat.id,
        name: seat.name,
        type: seat.type,
        utilization: Math.random() * 100, // This should be calculated from actual booking data
        revenue: seat.price?.hourly || 0
      }))
      .sort((a, b) => b.utilization - a.utilization)
      .slice(0, 5);
  }
};