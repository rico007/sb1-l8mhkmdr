import React from 'react';
import { Property } from '../../../types';

interface BasicInformationProps {
  initialData?: Partial<Property>;
}

const BasicInformation: React.FC<BasicInformationProps> = ({ initialData = {} }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">Property Name</label>
          <input
            type="text"
            name="name"
            defaultValue={initialData.name}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            defaultValue={initialData.description}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicInformation;