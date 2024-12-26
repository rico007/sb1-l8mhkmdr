import React from 'react';
import { DollarSign } from 'lucide-react';
import { Property } from '../../../types';

interface PricingSectionProps {
  initialData?: Property['pricing'];
}

const PricingSection: React.FC<PricingSectionProps> = ({ initialData = {} }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center mb-4">
        <DollarSign className="h-5 w-5 text-gray-400 mr-2" />
        <h3 className="text-lg font-medium text-gray-900">Pricing</h3>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Hourly Rate ($)</label>
          <input
            type="number"
            name="pricing.hourly"
            defaultValue={initialData.hourly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Daily Rate ($)</label>
          <input
            type="number"
            name="pricing.daily"
            defaultValue={initialData.daily}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Monthly Rate ($)</label>
          <input
            type="number"
            name="pricing.monthly"
            defaultValue={initialData.monthly}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PricingSection;