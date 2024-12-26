/*
  # Update property ownership

  1. Changes
    - Update all properties to be owned by cafrster@googlemail.com
    - Handles the case where properties might have no owner
*/

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get the user ID for cafrster@googlemail.com
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = 'cafrster@googlemail.com';

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email cafrster@googlemail.com not found';
  END IF;

  -- Update all properties to be owned by the target user
  UPDATE properties 
  SET admin_id = target_user_id;
END $$;