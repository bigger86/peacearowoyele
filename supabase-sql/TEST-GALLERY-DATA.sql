-- ============================================
-- TEST: Check Gallery Data
-- ============================================
-- Run this to see what's in your database

-- Check if table exists and has data
SELECT 
  id,
  title,
  image_url,
  display_order,
  created_at
FROM gallery_images
ORDER BY display_order;

-- This should show all your uploaded images
-- If you see results, the data is there!
-- If you see "no rows", the upload didn't save
