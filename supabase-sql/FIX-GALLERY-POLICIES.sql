-- ============================================
-- FIX: Gallery Images Not Showing
-- ============================================
-- Run this if images aren't appearing on frontend

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view gallery images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can manage gallery" ON gallery_images;

-- Recreate policies with correct permissions
CREATE POLICY "Public can view all gallery images"
ON gallery_images FOR SELECT
TO public
USING (true);

CREATE POLICY "Authenticated users can insert gallery images"
ON gallery_images FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update gallery images"
ON gallery_images FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete gallery images"
ON gallery_images FOR DELETE
TO authenticated
USING (true);

-- Verify RLS is enabled
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
