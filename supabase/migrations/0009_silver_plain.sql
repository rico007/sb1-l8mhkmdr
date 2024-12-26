/*
  # Fix authentication setup with proper provider_id handling

  1. Changes
    - Add required provider_id field for auth.identities
    - Use email as provider_id for email provider
    - Handle foreign key constraints properly
*/

DO $$
DECLARE
  test_user_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
  instance_id uuid := '00000000-0000-0000-0000-000000000000'::uuid;
  old_user_id uuid;
BEGIN
  -- Get existing test user id if exists
  SELECT id INTO old_user_id FROM auth.users WHERE email = 'test@example.com';
  
  -- Update properties to remove reference to old test user
  IF old_user_id IS NOT NULL THEN
    UPDATE properties SET admin_id = NULL WHERE admin_id = old_user_id;
    -- Now safe to delete the old user
    DELETE FROM auth.identities WHERE user_id = old_user_id;
    DELETE FROM auth.users WHERE id = old_user_id;
  END IF;
  
  -- Create test user with all required fields
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin,
    created_at,
    updated_at,
    role,
    aud
  ) VALUES (
    test_user_id,
    instance_id,
    'test@example.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    false,
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
    'test@example.com',  -- Use email as provider_id for email provider
    'email',
    jsonb_build_object(
      'sub', test_user_id,
      'email', 'test@example.com'
    ),
    now(),
    now(),
    now()
  );

  -- Update properties to associate with new test user
  UPDATE properties SET admin_id = test_user_id WHERE admin_id IS NULL;
  
  -- Create sample properties if none exist
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
    );
  END IF;
END $$;