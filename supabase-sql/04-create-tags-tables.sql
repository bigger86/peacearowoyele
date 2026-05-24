-- ============================================
-- STEP 4: Create Tags Tables (OPTIONAL)
-- ============================================
-- These tables allow you to categorize projects with tags
-- Example tags: "Logo Design", "Brand Identity", "Web Design"
-- You can skip this if you don't need tags

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for many-to-many relationship
-- (one project can have many tags, one tag can be on many projects)
CREATE TABLE project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

-- Add indexes
CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON project_tags(tag_id);

-- Add comments
COMMENT ON TABLE tags IS 'Tags for filtering and categorizing projects';
COMMENT ON TABLE project_tags IS 'Junction table linking projects to tags';
