/*
  # Add test user and property

  1. Changes
    - Create a test user with a proper UUID
    - Create a property for the test user with a proper UUID
*/

-- Create test user with a proper UUID
DO $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  test_property_id uuid := gen_random_uuid();
BEGIN
  -- Insert test user
  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    role
  ) VALUES (
    test_user_id,
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    now(),
    now(),
    'authenticated'
  ) ON CONFLICT (id) DO NOTHING;

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
    test_user_id,
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
  ) ON CONFLICT (id) DO NOTHING;
END $$;