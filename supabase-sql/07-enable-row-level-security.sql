-- ============================================
-- STEP 7: Enable Row Level Security (RLS)
-- ============================================
-- This is CRITICAL for security!
-- RLS controls who can read/write data

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- If you created tags tables, enable RLS on them too
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;

-- If you created testimonials table, enable RLS on it too
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Note: After enabling RLS, NO ONE can access the data until you create policies
-- That's what we'll do in the next step
