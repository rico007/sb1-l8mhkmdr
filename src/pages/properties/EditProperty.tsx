import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PropertyForm from '../../components/property/PropertyForm';
import SeatManagement from '../../components/seat/SeatManagement';
import BookingRules from '../../components/booking/BookingRules';
import { useProperty } from '../../hooks/useProperty';
import { Property } from '../../types';
import { Tabs } from '../../components/ui/Tabs';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, updateProperty } = useProperty(id!);
  const [activeTab, setActiveTab] = useState('details');

  const handleSubmit = async (data: Partial<Property>) => {
    try {
      await updateProperty(data);
      navigate('/properties');
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleCancel = () => {
    navigate('/properties');
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Property Details' },
    { id: 'seats', label: 'Seat Management' },
    { id: 'rules', label: 'Booking Rules' },
  ];

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
        <h1 className="text-2xl font-semibold text-gray-900 mt-2">Edit Property</h1>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'details' && (
          <PropertyForm 
            onSubmit={handleSubmit} 
            onCancel={handleCancel}
            initialData={property}
          />
        )}
        {activeTab === 'seats' && property && (
          <SeatManagement propertyId={property.id} />
        )}
        {activeTab === 'rules' && property && (
          <BookingRules propertyId={property.id} />
        )}
      </div>
    </div>
  );
};

export default EditProperty;