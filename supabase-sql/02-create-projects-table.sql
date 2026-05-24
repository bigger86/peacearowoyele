-- ============================================
-- STEP 2: Create Projects Table
-- ============================================
-- This is the main table for storing portfolio projects

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  client_name TEXT,
  project_type TEXT,
  year INTEGER,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Add table comment for documentation
COMMENT ON TABLE projects IS 'Main portfolio projects table';
COMMENT ON COLUMN projects.slug IS 'URL-friendly unique identifier';
COMMENT ON COLUMN projects.status IS 'Project visibility: draft, published, or archived';
COMMENT ON COLUMN projects.display_order IS 'Order in which projects appear (lower numbers first)';
