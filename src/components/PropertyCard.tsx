import React from 'react';
import { Building2, MapPin, Wifi, Car, Users } from 'lucide-react';
import { Property } from '../types';
import { formatCurrency } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  onClick: (id: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
      onClick={() => onClick(property.id)}
    >
      <img
        className="h-48 w-full object-cover"
        src={property.photos[0]}
        alt={property.name}
      />
      <div className="p-6">
        <div className="flex items-center">
          <Building2 className="h-5 w-5 text-indigo-600" />
          <h3 className="ml-2 text-lg font-semibold text-gray-900">{property.name}</h3>
        </div>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4" />
          <span className="ml-1">
            {property.address.street}, {property.address.city}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex items-center space-x-4">
            {property.amenities.includes('wifi') && (
              <Wifi className="h-4 w-4 text-gray-400" />
            )}
            {property.amenities.includes('parking') && (
              <Car className="h-4 w-4 text-gray-400" />
            )}
            {property.amenities.includes('meeting_rooms') && (
              <Users className="h-4 w-4 text-gray-400" />
            )}
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">Starting from</div>
          <div className="text-lg font-semibold text-indigo-600">
            {formatCurrency(property.pricing.hourly)}/hr
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;