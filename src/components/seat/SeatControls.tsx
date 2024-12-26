import React from 'react';
import { Seat } from '../../types';

interface SeatControlsProps {
  seat: Seat | null;
  onUpdate: (seat: Partial<Seat>) => void;
}

const SeatControls: React.FC<SeatControlsProps> = ({ seat, onUpdate }) => {
  if (!seat) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-500 text-center">Select a seat to edit</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={seat.name}
          onChange={(e) => onUpdate({ ...seat, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={seat.type}
          onChange={(e) => onUpdate({ ...seat, type: e.target.value as Seat['type'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="regular">Regular</option>
          <option value="premium">Premium</option>
          <option value="meeting_room">Meeting Room</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          value={seat.status}
          onChange={(e) => onUpdate({ ...seat, status: e.target.value as Seat['status'] })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Position X (%)</label>
          <input
            type="number"
            value={seat.position.x}
            onChange={(e) => onUpdate({
              ...seat,
              position: { ...seat.position, x: Number(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Position Y (%)</label>
          <input
            type="number"
            value={seat.position.y}
            onChange={(e) => onUpdate({
              ...seat,
              position: { ...seat.position, y: Number(e.target.value) }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};