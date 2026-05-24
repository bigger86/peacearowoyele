-- ============================================
-- SIMPLE IMAGE GALLERY - Complete Setup
-- ============================================
-- This is a simplified version with just image management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create simple gallery table
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX idx_gallery_display_order ON gallery_images(display_order);

-- Enable Row Level Security
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view images (for public gallery)
CREATE POLICY "Anyone can view gallery images"
ON gallery_images FOR SELECT
USING (true);

-- Allow authenticated users to manage images (for admin)
CREATE POLICY "Authenticated users can manage gallery"
ON gallery_images FOR ALL
USING (auth.role() = 'authenticated');

-- Done! Now you have a simple gallery table
