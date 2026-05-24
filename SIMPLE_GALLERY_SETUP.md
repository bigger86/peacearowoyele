# 🖼️ Simple Image Gallery Setup

## What You Get

A simple image management system where you can:
- ✅ Upload images with titles from admin panel
- ✅ Images automatically appear on public gallery
- ✅ Delete images from admin panel
- ✅ Changes reflect immediately on frontend

---

## 🚀 Quick Setup (15 Minutes)

### Step 1: Set Up Supabase (5 min)

1. Go to https://supabase.com and create account
2. Create new project
3. Get your credentials:
   - Go to **Settings** → **API**
   - Copy **Project URL**
   - Copy **anon public** key

### Step 2: Add Credentials to .env (1 min)

Open `.env` file in `portfolio-site` folder and add:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 3: Run SQL Code (2 min)

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New query**
3. Copy contents of `supabase-sql/SIMPLE-GALLERY.sql`
4. Paste and click **Run**

### Step 4: Create Storage Bucket (2 min)

1. In Supabase, go to **Storage**
2. Click **New bucket**
3. Name: `portfolio-images`
4. Check **Public bucket** ✅
5. Click **Create**

### Step 5: Set Storage Policies (3 min)

In **Storage** → **Policies** → `portfolio-images`, create 4 policies:

**Policy 1: Public Read**
- Name: `Public Access`
- Operation: SELECT
- Definition: `bucket_id = 'portfolio-images'`

**Policy 2: Authenticated Upload**
- Name: `Authenticated Upload`
- Operation: INSERT
- Definition: `bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'`

**Policy 3: Authenticated Update**
- Name: `Authenticated Update`
- Operation: UPDATE
- Definition: `bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'`

**Policy 4: Authenticated Delete**
- Name: `Authenticated Delete`
- Operation: DELETE
- Definition: `bucket_id = 'portfolio-images' AND auth.role() = 'authenticated'`

### Step 6: Create Admin User (2 min)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter your email and password
4. Check **Auto Confirm User** ✅
5. Click **Create user**

### Step 7: Restart Server & Test

```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 🎯 How to Use

### Admin Panel
```
http://localhost:5173/admin/login
```

1. Log in with your email/password
2. You'll see the Gallery Manager
3. Enter a title (optional)
4. Click "Choose Images" and select images
5. Images upload automatically
6. To delete: hover over image and click "Delete"

### Public Gallery
```
http://localhost:5173/gallery
```

- Anyone can view this page
- Shows all uploaded images
- Updates automatically when you add/delete images

---

## 📁 What Was Created

### New Files:
- `supabase-sql/SIMPLE-GALLERY.sql` - Database setup
- `src/hooks/useGallery.js` - Gallery logic
- `src/pages/Admin/Gallery.jsx` + CSS - Admin panel
- `src/pages/GalleryPublic.jsx` + CSS - Public gallery

### Updated Files:
- `src/App.jsx` - Added gallery routes
- `src/pages/Admin/Login.jsx` - Redirects to gallery

---

## 🗄️ Database Structure

Simple table with just 5 fields:

```
gallery_images
├── id (UUID)
├── title (text)
├── image_url (text)
├── display_order (integer)
└── created_at (timestamp)
```

---

## 🎨 Features

### Admin Panel:
- Upload single or multiple images
- Optional title for each image
- Delete images with confirmation
- View all images in grid
- Image count display
- Responsive design

### Public Gallery:
- Clean grid layout
- Hover effects
- Image titles
- Responsive (mobile-friendly)
- Loading states
- Empty state

---

## 🔐 Security

- ✅ Public can view gallery
- ✅ Only authenticated users can upload/delete
- ✅ Row Level Security enabled
- ✅ Storage policies configured

---

## 🆘 Troubleshooting

**"Missing environment variables"**
→ Create `.env` file with Supabase credentials

**Can't log in**
→ Create user in Supabase Authentication

**Images not uploading**
→ Check storage bucket exists and policies are set

**Images not showing on public gallery**
→ Check SQL code was run successfully

---

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] `.env` file with credentials
- [ ] SQL code executed
- [ ] Storage bucket created
- [ ] Storage policies set
- [ ] Admin user created
- [ ] Can log in to admin panel
- [ ] Can upload images
- [ ] Images appear on public gallery
- [ ] Can delete images

---

## 🎉 You're Done!

**Admin Panel:** `http://localhost:5173/admin/login`  
**Public Gallery:** `http://localhost:5173/gallery`

Start uploading your images! 🖼️✨
