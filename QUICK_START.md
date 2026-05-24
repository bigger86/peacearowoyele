# ⚡ Quick Start Guide

## 🎯 Get Your Admin Panel Running in 20 Minutes

Follow these steps in order:

---

## Step 1: Create Supabase Account (3 min)

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Create new project:
   - Name: `peace-portfolio`
   - Password: (generate and save!)
   - Region: Choose closest to you
   - Plan: Free
5. Wait 2-3 minutes for setup

---

## Step 2: Get API Credentials (1 min)

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these two values:
   - **Project URL**
   - **anon public key**

---

## Step 3: Create .env File (1 min)

1. In your project root, create a file named `.env`
2. Add this (replace with YOUR credentials):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 4: Run SQL Code (5 min)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Open file: `supabase-sql/00-ALL-IN-ONE.sql`
4. Copy ENTIRE contents
5. Paste into SQL Editor
6. Click **Run** (or Ctrl+Enter)
7. Wait for success message

---

## Step 5: Create Storage Bucket (2 min)

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name: `portfolio-images`
4. Check **Public bucket** ✅
5. Click **Create bucket**

---

## Step 6: Set Storage Policies (3 min)

1. Go to **Storage** → **Policies**
2. Click on `portfolio-images` bucket
3. Click **New policy** → **For full customization**
4. Run these 4 SQL commands one by one:

```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');
```

```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
```

```sql
CREATE POLICY "Authenticated Manage"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
```

```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');
```

---

## Step 7: Create Admin User (2 min)

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: your@email.com
   - Password: (create strong password)
   - Auto Confirm User: ✅ CHECK THIS
4. Click **Create user**

---

## Step 8: Test Everything (3 min)

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Visit website:**
   ```
   http://localhost:5173
   ```
   Should see "No projects found" ✅

3. **Visit admin:**
   ```
   http://localhost:5173/admin/login
   ```

4. **Log in** with your email/password

5. **Add a test project:**
   - Click "Add New Project"
   - Enter title: "Test Project"
   - Upload an image
   - Click "Create Project"

6. **Check website** - project should appear! 🎉

---

## ✅ Success Checklist

- [ ] Supabase account created
- [ ] Project created and ready
- [ ] API credentials copied
- [ ] `.env` file created with credentials
- [ ] SQL code executed successfully
- [ ] Storage bucket created
- [ ] Storage policies set up
- [ ] Admin user created
- [ ] Dev server running
- [ ] Can log in to admin panel
- [ ] Can add a project
- [ ] Project appears on website

---

## 🆘 Quick Troubleshooting

**"Missing environment variables"**
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server

**"Relation does not exist"**
- Run the SQL code in Supabase SQL Editor
- Check tables exist in Table Editor

**Can't log in**
- Verify you created user in Supabase Authentication
- Check "Auto Confirm User" was enabled
- Try password reset

**Images not uploading**
- Check storage bucket exists
- Verify bucket is public
- Check storage policies are created

---

## 📚 Full Documentation

For detailed information, see:

- `SETUP_INSTRUCTIONS.md` - Complete setup guide
- `ADMIN_PANEL_GUIDE.md` - How to use admin panel
- `IMPLEMENTATION_COMPLETE.md` - Full overview
- `supabase-sql/README.md` - SQL files guide

---

## 🎉 You're Done!

Your admin panel is ready! You can now:

✅ Log in at `/admin/login`  
✅ View dashboard with stats  
✅ Add projects with images  
✅ See changes on website immediately  

**Start adding your portfolio projects!** 🚀
