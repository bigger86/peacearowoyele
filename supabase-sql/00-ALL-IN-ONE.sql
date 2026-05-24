-- ============================================
-- COMPLETE DATABASE SETUP - ALL IN ONE
-- ============================================
-- Run this entire file if you want to set up everything at once
-- OR run the individual numbered files one by one

-- ============================================
-- 1. Enable UUID Extension
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Create Projects Table
-- ============================================
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

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_slug ON projects(slug);

COMMENT ON TABLE projects IS 'Main portfolio projects table';

-- ============================================
-- 3. Create Project Images Table
-- ============================================
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

CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_display_order ON project_images(display_order);

COMMENT ON TABLE project_images IS 'Multiple images for each project';

-- ============================================
-- 4. Create Tags Tables (OPTIONAL)
-- ============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON project_tags(tag_id);

-- ============================================
-- 5. Create Testimonials Table (OPTIONAL)
-- ============================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  testimonial_text TEXT NOT NULL,
  client_photo_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_testimonials_active ON testimonials(is_active);
CREATE INDEX idx_testimonials_display_order ON testimonials(display_order);

-- ============================================
-- 6. Create Auto-Update Trigger
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 7. Enable Row Level Security
-- ============================================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 8. Create Public Read Policies
-- ============================================
CREATE POLICY "Anyone can view published projects"
ON projects FOR SELECT
USING (status = 'published');

CREATE POLICY "Anyone can view project images"
ON project_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_images.project_id 
    AND projects.status = 'published'
  )
);

CREATE POLICY "Anyone can view tags"
ON tags FOR SELECT
USING (true);

CREATE POLICY "Anyone can view project tags"
ON project_tags FOR SELECT
USING (true);

CREATE POLICY "Anyone can view active testimonials"
ON testimonials FOR SELECT
USING (is_active = true);

-- ============================================
-- 9. Create Admin Policies
-- ============================================
CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project images"
ON project_images FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage tags"
ON tags FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project tags"
ON project_tags FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage testimonials"
ON testimonials FOR ALL
USING (auth.role() = 'authenticated');

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- You can now:
-- 1. Add projects through the admin panel
-- 2. View published projects on your website
-- 3. Manage content when authenticated
