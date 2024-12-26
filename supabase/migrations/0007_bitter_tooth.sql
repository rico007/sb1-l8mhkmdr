/*
  # Set up test user account

  1. Changes
    - Creates test user if not exists
    - Updates password if user exists
    - Associates existing properties with test user
*/

DO $$
DECLARE
  test_user_id uuid;
BEGIN
  -- Get or create test user
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com';

  IF test_user_id IS NULL THEN
    -- Create new test user
    INSERT INTO auth.users (
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role
    ) VALUES (
      'test@example.com',
      crypt('password123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now(),
      'authenticated'
    )
    RETURNING id INTO test_user_id;
  ELSE
    -- Update existing test user's password
    UPDATE auth.users
    SET 
      encrypted_password = crypt('password123', gen_salt('bf')),
      email_confirmed_at = now(),
      updated_at = now()
    WHERE id = test_user_id;
  END IF;

  -- Update existing properties to associate with test user
  UPDATE properties
  SET admin_id = test_user_id
  WHERE admin_id IS NULL OR admin_id NOT IN (SELECT id FROM auth.users);
END $$;