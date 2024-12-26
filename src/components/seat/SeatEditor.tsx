import React from 'react';
import { Seat } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface SeatEditorProps {
  seat: Seat | null;
  onUpdate: (seat: Partial<Seat>) => void;
  onCancel: () => void;
}

const SeatEditor: React.FC<SeatEditorProps> = ({ seat, onUpdate, onCancel }) => {
  if (!seat) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500 text-center">Select a seat to edit</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Position</label>
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div>
            <label className="block text-xs text-gray-500">X Position (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={seat.position.x}
              onChange={(e) => onUpdate({
                ...seat,
                position: { ...seat.position, x: Number(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Y Position (%)</label>
            <input
              type="number"
              min="0"
              max="100"
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

      <div>
        <label className="block text-sm font-medium text-gray-700">Pricing</label>
        <div className="grid grid-cols-3 gap-4 mt-1">
          <div>
            <label className="block text-xs text-gray-500">Hourly</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={seat.price.hourly}
              onChange={(e) => onUpdate({
                ...seat,
                price: { ...seat.price, hourly: Number(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Daily</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={seat.price.daily}
              onChange={(e) => onUpdate({
                ...seat,
                price: { ...seat.price, daily: Number(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500">Monthly</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={seat.price.monthly}
              onChange={(e) => onUpdate({
                ...seat,
                price: { ...seat.price, monthly: Number(e.target.value) }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={() => onUpdate(seat)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default SeatEditor;