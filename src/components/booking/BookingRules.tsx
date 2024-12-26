import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface BookingRulesProps {
  propertyId: string;
}

interface Rules {
  minDuration: number;
  maxDuration: number;
  advanceNotice: number;
  cancellationPolicy: string;
}

const BookingRules: React.FC<BookingRulesProps> = ({ propertyId }) => {
  const [rules, setRules] = useState<Rules>({
    minDuration: 1,
    maxDuration: 24,
    advanceNotice: 24,
    cancellationPolicy: 'flexible'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadRules();
  }, [propertyId]);

  const loadRules = async () => {
    try {
      const { data, error } = await supabase
        .from('booking_rules')
        .select('*')
        .eq('property_id', propertyId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error) throw error;

      if (data) {
        setRules({
          minDuration: data.min_duration_hours,
          maxDuration: data.max_duration_hours,
          advanceNotice: data.advance_notice_hours,
          cancellationPolicy: data.cancellation_policy
        });
      }
    } catch (error) {
      console.error('Error loading booking rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('booking_rules')
        .upsert({
          property_id: propertyId,
          min_duration_hours: rules.minDuration,
          max_duration_hours: rules.maxDuration,
          advance_notice_hours: rules.advanceNotice,
          cancellation_policy: rules.cancellationPolicy
        }, {
          onConflict: 'property_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving booking rules:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Booking Rules</h3>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Duration (hours)
            </label>
            <input
              type="number"
              min="1"
              value={rules.minDuration}
              onChange={(e) => setRules({ ...rules, minDuration: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Duration (hours)
            </label>
            <input
              type="number"
              min={rules.minDuration}
              value={rules.maxDuration}
              onChange={(e) => setRules({ ...rules, maxDuration: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Advance Notice (hours)
            </label>
            <input
              type="number"
              min="0"
              value={rules.advanceNotice}
              onChange={(e) => setRules({ ...rules, advanceNotice: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cancellation Policy
            </label>
            <select
              value={rules.cancellationPolicy}
              onChange={(e) => setRules({ ...rules, cancellationPolicy: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="flexible">Flexible</option>
              <option value="moderate">Moderate</option>
              <option value="strict">Strict</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Rules'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingRules;