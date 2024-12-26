/*
  # Analytics Tables Setup

  1. New Tables
    - analytics_occupancy: Tracks daily occupancy rates
    - analytics_revenue: Stores revenue metrics
    - analytics_popular_spaces: Records space utilization

  2. Security
    - Enable RLS on all tables
    - Add policies for property admins to view their analytics
*/

-- Occupancy Analytics
CREATE TABLE IF NOT EXISTS analytics_occupancy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  date date NOT NULL,
  rate decimal NOT NULL CHECK (rate >= 0 AND rate <= 100),
  created_at timestamptz DEFAULT now()
);

-- Revenue Analytics
CREATE TABLE IF NOT EXISTS analytics_revenue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  monthly decimal NOT NULL DEFAULT 0,
  monthly_trend decimal NOT NULL DEFAULT 0,
  weekly decimal NOT NULL DEFAULT 0,
  weekly_trend decimal NOT NULL DEFAULT 0,
  daily decimal NOT NULL DEFAULT 0,
  daily_trend decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Popular Spaces Analytics
CREATE TABLE IF NOT EXISTS analytics_popular_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  utilization decimal NOT NULL CHECK (utilization >= 0 AND utilization <= 100),
  revenue decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_popular_spaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Property admins can view occupancy analytics"
  ON analytics_occupancy
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "Property admins can view revenue analytics"
  ON analytics_revenue
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE admin_id = auth.uid()
    )
  );

CREATE POLICY "Property admins can view popular spaces analytics"
  ON analytics_popular_spaces
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE admin_id = auth.uid()
    )
  );

-- Insert sample data for testing
DO $$
DECLARE
  property_uuid uuid;
BEGIN
  -- Get the first property ID or create a new one if none exists
  SELECT id INTO property_uuid FROM properties LIMIT 1;
  
  IF property_uuid IS NULL THEN
    INSERT INTO properties (name, description, street, city, country, postal_code, hourly_rate, daily_rate, monthly_rate)
    VALUES ('Sample Property', 'Test property', '123 Test St', 'Test City', 'Test Country', '12345', 25, 200, 3800)
    RETURNING id INTO property_uuid;
  END IF;

  -- Insert occupancy data
  INSERT INTO analytics_occupancy (property_id, date, rate)
  SELECT 
    property_uuid,
    current_date - (n || ' days')::interval,
    random() * 100
  FROM generate_series(0, 6) n;

  -- Insert revenue data
  INSERT INTO analytics_revenue (
    property_id, monthly, monthly_trend, weekly, weekly_trend, daily, daily_trend
  ) VALUES (
    property_uuid,
    45000,
    5.4,
    12000,
    3.2,
    2000,
    1.8
  );

  -- Insert popular spaces data
  INSERT INTO analytics_popular_spaces (property_id, name, type, utilization, revenue)
  VALUES
    (property_uuid, 'Meeting Room A', 'meeting_room', 85, 3200),
    (property_uuid, 'Premium Desk 1', 'premium', 78, 2800),
    (property_uuid, 'Open Space Zone', 'regular', 92, 4500),
    (property_uuid, 'Meeting Room B', 'meeting_room', 72, 2900),
    (property_uuid, 'Premium Desk 2', 'premium', 68, 2400);
END $$;