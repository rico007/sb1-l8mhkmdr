import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Seat } from '../types';

export function useSeats(propertyId: string) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadSeats();
  }, [propertyId]);

  async function loadSeats() {
    try {
      const { data, error } = await supabase
        .from('seats')
        .select('*')
        .eq('property_id', propertyId);

      if (error) throw error;

      setSeats(data.map(seat => ({
        id: seat.id,
        propertyId: seat.property_id,
        name: seat.name,
        type: seat.type,
        status: seat.status,
        position: {
          x: seat.position_x,
          y: seat.position_y
        },
        price: {
          hourly: seat.hourly_rate,
          daily: seat.daily_rate,
          monthly: seat.monthly_rate
        }
      })));
    } catch (err) {
      console.error('Error loading seats:', err);
      setError(err instanceof Error ? err : new Error('Failed to load seats'));
    } finally {
      setLoading(false);
    }
  }

  async function createSeat(seat: Partial<Seat>) {
    try {
      const { data, error } = await supabase
        .from('seats')
        .insert({
          property_id: propertyId,
          name: seat.name,
          type: seat.type,
          status: seat.status,
          position_x: seat.position?.x,
          position_y: seat.position?.y,
          hourly_rate: seat.price?.hourly,
          daily_rate: seat.price?.daily,
          monthly_rate: seat.price?.monthly
        })
        .select()
        .single();

      if (error) throw error;

      const newSeat: Seat = {
        id: data.id,
        propertyId: data.property_id,
        name: data.name,
        type: data.type,
        status: data.status,
        position: {
          x: data.position_x,
          y: data.position_y
        },
        price: {
          hourly: data.hourly_rate,
          daily: data.daily_rate,
          monthly: data.monthly_rate
        }
      };

      setSeats([...seats, newSeat]);
      return newSeat;
    } catch (err) {
      console.error('Error creating seat:', err);
      throw err;
    }
  }

  async function updateSeat(id: string, updates: Partial<Seat>) {
    try {
      const { error } = await supabase
        .from('seats')
        .update({
          name: updates.name,
          type: updates.type,
          status: updates.status,
          position_x: updates.position?.x,
          position_y: updates.position?.y,
          hourly_rate: updates.price?.hourly,
          daily_rate: updates.price?.daily,
          monthly_rate: updates.price?.monthly
        })
        .eq('id', id);

      if (error) throw error;

      await loadSeats(); // Reload seats to get updated data
    } catch (err) {
      console.error('Error updating seat:', err);
      throw err;
    }
  }

  return {
    seats,
    loading,
    error,
    createSeat,
    updateSeat,
    refreshSeats: loadSeats
  };
}