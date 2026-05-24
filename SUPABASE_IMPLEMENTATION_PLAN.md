# 🚀 Supabase Backend Implementation Plan
## Peace Arowoyele Portfolio - Dynamic Content Management System

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Phase 1: Supabase Setup](#phase-1-supabase-setup)
4. [Phase 2: Database Schema](#phase-2-database-schema)
5. [Phase 3: Storage Configuration](#phase-3-storage-configuration)
6. [Phase 4: Frontend Integration](#phase-4-frontend-integration)
7. [Phase 5: Data Migration](#phase-5-data-migration)
8. [Phase 6: Admin Panel](#phase-6-admin-panel)
9. [Phase 7: Testing & Optimization](#phase-7-testing--optimization)
10. [Phase 8: Deployment](#phase-8-deployment)

---

## 🎯 Overview

**Goal:** Transform the static portfolio website into a dynamic, content-managed system where Peace can add, edit, and delete projects without touching code.

**Timeline:** 7-10 days (depending on complexity of admin panel)

**Tech Stack:**
- Frontend: React + Vite (existing)
- Backend: Supabase (Database + Storage + Auth)
- State Management: React Query (optional but recommended)
- Image Optimization: Supabase built-in transformations

---

## ✅ Prerequisites

### Required Accounts & Tools
- [ ] Supabase account (free tier is sufficient)
- [ ] Node.js v18+ installed
- [ ] npm or yarn package manager
- [ ] Git for version control
- [ ] Code editor (VS Code recommended)

### Required Knowledge
- Basic React concepts
- Understanding of async/await
- Basic SQL knowledge (helpful but not required)

---

## 📦 Phase 1: Supabase Setup
**Duration:** 30 minutes  
**Difficulty:** Easy

### Step 1.1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Click "New Project"
5. Fill in project details:
   - **Name:** `peace-portfolio` or `peace-arowoyele-portfolio`
   - **Database Password:** Generate a strong password (save it securely!)
   - **Region:** Choose closest to your target audience (e.g., US East, EU West)
   - **Pricing Plan:** Free tier
6. Click "Create new project"
7. Wait 2-3 minutes for project provisioning

### Step 1.2: Get API Credentials

1. Once project is ready, go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (safe to use in frontend)
   - **service_role** key (NEVER expose in frontend - for admin operations only)

### Step 1.3: Create Environment Variables File

```bash
# In your project root, create .env file
touch .env
```

Add to `.env`:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Add to `.gitignore`:
```
.env
.env.local
```

### Step 1.4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

**✅ Checkpoint:** You should have:
- Active Supabase project
- API credentials saved
- `.env` file created
- Supabase client installed

---

## 🗄️ Phase 2: Database Schema
**Duration:** 1-2 hours  
**Difficulty:** Medium


### Step 2.1: Access SQL Editor

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**

### Step 2.2: Create Projects Table

Copy and paste this SQL:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table (main content)
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

-- Create index for better query performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_slug ON projects(slug);

-- Add comment for documentation
COMMENT ON TABLE projects IS 'Main portfolio projects table';
```

Click **Run** (or press Ctrl+Enter)

### Step 2.3: Create Project Images Table

```sql
-- Project images table (multiple images per project)
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
CREATE INDEX idx_project_images_project_id ON project_images(project_id);
CREATE INDEX idx_project_images_display_order ON project_images(display_order);

COMMENT ON TABLE project_images IS 'Multiple images for each project';
```

Click **Run**


### Step 2.4: Create Tags Tables (Optional but Recommended)

```sql
-- Tags table for categorization
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for many-to-many relationship
CREATE TABLE project_tags (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tag_id)
);

CREATE INDEX idx_project_tags_project_id ON project_tags(project_id);
CREATE INDEX idx_project_tags_tag_id ON project_tags(tag_id);

COMMENT ON TABLE tags IS 'Tags for filtering and categorizing projects';
```

Click **Run**

### Step 2.5: Create Testimonials Table (For About Page)

```sql
-- Testimonials table
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

COMMENT ON TABLE testimonials IS 'Client testimonials for About page';
```

Click **Run**

### Step 2.6: Create Auto-Update Trigger

```sql
-- Function to automatically update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

Click **Run**


### Step 2.7: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for published projects
CREATE POLICY "Anyone can view published projects"
ON projects FOR SELECT
USING (status = 'published');

-- Public read access for project images
CREATE POLICY "Anyone can view project images"
ON project_images FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM projects 
    WHERE projects.id = project_images.project_id 
    AND projects.status = 'published'
  )
);

-- Public read access for tags
CREATE POLICY "Anyone can view tags"
ON tags FOR SELECT
USING (true);

-- Public read access for project_tags
CREATE POLICY "Anyone can view project tags"
ON project_tags FOR SELECT
USING (true);

-- Public read access for active testimonials
CREATE POLICY "Anyone can view active testimonials"
ON testimonials FOR SELECT
USING (is_active = true);

-- Admin policies (we'll add authentication later)
-- For now, allow all operations for authenticated users
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
```

Click **Run**

**✅ Checkpoint:** Verify tables created:
1. Go to **Table Editor** in Supabase Dashboard
2. You should see: `projects`, `project_images`, `tags`, `project_tags`, `testimonials`

---

## 📁 Phase 3: Storage Configuration
**Duration:** 30 minutes  
**Difficulty:** Easy

### Step 3.1: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Fill in details:
   - **Name:** `portfolio-images`
   - **Public bucket:** ✅ Check this (allows public access to images)
4. Click **Create bucket**

### Step 3.2: Create Folder Structure

1. Click on `portfolio-images` bucket
2. Click **Create folder** and create these folders:
   - `projects/`
   - `testimonials/`
   - `general/`

### Step 3.3: Configure Storage Policies

1. Go to **Storage** → **Policies**
2. Click on `portfolio-images` bucket
3. Click **New policy**

**Policy 1: Public Read Access**
```sql
-- Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');
```

**Policy 2: Authenticated Upload**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images' 
  AND auth.role() = 'authenticated'
);
```

**Policy 3: Authenticated Update/Delete**
```sql
-- Allow authenticated users to update/delete
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

### Step 3.4: Test Storage Upload

1. Click **Upload file** in the bucket
2. Upload a test image
3. Click on the image → **Get URL**
4. Copy the public URL
5. Open URL in browser to verify it works

**✅ Checkpoint:** You should be able to:
- See `portfolio-images` bucket
- Upload files manually
- Access uploaded files via public URL

---

## ⚛️ Phase 4: Frontend Integration
**Duration:** 3-4 hours  
**Difficulty:** Medium

### Step 4.1: Create Supabase Client Configuration

Create file: `src/lib/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Step 4.2: Create Custom Hooks

Create file: `src/hooks/useProjects.js`

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          title,
          slug,
          description,
          client_name,
          project_type,
          year,
          featured,
          thumbnail_url,
          created_at
        `)
        .eq('status', 'published')
        .order('display_order', { ascending: true })

      if (error) throw error
      
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { projects, loading, error, refetch: fetchProjects }
}
```

Create file: `src/hooks/useProjectDetails.js`

```javascript
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProjectDetails(slug) {
  const [project, setProject] = useState(null)
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (slug) {
      fetchProjectDetails()
    }
  }, [slug])

  async function fetchProjectDetails() {
    try {
      setLoading(true)

      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (projectError) throw projectError

      setProject(projectData)

      // Fetch project images
      const { data: imagesData, error: imagesError } = await supabase
        .from('project_images')
        .select('*')
        .eq('project_id', projectData.id)
        .order('display_order', { ascending: true })

      if (imagesError) throw imagesError

      setImages(imagesData || [])
    } catch (error) {
      console.error('Error fetching project details:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { project, images, loading, error }
}
```


### Step 4.3: Update Home.jsx to Use Dynamic Data

Modify `src/pages/Home.jsx`:

```javascript
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects'; // Add this import
import './Home.css';

function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const { projects, loading, error } = useProjects(); // Add this hook

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / windowHeight, 1);
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProjects = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const heroHeight = `${100 - (scrollProgress * 100)}vh`;
  const heroOpacity = 1;

  return (
    <div className="home">
      {/* Hero section - unchanged */}
      <section 
        className="hero"
        style={{
          height: heroHeight,
          opacity: heroOpacity,
          pointerEvents: scrollProgress > 0.9 ? 'none' : 'auto'
        }}
      >
        {/* ... hero content stays the same ... */}
      </section>

      {/* White Content Layer */}
      <div className="content-layer">
        {/* Navbar - unchanged */}
        <nav className="content-navbar">
          {/* ... navbar content stays the same ... */}
        </nav>

        {/* Project Grid - Updated */}
        <section className="project-grid">
          {loading && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem',
              fontSize: '1.2rem',
              color: '#666'
            }}>
              Loading projects...
            </div>
          )}

          {error && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem',
              fontSize: '1.2rem',
              color: '#e74c3c'
            }}>
              Error loading projects: {error}
            </div>
          )}

          {!loading && !error && projects.map((project) => (
            <div key={project.id} className="project-grid-item">
              <ProjectCard
                title={project.title}
                imageUrl={project.thumbnail_url}
                slug={project.slug}
              />
            </div>
          ))}

          {!loading && !error && projects.length === 0 && (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '4rem',
              fontSize: '1.2rem',
              color: '#666'
            }}>
              No projects found.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Home;
```


### Step 4.4: Update Projects.jsx

Modify `src/pages/Projects.jsx`:

```javascript
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import './Projects.css';

function Projects() {
  const { projects, loading, error } = useProjects();

  return (
    <div className="projects">
      <div className="projects-container">
        <h1 className="projects-heading">Projects</h1>
        
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
            Loading projects...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem', color: '#e74c3c' }}>
            Error loading projects: {error}
          </div>
        )}

        {!loading && !error && (
          <div className="projects-grid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                title={project.title}
                imageUrl={project.thumbnail_url}
                slug={project.slug}
              />
            ))}
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', fontSize: '1.2rem' }}>
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
```

### Step 4.5: Test Frontend Integration

1. Make sure `.env` file has correct credentials
2. Run development server:
   ```bash
   npm run dev
   ```
3. Open browser to `http://localhost:5173`
4. You should see "Loading projects..." then "No projects found." (because database is empty)

**✅ Checkpoint:** Frontend should:
- Connect to Supabase without errors
- Show loading state
- Show "No projects found" message

---

## 📤 Phase 5: Data Migration
**Duration:** 2-3 hours  
**Difficulty:** Medium

### Step 5.1: Prepare Migration Script

Create file: `scripts/migrate-projects.js`

```javascript
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

// Your existing projects data
const existingProjects = [
  {
    id: 1,
    title: "MCS Design Outcomes",
    slug: "mcs-design-outcomes",
    imageUrl: "https://cdn.myportfolio.com/519f7bbb-e55e-4372-8a59-fce548e099e1/49443d15-4f7c-43fa-b377-2e5aff072cd6_rwc_126x0x927x927x927.jpg?h=08852beca65d52b81c3f616e26bc109a"
  },
  // ... add all 15 projects here
]

async function migrateProjects() {
  console.log('Starting migration...')

  for (let i = 0; i < existingProjects.length; i++) {
    const project = existingProjects[i]
    
    console.log(`\nMigrating project ${i + 1}/${existingProjects.length}: ${project.title}`)

    try {
      // Insert project
      const { data, error } = await supabase
        .from('projects')
        .insert([{
          title: project.title,
          slug: project.slug,
          thumbnail_url: project.imageUrl,
          display_order: i,
          status: 'published',
          project_type: 'Brand Identity', // You can customize this
          year: 2024 // You can customize this
        }])
        .select()
        .single()

      if (error) {
        console.error(`Error migrating ${project.title}:`, error)
        continue
      }

      console.log(`✓ Successfully migrated: ${project.title}`)

      // Optionally, create project_images record
      const { error: imageError } = await supabase
        .from('project_images')
        .insert([{
          project_id: data.id,
          image_url: project.imageUrl,
          display_order: 0,
          is_thumbnail: true
        }])

      if (imageError) {
        console.error(`Error adding image for ${project.title}:`, imageError)
      }

    } catch (err) {
      console.error(`Unexpected error:`, err)
    }
  }

  console.log('\n✓ Migration complete!')
}

migrateProjects()
```

### Step 5.2: Install dotenv

```bash
npm install dotenv
```

### Step 5.3: Update package.json

Add migration script to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "migrate": "node scripts/migrate-projects.js"
  }
}
```

### Step 5.4: Run Migration

```bash
npm run migrate
```

You should see output like:
```
Starting migration...

Migrating project 1/15: MCS Design Outcomes
✓ Successfully migrated: MCS Design Outcomes

Migrating project 2/15: St Helens College – 2020 Prospectus
✓ Successfully migrated: St Helens College – 2020 Prospectus

...

✓ Migration complete!
```


### Step 5.5: Verify Migration

1. Go to Supabase Dashboard → **Table Editor** → `projects`
2. You should see all 15 projects
3. Check `project_images` table for image records
4. Refresh your website - projects should now appear!

### Step 5.6: (Optional) Upload Images to Supabase Storage

If you want to host images on Supabase instead of external CDN:

1. Download all project images from current CDN
2. Upload to Supabase Storage:
   - Go to **Storage** → `portfolio-images` → `projects/`
   - Create folder for each project (use slug as folder name)
   - Upload images
3. Update `thumbnail_url` in database with new Supabase URLs

**✅ Checkpoint:** You should:
- See all 15 projects in Supabase database
- See projects displayed on your website
- Be able to click on projects (even if detail page doesn't work yet)

---

## 🎛️ Phase 6: Admin Panel
**Duration:** 4-6 hours  
**Difficulty:** Hard

### Step 6.1: Set Up Authentication

1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Go to **Authentication** → **Users**
4. Click **Add user** → **Create new user**
5. Enter your email and password
6. Click **Create user**

### Step 6.2: Create Auth Context

Create file: `src/contexts/AuthContext.jsx`

```javascript
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    signIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
```


### Step 6.3: Wrap App with Auth Provider

Update `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext' // Add this
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

### Step 6.4: Create Login Page

Create file: `src/pages/Admin/Login.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/admin/dashboard')
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Admin Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
```

Create file: `src/pages/Admin/Login.css`

```css
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
}

.login-container h1 {
  margin-bottom: 2rem;
  text-align: center;
  color: #1a1a1a;
}

.login-form .form-group {
  margin-bottom: 1.5rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.login-form input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.login-form input:focus {
  outline: none;
  border-color: #667eea;
}

.login-form button {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.login-form button:hover:not(:disabled) {
  background: #5568d3;
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  text-align: center;
}
```


### Step 6.5: Create Protected Route Component

Create file: `src/components/ProtectedRoute.jsx`

```javascript
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute
```

### Step 6.6: Create Admin Dashboard

Create file: `src/pages/Admin/Dashboard.jsx`

```javascript
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useProjects } from '../../hooks/useProjects'
import './Dashboard.css'

function Dashboard() {
  const { user, signOut } = useAuth()
  const { projects, loading } = useProjects()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-user-info">
          <span>{user?.email}</span>
          <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
        </div>
      </header>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <h3>Total Projects</h3>
            <p className="stat-number">{loading ? '...' : projects.length}</p>
          </div>
          <div className="stat-card">
            <h3>Published</h3>
            <p className="stat-number">
              {loading ? '...' : projects.filter(p => p.status === 'published').length}
            </p>
          </div>
        </div>

        <div className="admin-actions">
          <Link to="/admin/projects/new" className="btn-primary">
            + Add New Project
          </Link>
          <Link to="/admin/projects" className="btn-secondary">
            Manage Projects
          </Link>
        </div>

        <div className="recent-projects">
          <h2>Recent Projects</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="projects-list">
              {projects.slice(0, 5).map(project => (
                <div key={project.id} className="project-item">
                  <img src={project.thumbnail_url} alt={project.title} />
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.slug}</p>
                  </div>
                  <Link to={`/admin/projects/${project.id}/edit`} className="btn-edit">
                    Edit
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
```

Create file: `src/pages/Admin/Dashboard.css`

```css
.admin-dashboard {
  min-height: 100vh;
  background: #f5f5f5;
}

.admin-header {
  background: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.admin-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-signout {
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.admin-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.admin-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #1a1a1a;
  margin: 0;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.recent-projects {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.project-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 6px;
}

.project-item img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.project-info {
  flex: 1;
}

.project-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.project-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.btn-edit {
  padding: 0.5rem 1rem;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 0.9rem;
}
```


### Step 6.7: Create Add Project Page

Create file: `src/pages/Admin/AddProject.jsx`

```javascript
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import './AddProject.css'

function AddProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    client_name: '',
    project_type: 'Brand Identity',
    year: new Date().getFullYear(),
    featured: false
  })
  const [images, setImages] = useState([])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (e) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `projects/${formData.slug || 'temp'}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('portfolio-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio-images')
          .getPublicUrl(filePath)

        uploadedUrls.push(publicUrl)
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Error uploading ${file.name}: ${error.message}`)
      }
    }

    setImages(prev => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (images.length === 0) {
      alert('Please upload at least one image')
      return
    }

    setLoading(true)

    try {
      // Insert project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          ...formData,
          thumbnail_url: images[0],
          status: 'published'
        }])
        .select()
        .single()

      if (projectError) throw projectError

      // Insert project images
      const imageRecords = images.map((url, index) => ({
        project_id: project.id,
        image_url: url,
        display_order: index,
        is_thumbnail: index === 0
      }))

      const { error: imagesError } = await supabase
        .from('project_images')
        .insert(imageRecords)

      if (imagesError) throw imagesError

      alert('Project created successfully!')
      navigate('/admin/dashboard')
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Error creating project: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-project-page">
      <div className="add-project-container">
        <h1>Add New Project</h1>
        
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="title">Project Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleTitleChange}
              required
              placeholder="e.g., Brand Identity for Tech Startup"
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">URL Slug *</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="e.g., brand-identity-tech-startup"
            />
            <small>Auto-generated from title, but you can edit it</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the project, challenges, and solutions..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="client_name">Client Name</label>
              <input
                type="text"
                id="client_name"
                name="client_name"
                value={formData.client_name}
                onChange={handleChange}
                placeholder="e.g., Acme Corp"
              />
            </div>

            <div className="form-group">
              <label htmlFor="project_type">Project Type</label>
              <select
                id="project_type"
                name="project_type"
                value={formData.project_type}
                onChange={handleChange}
              >
                <option value="Brand Identity">Brand Identity</option>
                <option value="Logo Design">Logo Design</option>
                <option value="Visual Strategy">Visual Strategy</option>
                <option value="Brand Audit">Brand Audit</option>
                <option value="Design System">Design System</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              <span>Featured Project</span>
            </label>
          </div>

          <div className="form-group">
            <label>Project Images *</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p className="upload-status">Uploading images...</p>}
            
            {images.length > 0 && (
              <div className="image-preview-grid">
                {images.map((url, index) => (
                  <div key={index} className="image-preview">
                    <img src={url} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="btn-remove-image"
                    >
                      ×
                    </button>
                    {index === 0 && <span className="thumbnail-badge">Thumbnail</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading || uploading || images.length === 0}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddProject
```


Create file: `src/pages/Admin/AddProject.css`

```css
.add-project-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.add-project-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-project-container h1 {
  margin-bottom: 2rem;
}

.project-form .form-group {
  margin-bottom: 1.5rem;
}

.project-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.project-form input[type="text"],
.project-form input[type="number"],
.project-form textarea,
.project-form select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.project-form input:focus,
.project-form textarea:focus,
.project-form select:focus {
  outline: none;
  border-color: #667eea;
}

.project-form small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: auto;
}

.upload-status {
  margin-top: 0.5rem;
  color: #667eea;
  font-style: italic;
}

.image-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 30px;
  height: 30px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.thumbnail-badge {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.btn-cancel:hover:not(:disabled) {
  border-color: #999;
  color: #333;
}

.btn-submit {
  background: #667eea;
  color: white;
  border: none;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
}

.btn-cancel:disabled,
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

### Step 6.8: Update App.jsx with Admin Routes

Update `src/App.jsx`:

```javascript
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Admin/Login'
import Dashboard from './pages/Admin/Dashboard'
import AddProject from './pages/Admin/AddProject'
import './App.css'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<><Home /><Footer /></>} />
        <Route path="/projects" element={<><Navbar /><Projects /><Footer /></>} />
        <Route path="/about" element={<><Navbar /><About /><Footer /></>} />
        <Route path="/contact" element={<><Navbar /><Contact /><Footer /></>} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
```

**✅ Checkpoint:** You should be able to:
- Visit `/admin/login` and sign in
- Access `/admin/dashboard` after login
- See project statistics
- Click "Add New Project" and see the form
- Upload images and create a new project

---

## 🧪 Phase 7: Testing & Optimization
**Duration:** 2-3 hours  
**Difficulty:** Medium

### Step 7.1: Test Complete Workflow

1. **Test Public Pages:**
   - Visit homepage - verify projects load
   - Visit projects page - verify all projects display
   - Check loading states
   - Check error handling (disconnect internet temporarily)

2. **Test Admin Panel:**
   - Log in to admin
   - Create a new project with multiple images
   - Verify project appears on frontend immediately
   - Test image upload with different file types
   - Test form validation

3. **Test Edge Cases:**
   - Try creating project without images
   - Try duplicate slug
   - Try very long project titles
   - Test with slow internet connection

### Step 7.2: Add Loading Skeletons (Optional)

Create file: `src/components/ProjectSkeleton.jsx`

```javascript
import './ProjectSkeleton.css'

function ProjectSkeleton() {
  return (
    <div className="project-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
    </div>
  )
}

export default ProjectSkeleton
```

Create file: `src/components/ProjectSkeleton.css`

```css
.project-skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

.skeleton-image {
  width: 100%;
  aspect-ratio: 4/3;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

.skeleton-title {
  height: 20px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-top: 1rem;
  width: 70%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

### Step 7.3: Add Image Optimization

Update image URLs to use Supabase transformations:

```javascript
// In ProjectCard.jsx or wherever images are displayed
const optimizedImageUrl = (url, width = 800) => {
  if (!url) return ''
  
  // If it's a Supabase URL, add transformation parameters
  if (url.includes('supabase')) {
    return `${url}?width=${width}&quality=80`
  }
  
  return url
}

// Usage:
<img src={optimizedImageUrl(project.thumbnail_url, 600)} alt={project.title} />
```

### Step 7.4: Add Caching with React Query (Optional but Recommended)

Install React Query:

```bash
npm install @tanstack/react-query
```

Update `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

Update `src/hooks/useProjects.js` to use React Query:

```javascript
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })

  if (error) throw error
  return data || []
}

export function useProjects() {
  const { data: projects = [], isLoading: loading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  })

  return { 
    projects, 
    loading, 
    error: error?.message 
  }
}
```

### Step 7.5: Performance Checklist

- [ ] Images are optimized (compressed, proper format)
- [ ] Lazy loading implemented for images
- [ ] Database queries are indexed
- [ ] Caching strategy in place
- [ ] Loading states provide good UX
- [ ] Error handling is comprehensive
- [ ] Mobile performance is good

**✅ Checkpoint:** Website should:
- Load quickly
- Handle errors gracefully
- Provide smooth user experience
- Work well on mobile devices

---

## 🚀 Phase 8: Deployment
**Duration:** 1-2 hours  
**Difficulty:** Easy

### Step 8.1: Prepare for Production

1. **Update Environment Variables:**

Create `.env.production`:
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

2. **Build the Project:**

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 8.2: Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Follow prompts:**
   - Link to existing project or create new
   - Set build command: `npm run build`
   - Set output directory: `dist`

4. **Add Environment Variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`

5. **Redeploy:**
```bash
vercel --prod
```

### Step 8.3: Alternative: Deploy to Netlify

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Deploy:**
```bash
netlify deploy --prod
```

3. **Configure:**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables:**
   - Go to Netlify Dashboard → Site Settings → Environment Variables
   - Add your Supabase credentials

### Step 8.4: Configure Custom Domain (Optional)

**For Vercel:**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

**For Netlify:**
1. Go to Domain Settings
2. Add custom domain
3. Update DNS records

### Step 8.5: Set Up Supabase Production Policies

Verify RLS policies are properly configured:

```sql
-- Double-check that public can only read published projects
SELECT * FROM projects WHERE status = 'published'; -- Should work
SELECT * FROM projects WHERE status = 'draft'; -- Should return empty for public

-- Verify authenticated users can manage content
-- (Test by logging in to admin panel)
```

### Step 8.6: Post-Deployment Checklist

- [ ] Website loads correctly at production URL
- [ ] All images display properly
- [ ] Projects page shows all projects
- [ ] Admin login works
- [ ] Can create new projects from admin panel
- [ ] New projects appear on frontend immediately
- [ ] Mobile responsiveness works
- [ ] SSL certificate is active (HTTPS)
- [ ] Custom domain configured (if applicable)
- [ ] Analytics set up (Google Analytics, Plausible, etc.)

---

## 📚 Additional Features (Future Enhancements)

### Feature 1: Project Categories/Filtering

```sql
-- Add category filter to frontend
SELECT * FROM projects 
WHERE status = 'published' 
AND project_type = 'Brand Identity'
ORDER BY display_order;
```

### Feature 2: Search Functionality

```sql
-- Full-text search
SELECT * FROM projects 
WHERE status = 'published'
AND (
  title ILIKE '%search term%' 
  OR description ILIKE '%search term%'
)
ORDER BY display_order;
```

### Feature 3: Project Analytics

```sql
-- Add views tracking table
CREATE TABLE project_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT
);
```

### Feature 4: Draft/Preview Mode

- Add "Preview" button in admin panel
- Generate temporary preview URLs
- Allow viewing drafts before publishing

### Feature 5: Bulk Operations

- Select multiple projects
- Bulk delete
- Bulk status change
- Bulk reordering

### Feature 6: Image Gallery for Projects

- Create individual project detail pages
- Show all project images in a gallery
- Add lightbox functionality

### Feature 7: Testimonials Management

- Admin interface for testimonials
- Display on About page
- Carousel/slider component

---

## 🔧 Troubleshooting

### Issue: "Missing environment variables"

**Solution:**
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after adding variables

### Issue: "Row Level Security policy violation"

**Solution:**
- Check RLS policies in Supabase Dashboard
- Verify user is authenticated for admin operations
- Check policy conditions match your query

### Issue: Images not uploading

**Solution:**
- Verify storage bucket is public
- Check storage policies allow authenticated uploads
- Verify file size limits (default 50MB)
- Check file type is allowed

### Issue: Projects not appearing on frontend

**Solution:**
- Check project status is 'published'
- Verify RLS policies allow public read
- Check browser console for errors
- Verify Supabase credentials are correct

### Issue: Slow image loading

**Solution:**
- Use Supabase image transformations
- Compress images before upload
- Implement lazy loading
- Use appropriate image formats (WebP)

---

## 📖 Documentation & Resources

### Supabase Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

### React Resources
- [React Router](https://reactrouter.com/)
- [React Query](https://tanstack.com/query/latest)
- [Vite Documentation](https://vitejs.dev/)

### Deployment
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)

---

## 🎉 Conclusion

You now have a fully functional, dynamic portfolio website with:

✅ **Backend:** Supabase database + storage  
✅ **Frontend:** React with dynamic data fetching  
✅ **Admin Panel:** Full CRUD operations for projects  
✅ **Authentication:** Secure admin access  
✅ **Image Management:** Upload and manage project images  
✅ **Deployment:** Production-ready setup  

**Next Steps:**
1. Add more projects through admin panel
2. Customize styling to match your brand
3. Add additional features from enhancement list
4. Set up analytics to track visitors
5. Share your portfolio with the world!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Supabase logs in Dashboard
3. Check browser console for errors
4. Review this implementation plan step-by-step

**Happy building! 🚀**
