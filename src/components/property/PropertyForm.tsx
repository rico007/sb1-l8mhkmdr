import React from 'react';
import { Property } from '../../types';
import BasicInformation from './form-sections/BasicInformation';
import LocationSection from './form-sections/LocationSection';
import PricingSection from './form-sections/PricingSection';
import AmenitiesSection from './form-sections/AmenitiesSection';
import PhotosSection from './form-sections/PhotosSection';

interface PropertyFormProps {
  onSubmit: (data: Partial<Property>) => void;
  onCancel?: () => void;
  initialData?: Partial<Property>;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, onCancel, initialData = {} }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      address: {
        street: formData.get('address.street') as string,
        city: formData.get('address.city') as string,
        country: formData.get('address.country') as string,
        postalCode: formData.get('address.postalCode') as string,
      },
      pricing: {
        hourly: Number(formData.get('pricing.hourly')),
        daily: Number(formData.get('pricing.daily')),
        monthly: Number(formData.get('pricing.monthly')),
      },
      amenities: formData.getAll('amenities') as string[],
      photos: [formData.get('photos') as string].filter(Boolean),
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <BasicInformation initialData={initialData} />
      <LocationSection initialData={initialData.address} />
      <PricingSection initialData={initialData.pricing} />
      <AmenitiesSection initialData={initialData.amenities} />
      <PhotosSection initialData={initialData.photos} />

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default PropertyForm;