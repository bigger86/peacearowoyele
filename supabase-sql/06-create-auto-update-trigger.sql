-- ============================================
-- STEP 6: Create Auto-Update Trigger
-- ============================================
-- This automatically updates the 'updated_at' timestamp
-- whenever a project is modified

-- Create the function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Verify it worked (optional)
-- You should see a success message
