import React from 'react';
import { Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';

const Properties = () => {
  const { properties, loading, error } = useProperties();
  const navigate = useNavigate();

  const handlePropertyClick = (id: string) => {
    navigate(`/properties/${id}/edit`);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 h-96 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load properties: {error.message}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Properties</h1>
        <Link
          to="/properties/add"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No properties found. Add your first property to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                address: {
                  street: property.street,
                  city: property.city,
                  country: property.country,
                  postalCode: property.postal_code
                },
                pricing: {
                  hourly: Number(property.hourly_rate),
                  daily: Number(property.daily_rate),
                  monthly: Number(property.monthly_rate)
                },
                photos: property.photos || [],
                amenities: property.amenities || []
              }}
              onClick={handlePropertyClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties;