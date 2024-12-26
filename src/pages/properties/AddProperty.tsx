import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PropertyForm from '../../components/property/PropertyForm';
import { Property } from '../../types';
import { useProperties } from '../../hooks/useProperties';

const AddProperty = () => {
  const navigate = useNavigate();
  const { createProperty } = useProperties();

  const handleSubmit = async (data: Partial<Property>) => {
    try {
      await createProperty(data);
      navigate('/properties');
    } catch (error) {
      console.error('Error creating property:', error);
    }
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          to="/properties"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Properties
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Add New Property</h1>
      </div>

      <PropertyForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default AddProperty;