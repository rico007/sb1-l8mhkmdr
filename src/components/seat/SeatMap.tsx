import React from 'react';
import { Seat } from '../../types';

interface SeatMapProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  selectedSeat: Seat | null;
}

const SeatMap: React.FC<SeatMapProps> = ({ seats, onSeatClick, selectedSeat }) => {
  const getSeatColor = (seat: Seat) => {
    if (selectedSeat?.id === seat.id) {
      return 'bg-indigo-200 hover:bg-indigo-300';
    }
    
    switch (seat.status) {
      case 'available':
        return 'bg-green-100 hover:bg-green-200';
      case 'reserved':
        return 'bg-red-100 hover:bg-red-200';
      case 'blocked':
        return 'bg-gray-200 hover:bg-gray-300';
      default:
        return 'bg-gray-100 hover:bg-gray-200';
    }
  };

  const getSeatSize = (type: Seat['type']) => {
    switch (type) {
      case 'meeting_room':
        return 'w-24 h-24';
      case 'premium':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <div className="relative w-full h-[600px] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-0">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-gray-100" />
        ))}
      </div>

      {/* Seats */}
      {seats.map((seat) => (
        <div
          key={seat.id}
          onClick={() => onSeatClick(seat)}
          className={`
            absolute cursor-pointer rounded-md shadow-sm transition-all
            flex flex-col items-center justify-center p-2
            transform -translate-x-1/2 -translate-y-1/2
            ${getSeatColor(seat)}
            ${getSeatSize(seat.type)}
          `}
          style={{
            left: `${seat.position.x}%`,
            top: `${seat.position.y}%`,
          }}
        >
          <span className="text-xs font-medium truncate max-w-full">
            {seat.name}
          </span>
          {seat.type === 'meeting_room' && (
            <span className="text-xs text-gray-500 mt-1">
              Meeting Room
            </span>
          )}
          {seat.type === 'premium' && (
            <span className="text-xs text-gray-500">
              Premium
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default SeatMap;