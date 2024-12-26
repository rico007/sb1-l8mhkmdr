/*
  # Fix booking rules

  1. Changes
    - Add unique constraint on property_id in booking_rules table
    - Add function to ensure booking rules exist for each property
    - Create trigger to automatically create booking rules for new properties
    - Insert default booking rules for existing properties

  2. Security
    - Maintains existing RLS policies
*/

-- First add unique constraint on property_id
ALTER TABLE booking_rules
ADD CONSTRAINT booking_rules_property_id_key UNIQUE (property_id);

-- Function to create default booking rules
CREATE OR REPLACE FUNCTION create_default_booking_rules(property_id_param uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO booking_rules (
    property_id,
    min_duration_hours,
    max_duration_hours,
    advance_notice_hours,
    cancellation_policy
  ) VALUES (
    property_id_param,
    1,  -- Default minimum duration: 1 hour
    24, -- Default maximum duration: 24 hours
    24, -- Default advance notice: 24 hours
    'flexible'
  )
  ON CONFLICT (property_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to create booking rules when a new property is created
CREATE OR REPLACE FUNCTION create_booking_rules_for_new_property()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM create_default_booking_rules(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on properties table
DROP TRIGGER IF EXISTS ensure_booking_rules_exist ON properties;
CREATE TRIGGER ensure_booking_rules_exist
  AFTER INSERT ON properties
  FOR EACH ROW
  EXECUTE FUNCTION create_booking_rules_for_new_property();

-- Create default booking rules for existing properties
DO $$
DECLARE
  property_record RECORD;
BEGIN
  FOR property_record IN SELECT id FROM properties LOOP
    PERFORM create_default_booking_rules(property_record.id);
  END LOOP;
END $$;