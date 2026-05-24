# 🎛️ Admin Panel Guide

## ✅ What's Been Created

The complete admin panel has been implemented with:

### **Authentication System**
- ✅ `src/contexts/AuthContext.jsx` - Authentication context
- ✅ `src/components/ProtectedRoute.jsx` - Route protection
- ✅ `src/main.jsx` - Updated with AuthProvider

### **Admin Pages**
- ✅ `src/pages/Admin/Login.jsx` + CSS - Login page
- ✅ `src/pages/Admin/Dashboard.jsx` + CSS - Admin dashboard
- ✅ `src/pages/Admin/AddProject.jsx` + CSS - Add new project

### **Routes**
- ✅ `/admin/login` - Login page
- ✅ `/admin/dashboard` - Dashboard (protected)
- ✅ `/admin/projects/new` - Add project (protected)

---

## 🚀 How to Access Admin Panel

### Step 1: Create Admin User in Supabase

1. Go to your Supabase Dashboard
2. Click **Authentication** in the left sidebar
3. Click **Users** tab
4. Click **Add user** button
5. Select **Create new user**
6. Fill in:
   - **Email:** your@email.com
   - **Password:** (create a strong password)
   - **Auto Confirm User:** ✅ Check this
7. Click **Create user**

### Step 2: Access the Admin Panel

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser to:
   ```
   http://localhost:5173/admin/login
   ```

3. Log in with the email and password you created

4. You'll be redirected to the dashboard!

---

## 📊 Admin Panel Features

### **Dashboard** (`/admin/dashboard`)

**Stats Cards:**
- Total Projects count
- Published projects count
- Draft projects count

**Quick Actions:**
- Add New Project button
- Manage Projects button
- View Website button

**Recent Projects List:**
- Shows last 5 projects
- Displays thumbnail, title, status, slug
- Edit button for each project

### **Add Project** (`/admin/projects/new`)

**Project Details:**
- Title (auto-generates slug)
- URL Slug (editable)
- Description (optional)

**Project Information:**
- Client Name
- Project Type (dropdown)
- Year
- Status (Published/Draft/Archived)
- Featured checkbox

**Image Upload:**
- Multiple image upload
- First image becomes thumbnail
- Remove images individually
- Preview all uploaded images

---

## 🎯 How to Add a New Project

1. **Log in** to admin panel
2. Click **"Add New Project"** button
3. Fill in project details:
   - Enter title (slug auto-generates)
   - Add description
   - Enter client name
   - Select project type
   - Set year
4. **Upload images:**
   - Click "Choose Files"
   - Select one or more images
   - Wait for upload to complete
   - First image = thumbnail
5. Set status (Published/Draft)
6. Click **"Create Project"**
7. Project appears on website immediately!

---

## 🔐 Security Features

### **Authentication**
- Email/password authentication via Supabase
- Session persistence (stays logged in)
- Auto-refresh tokens

### **Protected Routes**
- Admin pages require login
- Automatic redirect to login if not authenticated
- Protected from unauthorized access

### **Row Level Security**
- Public can only view published projects
- Authenticated users can manage all content
- Database-level security policies

---

## 🎨 Admin Panel Design

### **Color Scheme**
- Primary: #667eea (Purple/Blue)
- Success: #27ae60 (Green)
- Warning: #f39c12 (Orange)
- Danger: #e74c3c (Red)

### **Typography**
- Headings: Montserrat
- Body: Helvetica Neue

### **Responsive**
- Mobile-friendly
- Tablet-optimized
- Desktop-enhanced

---

## 📱 Admin Panel Pages

### **Login Page**
- Clean, centered design
- Gradient background
- Email + password fields
- Error message display
- "Back to Website" link

### **Dashboard**
- Header with user email
- Sign out button
- Stats cards with icons
- Quick action buttons
- Recent projects list
- Empty state for no projects

### **Add Project Page**
- Back to dashboard link
- Multi-section form
- Real-time slug generation
- Image upload with preview
- Remove image functionality
- Thumbnail badge on first image
- Form validation
- Loading states

---

## 🔄 Workflow Example

```
1. User visits website
   ↓
2. Sees published projects
   ↓
3. Admin logs in at /admin/login
   ↓
4. Views dashboard with stats
   ↓
5. Clicks "Add New Project"
   ↓
6. Fills in project details
   ↓
7. Uploads images
   ↓
8. Clicks "Create Project"
   ↓
9. Project saved to database
   ↓
10. Images stored in Supabase Storage
   ↓
11. Redirected to dashboard
   ↓
12. Project appears on website immediately!
```

---

## 🆘 Troubleshooting

### **Can't log in**
- Check you created a user in Supabase Authentication
- Verify email and password are correct
- Check "Auto Confirm User" was enabled
- Check browser console for errors

### **"Missing environment variables" error**
- Verify `.env` file exists
- Check `VITE_SUPABASE_URL` is set
- Check `VITE_SUPABASE_ANON_KEY` is set
- Restart dev server after adding `.env`

### **Images not uploading**
- Check storage bucket `portfolio-images` exists
- Verify bucket is public
- Check storage policies are created
- Check file size (max 50MB by default)

### **Projects not appearing on website**
- Check project status is "published"
- Verify RLS policies allow public read
- Check browser console for errors
- Try refreshing the page

### **Redirected to login after signing in**
- Check Supabase project URL is correct
- Verify anon key is correct
- Check browser allows cookies
- Try clearing browser cache

---

## 🎯 Next Steps

### **Immediate:**
1. ✅ Create admin user in Supabase
2. ✅ Log in to admin panel
3. ✅ Add your first project
4. ✅ Verify it appears on website

### **Soon:**
- Add "Edit Project" functionality
- Add "Delete Project" functionality
- Add "Manage Projects" list page
- Add bulk operations
- Add project search/filter

### **Future Enhancements:**
- Image optimization
- Drag-and-drop image reordering
- Rich text editor for descriptions
- Project categories/tags
- Analytics dashboard
- Testimonials management

---

## 📞 Admin Panel URLs

| Page | URL | Access |
|------|-----|--------|
| Login | `/admin/login` | Public |
| Dashboard | `/admin/dashboard` | Protected |
| Add Project | `/admin/projects/new` | Protected |
| Edit Project | `/admin/projects/:id/edit` | Coming soon |
| Manage Projects | `/admin/projects` | Coming soon |

---

## 🎉 You're Ready!

Your admin panel is fully functional. You can now:

✅ Log in securely  
✅ View dashboard with stats  
✅ Add new projects with images  
✅ Manage project status  
✅ See changes on website immediately  

**Start by creating your admin user in Supabase, then log in at `/admin/login`!**
