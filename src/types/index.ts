export interface Property {
  id: string;
  name: string;
  address: {
    street: string;
    city: string;
    country: string;
    postalCode: string;
  };
  amenities: string[];
  pricing: {
    hourly: number;
    daily: number;
    monthly: number;
  };
  photos: string[];
  description: string;
}

export interface Seat {
  id: string;
  propertyId: string;
  name: string;
  type: 'regular' | 'premium' | 'meeting_room';
  status: 'available' | 'reserved' | 'blocked';
  position: {
    x: number;
    y: number;
  };
  price: {
    hourly: number;
    daily: number;
    monthly: number;
  };
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  properties: string[]; // Property IDs
  businessDetails: {
    companyName: string;
    taxId: string;
    phone: string;
  };
}