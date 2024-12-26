import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Property } from '../types';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error('Error in loadProperties:', err);
      setError(err instanceof Error ? err : new Error('Failed to load properties'));
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  async function createProperty(property: Partial<Property>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('properties')
        .insert({
          admin_id: user.id,
          name: property.name,
          description: property.description,
          street: property.address?.street,
          city: property.address?.city,
          country: property.address?.country,
          postal_code: property.address?.postalCode,
          hourly_rate: property.pricing?.hourly,
          daily_rate: property.pricing?.daily,
          monthly_rate: property.pricing?.monthly,
          amenities: property.amenities,
          photos: property.photos
        });

      if (error) throw error;

      await loadProperties(); // Reload the properties list
      return true;
    } catch (err) {
      console.error('Error creating property:', err);
      throw err;
    }
  }

  async function updateProperty(id: string, property: Partial<Property>) {
    try {
      const { error } = await supabase
        .from('properties')
        .update({
          name: property.name,
          description: property.description,
          street: property.address?.street,
          city: property.address?.city,
          country: property.address?.country,
          postal_code: property.address?.postalCode,
          hourly_rate: property.pricing?.hourly,
          daily_rate: property.pricing?.daily,
          monthly_rate: property.pricing?.monthly,
          amenities: property.amenities,
          photos: property.photos,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await loadProperties(); // Reload the properties list
      return true;
    } catch (err) {
      console.error('Error updating property:', err);
      throw err;
    }
  }

  return {
    properties,
    loading,
    error,
    createProperty,
    updateProperty,
    refreshProperties: loadProperties
  };
}