-- ============================================
-- STEP 3: Create Project Images Table
-- ============================================
-- This table stores multiple images for each project
-- Each project can have many images (one-to-many relationship)

CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_thumbnail BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_display_order ON project_images(display_order);

-- Add table comment for documentation
COMMENT ON TABLE project_images IS 'Multiple images for each project';
COMMENT ON COLUMN project_images.project_id IS 'Foreign key linking to projects table';
COMMENT ON COLUMN project_images.is_thumbnail IS 'Marks the main thumbnail image for the project';
COMMENT ON COLUMN project_images.display_order IS 'Order in which images appear in gallery';
