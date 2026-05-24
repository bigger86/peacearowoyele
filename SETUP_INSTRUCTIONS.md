# 🚀 Supabase Setup Instructions

## ✅ What's Been Completed

The following files have been created and configured:

1. **Supabase Client** - `src/lib/supabase.js`
2. **Custom Hooks** - `src/hooks/useProjects.js` and `src/hooks/useProjectDetails.js`
3. **Updated Components** - `Home.jsx` and `Projects.jsx` now use dynamic data
4. **Environment Setup** - `.env.example` created, `.gitignore` updated

## 📋 Next Steps - YOU NEED TO DO THESE

### Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" and sign up
3. Create a new project:
   - **Name:** `peace-portfolio`
   - **Database Password:** (Generate and save securely!)
   - **Region:** Choose closest to your audience
   - **Plan:** Free tier
4. Wait 2-3 minutes for provisioning

### Step 2: Get Your API Credentials

1. Once project is ready, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 3: Create .env File

1. In your project root, create a file named `.env` (no extension)
2. Add your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Replace the values with your actual credentials from Step 2!**

### Step 4: Create Database Tables

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy and paste this SQL code:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
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

-- Project images table
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

-- Create indexes
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_project_images_project_id ON project_images(project_id);

-- Auto-update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects
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

-- Admin policies (for authenticated users)
CREATE POLICY "Authenticated users can manage projects"
ON projects FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage project images"
ON project_images FOR ALL
USING (auth.role() = 'authenticated');
```

4. Click **Run** (or press Ctrl+Enter)
5. Verify tables created: Go to **Table Editor** and you should see `projects` and `project_images`

### Step 5: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `portfolio-images`
4. Check **Public bucket** ✅
5. Click **Create bucket**

### Step 6: Configure Storage Policies

1. Go to **Storage** → **Policies**
2. Click on `portfolio-images` bucket
3. Add these policies:

**Policy 1: Public Read**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');
```

**Policy 2: Authenticated Upload**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Manage**
```sql
CREATE POLICY "Authenticated Manage"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);
```

### Step 7: Test the Setup

1. Make sure your `.env` file has the correct credentials
2. Restart your development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`
4. You should see "No projects found" (this is correct - database is empty)
5. Check browser console - there should be NO errors

### Step 8: Add Test Data (Optional)

To verify everything works, add a test project manually:

1. Go to Supabase Dashboard → **Table Editor** → `projects`
2. Click **Insert row**
3. Fill in:
   - **title:** "Test Project"
   - **slug:** "test-project"
   - **thumbnail_url:** (paste any image URL)
   - **status:** "published"
   - **display_order:** 0
4. Click **Save**
5. Refresh your website - the test project should appear!

## 🎉 Success Criteria

You'll know everything is working when:
- ✅ No errors in browser console
- ✅ Website loads without crashing
- ✅ You see "No projects found" or your test project
- ✅ No "Missing Supabase environment variables" error

## 🆘 Troubleshooting

**Error: "Missing Supabase environment variables"**
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after creating `.env`

**Error: "relation 'projects' does not exist"**
- Run the SQL code from Step 4 in Supabase SQL Editor
- Verify tables exist in Table Editor

**Projects not showing**
- Check project status is 'published'
- Verify RLS policies are created
- Check browser console for errors

## 📞 Need Help?

Refer to the full implementation plan in `SUPABASE_IMPLEMENTATION_PLAN.md`
