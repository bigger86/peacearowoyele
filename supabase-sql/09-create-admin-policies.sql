-- ============================================
-- STEP 9: Create Admin Policies
-- ============================================
-- These policies allow authenticated users (YOU) to manage content
-- You'll need to be logged in to add/edit/delete projects

-- Allow authenticated users to do EVERYTHING with projects
CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');

-- Allow authenticated users to do EVERYTHING with project images
CREATE POLICY "Authenticated users can manage project images"
ON project_images FOR ALL
USING (auth.role() = 'authenticated');

-- If you created tags tables, allow authenticated users to manage them
CREATE POLICY "Authenticated users can manage tags"
ON tags FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project tags"
ON project_tags FOR ALL
USING (auth.role() = 'authenticated');

-- If you created testimonials table, allow authenticated users to manage them
CREATE POLICY "Authenticated users can manage testimonials"
ON testimonials FOR ALL
USING (auth.role() = 'authenticated');

-- Now you can add/edit/delete projects when logged in!
