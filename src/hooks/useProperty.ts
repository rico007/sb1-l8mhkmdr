import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProperty();
  }, [id]);

  async function loadProperty() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setProperty({
          ...data,
          address: {
            street: data.street,
            city: data.city,
            country: data.country,
            postalCode: data.postal_code
          },
          pricing: {
            hourly: Number(data.hourly_rate),
            daily: Number(data.daily_rate),
            monthly: Number(data.monthly_rate)
          },
          photos: data.photos || [],
          amenities: data.amenities || []
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error loading property:', err);
      setError(err instanceof Error ? err : new Error('Failed to load property'));
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }

  async function updateProperty(updates: Partial<Property>) {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: updates.name,
          description: updates.description,
          street: updates.address?.street,
          city: updates.address?.city,
          country: updates.address?.country,
          postal_code: updates.address?.postalCode,
          hourly_rate: updates.pricing?.hourly,
          daily_rate: updates.pricing?.daily,
          monthly_rate: updates.pricing?.monthly,
          amenities: updates.amenities,
          photos: updates.photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      await loadProperty(); // Reload the property data
      return true;
    } catch (err) {
      console.error('Error updating property:', err);
      throw err;
    }
  }

  return {
    property,
    loading,
    error,
    updateProperty,
    refreshProperty: loadProperty
  };
}