import React from 'react';
import { Image } from 'lucide-react';

interface PhotosSectionProps {
  initialData?: string[];
}

const PhotosSection: React.FC<PhotosSectionProps> = ({ initialData = [] }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <Image className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Photos</h3>
      </div>
      <div className="mt-2">
        <input
          type="url"
          name="photos"
          defaultValue={initialData[0] || ''}
          placeholder="Enter photo URL"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>
    </div>
  );
};

export default PhotosSection;