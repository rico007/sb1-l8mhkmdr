/*
  # Fix test account and properties setup

  1. Changes
    - Creates test user if not exists using proper unique constraints
    - Associates properties with test user
    - Adds sample properties if none exist
*/

DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get or create test user
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com';

  IF test_user_id IS NULL THEN
    -- Create new test user with a specific UUID
    test_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      test_user_id,
      'test@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated',
      'authenticated'
    );

    -- Create identity for the test user
    INSERT INTO auth.identities (
      id,
      user_id,
      provider,
      identity_data,
      created_at,
      updated_at
    ) VALUES (
      test_user_id,
      test_user_id,
      'email',
      jsonb_build_object('sub', test_user_id, 'email', 'test@example.com'),
      now(),
      now()
    );
  END IF;

  -- Create sample properties if none exist for this user
  IF NOT EXISTS (SELECT 1 FROM properties WHERE admin_id = test_user_id) THEN
    INSERT INTO properties (
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
    ) VALUES 
    (
      test_user_id,
      'Downtown Office Hub',
      'Modern office space in the heart of downtown',
      '123 Business Ave',
      'San Francisco',
      'USA',
      '94105',
      ARRAY['wifi', 'parking', 'meeting_rooms'],
      35,
      280,
      4200,
      ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c']
    ),
    (
      test_user_id,
      'Tech Campus',
      'Innovative workspace for tech teams',
      '456 Innovation Way',
      'San Francisco',
      'USA',
      '94107',
      ARRAY['wifi', 'parking', 'meeting_rooms', 'game_room'],
      45,
      360,
      5400,
      ARRAY['https://images.unsplash.com/photo-1497366412874-3415097a27e7']
    ),
    (
      test_user_id,
      'Creative Studio',
      'Boutique workspace for creatives',
      '789 Design Street',
      'San Francisco',
      'USA',
      '94110',
      ARRAY['wifi', 'photo_studio', 'meeting_rooms'],
      30,
      240,
      3600,
      ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72']
    );
  END IF;
END $$;