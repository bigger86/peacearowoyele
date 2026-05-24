# 📊 Supabase SQL Files

This folder contains all the SQL code needed to set up your database.

## 🎯 Two Options

### Option 1: Run All at Once (Easiest)
Use the **`00-ALL-IN-ONE.sql`** file to set up everything in one go.

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Copy and paste the entire contents of `00-ALL-IN-ONE.sql`
4. Click **Run** (or press Ctrl+Enter)
5. Done! ✅

### Option 2: Run Step by Step (More Control)
Run each numbered file in order:

1. `01-enable-uuid.sql` - Enable UUID extension
2. `02-create-projects-table.sql` - Create projects table
3. `03-create-project-images-table.sql` - Create project images table
4. `04-create-tags-tables.sql` - Create tags tables (optional)
5. `05-create-testimonials-table.sql` - Create testimonials table (optional)
6. `06-create-auto-update-trigger.sql` - Auto-update timestamps
7. `07-enable-row-level-security.sql` - Enable RLS
8. `08-create-public-read-policies.sql` - Allow public to view projects
9. `09-create-admin-policies.sql` - Allow you to manage content

## 📋 What Each File Does

| File | Required? | Purpose |
|------|-----------|---------|
| `01-enable-uuid.sql` | ✅ Required | Enables UUID generation for unique IDs |
| `02-create-projects-table.sql` | ✅ Required | Main table for portfolio projects |
| `03-create-project-images-table.sql` | ✅ Required | Stores multiple images per project |
| `04-create-tags-tables.sql` | ⚠️ Optional | For categorizing projects with tags |
| `05-create-testimonials-table.sql` | ⚠️ Optional | For client testimonials on About page |
| `06-create-auto-update-trigger.sql` | ✅ Required | Auto-updates timestamps when editing |
| `07-enable-row-level-security.sql` | ✅ Required | Enables security policies |
| `08-create-public-read-policies.sql` | ✅ Required | Lets visitors see your projects |
| `09-create-admin-policies.sql` | ✅ Required | Lets you manage content when logged in |

## 🔍 How to Run SQL in Supabase

1. Open your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query** button
4. Copy the SQL code from the file
5. Paste it into the editor
6. Click **Run** button (or press Ctrl+Enter)
7. Look for success message at the bottom

## ✅ Verify Tables Were Created

After running the SQL:

1. Go to **Table Editor** in Supabase Dashboard
2. You should see these tables:
   - `projects` ✅
   - `project_images` ✅
   - `tags` (if you ran file 04)
   - `project_tags` (if you ran file 04)
   - `testimonials` (if you ran file 05)

## 🆘 Troubleshooting

**Error: "relation already exists"**
- The table was already created. You can skip this file or delete the table first.

**Error: "permission denied"**
- Make sure you're logged into Supabase Dashboard
- Check you're in the correct project

**Error: "syntax error"**
- Make sure you copied the ENTIRE file contents
- Check for any missing characters

## 📚 Database Schema Overview

```
projects (main table)
├── id (UUID, primary key)
├── title (text)
├── slug (text, unique)
├── description (text)
├── client_name (text)
├── project_type (text)
├── year (integer)
├── featured (boolean)
├── display_order (integer)
├── thumbnail_url (text)
├── status (text: draft/published/archived)
├── created_at (timestamp)
└── updated_at (timestamp)

project_images (one-to-many with projects)
├── id (UUID, primary key)
├── project_id (UUID, foreign key → projects.id)
├── image_url (text)
├── caption (text)
├── alt_text (text)
├── display_order (integer)
├── is_thumbnail (boolean)
└── created_at (timestamp)
```

## 🎉 Next Steps

After running the SQL:

1. ✅ Verify tables exist in Table Editor
2. ✅ Create storage bucket for images
3. ✅ Add your `.env` file with Supabase credentials
4. ✅ Test your website - it should show "No projects found"
5. ✅ Add your first project!

---

**Need help?** Check `SETUP_INSTRUCTIONS.md` in the project root.
