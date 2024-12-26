/*
  # Create test user with proper authentication setup

  1. Changes
    - Create test user with email test@example.com
    - Set up proper authentication with email provider
    - Handle existing user cleanup safely
    - Create sample properties for the test user
    - Remove confirmed_at from INSERT as it's a generated column
*/

DO $$
DECLARE
  test_user_id uuid := gen_random_uuid();
  old_user_id uuid;
BEGIN
  -- Get existing test user id if exists
  SELECT id INTO old_user_id FROM auth.users WHERE email = 'test@example.com';
  
  -- First update any properties referencing the old user
  IF old_user_id IS NOT NULL THEN
    -- Temporarily set admin_id to NULL for affected properties
    UPDATE properties SET admin_id = NULL WHERE admin_id = old_user_id;
    -- Now safe to delete the old user
    DELETE FROM auth.identities WHERE user_id = old_user_id;
    DELETE FROM auth.users WHERE id = old_user_id;
  END IF;

  -- Create new test user
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
    provider_id,
    provider,
    identity_data,
    last_sign_in_at,
    created_at,
    updated_at
  ) VALUES (
    test_user_id,
    test_user_id,
    'test@example.com',
    'email',
    jsonb_build_object(
      'sub', test_user_id,
      'email', 'test@example.com'
    ),
    now(),
    now(),
    now()
  );

  -- Update any existing properties to use the new user id
  UPDATE properties SET admin_id = test_user_id WHERE admin_id IS NULL;

  -- Create sample property if none exist
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
    ) VALUES (
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
    );
  END IF;
END $$;