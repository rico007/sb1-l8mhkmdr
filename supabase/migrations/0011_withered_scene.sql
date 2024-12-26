/*
  # Update foreign key constraint for properties table

  1. Changes
    - Modify the foreign key constraint on properties.admin_id
    - Set NULL when referenced user is deleted
    - This prevents orphaned records and allows safe user deletion
*/

-- Drop existing foreign key constraint
ALTER TABLE properties
DROP CONSTRAINT IF EXISTS properties_admin_id_fkey;

-- Add new foreign key constraint with ON DELETE SET NULL
ALTER TABLE properties
ADD CONSTRAINT properties_admin_id_fkey
FOREIGN KEY (admin_id)
REFERENCES auth.users(id)
ON DELETE SET NULL;