/*
  # Fix seat pricing and analytics schema

  1. Changes
    - Add proper pricing columns to seats table
    - Create analytics tables with proper structure
    - Add RLS policies for analytics tables
    - Add sample data for testing
*/

-- Update seats table to include proper pricing columns
ALTER TABLE seats
ADD COLUMN IF NOT EXISTS hourly_rate decimal NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS daily_rate decimal NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_rate decimal NOT NULL DEFAULT 0;

-- Create analytics tables
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  seat_id uuid REFERENCES seats(id) ON DELETE CASCADE,
  date date NOT NULL,
  occupancy_rate decimal NOT NULL DEFAULT 0,
  revenue decimal NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(property_id, seat_id, date)
);

-- Enable RLS
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view analytics for their properties"
  ON analytics_daily
  FOR SELECT
  TO authenticated
  USING (
    property_id IN (
      SELECT id FROM properties WHERE admin_id = auth.uid()
    )
  );

-- Function to generate sample analytics data
CREATE OR REPLACE FUNCTION generate_sample_analytics(p_property_id uuid)
RETURNS void AS $$
DECLARE
  v_seat record;
  v_date date;
BEGIN
  -- For each seat in the property
  FOR v_seat IN (
    SELECT id, hourly_rate, daily_rate, monthly_rate 
    FROM seats 
    WHERE property_id = p_property_id
  ) LOOP
    -- Generate data for the last 7 days
    FOR v_date IN (
      SELECT generate_series(
        current_date - interval '6 days',
        current_date,
        interval '1 day'
      )::date
    ) LOOP
      -- Insert daily analytics
      INSERT INTO analytics_daily (
        property_id,
        seat_id,
        date,
        occupancy_rate,
        revenue
      ) VALUES (
        p_property_id,
        v_seat.id,
        v_date,
        50 + random() * 50, -- Random occupancy between 50-100%
        v_seat.daily_rate * (0.5 + random() * 0.5) -- Random revenue based on daily rate
      )
      ON CONFLICT (property_id, seat_id, date) 
      DO UPDATE SET
        occupancy_rate = EXCLUDED.occupancy_rate,
        revenue = EXCLUDED.revenue;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Insert sample seats and generate analytics
DO $$
DECLARE
  v_property record;
BEGIN
  FOR v_property IN (SELECT id FROM properties) LOOP
    -- Create sample seats if none exist
    IF NOT EXISTS (SELECT 1 FROM seats WHERE property_id = v_property.id) THEN
      -- Meeting rooms
      INSERT INTO seats (
        property_id, name, type, status,
        position_x, position_y,
        hourly_rate, daily_rate, monthly_rate
      ) VALUES
      (v_property.id, 'Meeting Room A', 'meeting_room', 'available', 20, 20, 50, 400, 8000),
      (v_property.id, 'Meeting Room B', 'meeting_room', 'available', 20, 80, 45, 360, 7200);

      -- Premium desks
      INSERT INTO seats (
        property_id, name, type, status,
        position_x, position_y,
        hourly_rate, daily_rate, monthly_rate
      ) VALUES
      (v_property.id, 'Premium Desk 1', 'premium', 'available', 50, 20, 30, 240, 4800),
      (v_property.id, 'Premium Desk 2', 'premium', 'available', 50, 50, 30, 240, 4800),
      (v_property.id, 'Premium Desk 3', 'premium', 'reserved', 50, 80, 30, 240, 4800);

      -- Regular desks
      INSERT INTO seats (
        property_id, name, type, status,
        position_x, position_y,
        hourly_rate, daily_rate, monthly_rate
      ) VALUES
      (v_property.id, 'Desk 1', 'regular', 'available', 80, 20, 20, 160, 3200),
      (v_property.id, 'Desk 2', 'regular', 'reserved', 80, 50, 20, 160, 3200),
      (v_property.id, 'Desk 3', 'regular', 'available', 80, 80, 20, 160, 3200);
    END IF;

    -- Generate sample analytics data
    PERFORM generate_sample_analytics(v_property.id);
  END LOOP;
END $$;