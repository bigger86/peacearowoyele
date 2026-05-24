-- ============================================
-- STEP 8: Create Public Read Policies
-- ============================================
-- These policies allow ANYONE to view published projects
-- (This is what makes your portfolio visible to visitors)

-- Allow anyone to view published projects
CREATE POLICY "Anyone can view published projects"
ON projects FOR SELECT
USING (status = 'published');

-- Allow anyone to view project images (only for published projects)
CREATE POLICY "Anyone can view project images"
ON project_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_images.project_id 
    AND projects.status = 'published'
  )
);

-- If you created tags tables, allow public read access
CREATE POLICY "Anyone can view tags"
ON tags FOR SELECT
USING (true);

CREATE POLICY "Anyone can view project tags"
ON project_tags FOR SELECT
USING (true);

-- If you created testimonials table, allow viewing active testimonials
CREATE POLICY "Anyone can view active testimonials"
ON testimonials FOR SELECT
USING (is_active = true);

-- Now your website visitors can see published projects!
