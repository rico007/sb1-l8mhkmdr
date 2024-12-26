import React from 'react';
import { Seat } from '../../types';

interface SeatGridProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
}

const SeatGrid: React.FC<SeatGridProps> = ({ seats, onSeatClick }) => {
  return (
    <div className="relative w-full h-[600px] bg-gray-50 border border-gray-200 rounded-lg">
      {seats.map((seat) => (
        <div
          key={seat.id}
          onClick={() => onSeatClick(seat)}
          className={`absolute cursor-pointer p-2 rounded-md ${
            seat.status === 'available'
              ? 'bg-green-100 hover:bg-green-200'
              : seat.status === 'reserved'
              ? 'bg-red-100'
              : 'bg-gray-100'
          }`}
          style={{
            left: `${seat.position.x}%`,
            top: `${seat.position.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <span className="text-xs font-medium">{seat.name}</span>
        </div>
      ))}
    </div>
  );
};