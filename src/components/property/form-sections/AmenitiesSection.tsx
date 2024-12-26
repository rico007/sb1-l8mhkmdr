import React from 'react';
import { Wifi, Car, Users } from 'lucide-react';

interface AmenitiesSectionProps {
  initialData?: string[];
}

const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ initialData = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Amenities</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="amenities"
            value="wifi"
            defaultChecked={initialData.includes('wifi')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <Wifi className="h-5 w-5 text-gray-400 mx-2" />
          <label className="text-sm text-gray-700">Wi-Fi</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="amenities"
            value="parking"
            defaultChecked={initialData.includes('parking')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <Car className="h-5 w-5 text-gray-400 mx-2" />
          <label className="text-sm text-gray-700">Parking</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="amenities"
            value="meeting_rooms"
            defaultChecked={initialData.includes('meeting_rooms')}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <Users className="h-5 w-5 text-gray-400 mx-2" />
          <label className="text-sm text-gray-700">Meeting Rooms</label>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesSection;