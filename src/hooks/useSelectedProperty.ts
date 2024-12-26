import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useSelectedProperty() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFirstProperty() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id')
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setSelectedPropertyId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching first property:', error);
      } finally {
        setLoading(false);
      }
    }

    getFirstProperty();
  }, []);

  return {
    selectedPropertyId,
    setSelectedPropertyId,
    loading
  };
}