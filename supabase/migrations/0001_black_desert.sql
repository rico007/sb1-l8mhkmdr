/*
  # Initial Schema Setup for Office Space Management

  1. New Tables
    - `properties`
      - Core property information
      - Location details
      - Pricing and amenities
    - `seats`
      - Individual seat/space information
      - Position data for mapping
      - Availability status
    - `booking_rules`
      - Property-specific booking configurations
      - Duration limits and restrictions

  2. Security
    - Enable RLS on all tables
    - Add policies for property admins
*/

-- Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  description text,
  street text NOT NULL,
  city text NOT NULL,
  country text NOT NULL,
  postal_code text NOT NULL,
  amenities text[] DEFAULT '{}',
  hourly_rate decimal NOT NULL,
  daily_rate decimal NOT NULL,
  monthly_rate decimal NOT NULL,
  photos text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Seats Table
CREATE TABLE IF NOT EXISTS seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('regular', 'premium', 'meeting_room')),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'blocked')),
  position_x decimal NOT NULL,
  position_y decimal NOT NULL,
  hourly_rate decimal NOT NULL,
  daily_rate decimal NOT NULL,
  monthly_rate decimal NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Booking Rules Table
CREATE TABLE IF NOT EXISTS booking_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  min_duration_hours int NOT NULL DEFAULT 1,
  max_duration_hours int NOT NULL DEFAULT 24,
  advance_notice_hours int NOT NULL DEFAULT 24,
  cancellation_policy text NOT NULL DEFAULT 'flexible',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can manage seats in their properties"
  ON seats
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT id FROM properties WHERE admin_id = auth.uid()
  ));

CREATE POLICY "Admins can manage booking rules for their properties"
  ON booking_rules
  FOR ALL
  TO authenticated
  USING (property_id IN (
    SELECT id FROM properties WHERE admin_id = auth.uid()
  ));