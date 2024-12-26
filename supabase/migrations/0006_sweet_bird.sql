/*
  # Add sample properties

  1. New Data
    - Adds three sample properties with different characteristics
    - Links properties to the authenticated user
    - Includes analytics data for each property

  2. Changes
    - Adds sample properties only if they don't exist
    - Associates properties with the current user
*/

CREATE OR REPLACE FUNCTION insert_sample_properties()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
  property_id uuid;
BEGIN
  -- Get the authenticated user's ID
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Downtown Office Hub
    INSERT INTO properties (
      admin_id, name, description, street, city, country, postal_code,
      amenities, hourly_rate, daily_rate, monthly_rate, photos
    ) VALUES (
      admin_user_id,
      'Downtown Office Hub',
      'Modern office space in the heart of downtown with panoramic city views',
      '123 Business Ave',
      'San Francisco',
      'USA',
      '94105',
      ARRAY['wifi', 'parking', 'meeting_rooms', 'kitchen', 'gym'],
      35,
      280,
      4200,
      ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c']
    ) RETURNING id INTO property_id;

    -- Add analytics for this property
    PERFORM create_property_analytics(property_id);

    -- Tech Campus
    INSERT INTO properties (
      admin_id, name, description, street, city, country, postal_code,
      amenities, hourly_rate, daily_rate, monthly_rate, photos
    ) VALUES (
      admin_user_id,
      'Tech Campus',
      'Innovative workspace designed for tech startups and creative teams',
      '456 Innovation Way',
      'San Francisco',
      'USA',
      '94107',
      ARRAY['wifi', 'parking', 'meeting_rooms', 'game_room', 'event_space'],
      45,
      360,
      5400,
      ARRAY['https://images.unsplash.com/photo-1497366412874-3415097a27e7']
    ) RETURNING id INTO property_id;

    -- Add analytics for this property
    PERFORM create_property_analytics(property_id);

    -- Creative Studio
    INSERT INTO properties (
      admin_id, name, description, street, city, country, postal_code,
      amenities, hourly_rate, daily_rate, monthly_rate, photos
    ) VALUES (
      admin_user_id,
      'Creative Studio',
      'Boutique workspace perfect for creative professionals and small teams',
      '789 Design Street',
      'San Francisco',
      'USA',
      '94110',
      ARRAY['wifi', 'photo_studio', 'meeting_rooms', 'lounge', 'rooftop'],
      30,
      240,
      3600,
      ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72']
    ) RETURNING id INTO property_id;

    -- Add analytics for this property
    PERFORM create_property_analytics(property_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Helper function to create analytics data for a property
CREATE OR REPLACE FUNCTION create_property_analytics(property_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert occupancy data
  INSERT INTO analytics_occupancy (property_id, date, rate)
  SELECT 
    property_id,
    current_date - (n || ' days')::interval,
    60 + random() * 40
  FROM generate_series(0, 6) n;

  -- Insert revenue data
  INSERT INTO analytics_revenue (
    property_id, monthly, monthly_trend, weekly, weekly_trend, daily, daily_trend
  ) VALUES (
    property_id,
    35000 + random() * 20000,
    2 + random() * 8,
    8000 + random() * 5000,
    1 + random() * 5,
    1500 + random() * 1000,
    0.5 + random() * 3
  );

  -- Insert popular spaces data
  INSERT INTO analytics_popular_spaces (property_id, name, type, utilization, revenue)
  VALUES
    (property_id, 'Meeting Room A', 'meeting_room', 75 + random() * 25, 2800 + random() * 1000),
    (property_id, 'Premium Desk 1', 'premium', 70 + random() * 25, 2400 + random() * 800),
    (property_id, 'Open Space Zone', 'regular', 85 + random() * 15, 4000 + random() * 1200);
END;
$$ LANGUAGE plpgsql;

-- Execute the function to insert sample properties
SELECT insert_sample_properties();