import React, { useState } from 'react';
import { useSeats } from '../../hooks/useSeats';
import SeatMap from './SeatMap';
import SeatEditor from './SeatEditor';
import { Seat } from '../../types';

interface SeatManagementProps {
  propertyId: string;
}

const SeatManagement: React.FC<SeatManagementProps> = ({ propertyId }) => {
  const { seats, createSeat, updateSeat, loading } = useSeats(propertyId);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  const handleSeatCreate = async () => {
    const newSeat = await createSeat({
      name: 'New Seat',
      type: 'regular',
      status: 'available',
      position: { x: 50, y: 50 },
      price: { hourly: 0, daily: 0, monthly: 0 }
    });
    setSelectedSeat(newSeat);
  };

  const handleSeatUpdate = async (updatedSeat: Partial<Seat>) => {
    if (selectedSeat) {
      await updateSeat(selectedSeat.id, updatedSeat);
      setSelectedSeat(null);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Seat Management</h2>
        <button
          onClick={handleSeatCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Seat
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SeatMap 
            seats={seats}
            onSeatClick={setSelectedSeat}
            selectedSeat={selectedSeat}
          />
        </div>
        <div>
          <SeatEditor
            seat={selectedSeat}
            onUpdate={handleSeatUpdate}
            onCancel={() => setSelectedSeat(null)}
          />
        </div>
      </div>
    </div>
  );
};

export default SeatManagement;