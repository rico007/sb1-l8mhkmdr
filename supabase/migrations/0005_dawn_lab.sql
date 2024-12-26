/*
  # Fix test data setup
  
  1. Changes
    - Remove user creation (handled by Supabase Auth API)
    - Add test property with proper admin_id handling
*/

-- Function to safely get or create test property
CREATE OR REPLACE FUNCTION create_test_property()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
  test_property_id uuid := gen_random_uuid();
BEGIN
  -- Get the first authenticated user's ID
  SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert test property
    INSERT INTO properties (
      id,
      admin_id,
      name,
      description,
      street,
      city,
      country,
      postal_code,
      amenities,
      hourly_rate,
      daily_rate,
      monthly_rate,
      photos
    ) VALUES (
      test_property_id,
      admin_user_id,
      'Test Office Space',
      'A modern office space in downtown',
      '123 Business Ave',
      'San Francisco',
      'USA',
      '94105',
      ARRAY['wifi', 'parking', 'meeting_rooms'],
      25,
      200,
      3800,
      ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c']
    ) ON CONFLICT DO NOTHING;

    -- Insert analytics data only if property was created
    IF FOUND THEN
      -- Insert occupancy data
      INSERT INTO analytics_occupancy (property_id, date, rate)
      SELECT 
        test_property_id,
        current_date - (n || ' days')::interval,
        random() * 100
      FROM generate_series(0, 6) n;

      -- Insert revenue data
      INSERT INTO analytics_revenue (
        property_id, monthly, monthly_trend, weekly, weekly_trend, daily, daily_trend
      ) VALUES (
        test_property_id,
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
        (test_property_id, 'Meeting Room A', 'meeting_room', 85, 3200),
        (test_property_id, 'Premium Desk 1', 'premium', 78, 2800),
        (test_property_id, 'Open Space Zone', 'regular', 92, 4500),
        (test_property_id, 'Meeting Room B', 'meeting_room', 72, 2900),
        (test_property_id, 'Premium Desk 2', 'premium', 68, 2400);
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;