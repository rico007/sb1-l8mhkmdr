import { supabase } from '../lib/supabase';
import { Property, Seat, BookingRule } from '../types';

export const propertyService = {
  async getProperties() {
    const { data, error } = await supabase
      .from('properties')
      .select('*');
    if (error) throw error;
    return data;
  },

  async createProperty(property: Omit<Property, 'id'>) {
    const { data, error } = await supabase
      .from('properties')
      .insert(property)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateProperty(id: string, property: Partial<Property>) {
    const { data, error } = await supabase
      .from('properties')
      .update(property)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getSeats(propertyId: string) {
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('property_id', propertyId);
    if (error) throw error;
    return data;
  },

  async updateSeat(id: string, seat: Partial<Seat>) {
    const { data, error } = await supabase
      .from('seats')
      .update(seat)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getBookingRules(propertyId: string) {
    const { data, error } = await supabase
      .from('booking_rules')
      .select('*')
      .eq('property_id', propertyId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateBookingRules(propertyId: string, rules: Partial<BookingRule>) {
    const { data, error } = await supabase
      .from('booking_rules')
      .update(rules)
      .eq('property_id', propertyId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};