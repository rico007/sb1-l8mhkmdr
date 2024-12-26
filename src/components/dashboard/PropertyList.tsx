import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Property } from '../../types';
import { MapPin, Users } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface PropertyListProps {
  properties: Property[];
}

const PropertyList: React.FC<PropertyListProps> = ({ properties }) => {
  const navigate = useNavigate();

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-500 text-center">No properties found</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Properties Overview</h3>
      </div>
      <div className="border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {properties.map((property) => {
            // Ensure property has all required fields with fallbacks
            const address = property.address || { city: 'N/A', country: 'N/A' };
            const pricing = property.pricing || { monthly: 0 };
            const photos = property.photos || [];

            return (
              <li
                key={property.id}
                className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/properties/${property.id}/edit`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      className="h-12 w-12 rounded-lg object-cover"
                      src={photos[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c'}
                      alt={property.name}
                    />
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{property.name}</h4>
                      <div className="flex items-center mt-1">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="ml-1 text-sm text-gray-500">
                          {address.city}, {address.country}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span>85% Occupied</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-indigo-600">
                      {formatCurrency(pricing.monthly)}/mo
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PropertyList;