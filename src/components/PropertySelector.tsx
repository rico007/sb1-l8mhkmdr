import React from 'react';
import { useProperties } from '../hooks/useProperties';

interface PropertySelectorProps {
  value: string | null;
  onChange: (id: string) => void;
}

const PropertySelector: React.FC<PropertySelectorProps> = ({ value, onChange }) => {
  const { properties, loading, error } = useProperties();

  if (loading) {
    return <div className="animate-pulse h-8 w-48 bg-gray-100 rounded"></div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Failed to load properties</div>;
  }

  if (properties.length === 0) {
    return <div className="text-gray-500 text-sm">No properties available</div>;
  }

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
      <option value="">Select a property</option>
      {properties.map((property) => (
        <option key={property.id} value={property.id}>
          {property.name}
        </option>
      ))}
    </select>
  );
};

export default PropertySelector;