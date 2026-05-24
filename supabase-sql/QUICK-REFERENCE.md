# 🚀 Quick Reference - SQL Files List

## ✅ Required Files (Must Run These)

### 1. **00-ALL-IN-ONE.sql** ⭐ EASIEST OPTION
**Run this ONE file and you're done!**
- Contains everything you need
- Sets up all tables, security, and policies
- Recommended for beginners

---

## 📝 Individual Files (Alternative to All-in-One)

### Core Setup (Required)

| # | File Name | What It Does |
|---|-----------|--------------|
| 1 | `01-enable-uuid.sql` | Enables unique ID generation |
| 2 | `02-create-projects-table.sql` | Creates main projects table |
| 3 | `03-create-project-images-table.sql` | Creates images table |
| 6 | `06-create-auto-update-trigger.sql` | Auto-updates timestamps |
| 7 | `07-enable-row-level-security.sql` | Enables security |
| 8 | `08-create-public-read-policies.sql` | Lets visitors see projects |
| 9 | `09-create-admin-policies.sql` | Lets you manage content |

### Optional Features

| # | File Name | What It Does |
|---|-----------|--------------|
| 4 | `04-create-tags-tables.sql` | Add tags to projects (optional) |
| 5 | `05-create-testimonials-table.sql` | Add testimonials (optional) |

---

## 🎯 Recommended Approach

### For Beginners:
```
Just run: 00-ALL-IN-ONE.sql
```

### For Advanced Users:
```
Run files 01 → 02 → 03 → 06 → 07 → 08 → 09
(Skip 04 and 05 if you don't need tags/testimonials)
```

---

## 📋 Copy-Paste Checklist

Use this checklist when running SQL:

- [ ] Opened Supabase Dashboard
- [ ] Clicked "SQL Editor"
- [ ] Clicked "New query"
- [ ] Copied SQL code from file
- [ ] Pasted into editor
- [ ] Clicked "Run" button
- [ ] Saw success message
- [ ] Verified tables in "Table Editor"

---

## 🔥 Quick Start (5 Minutes)

1. **Open Supabase Dashboard**
2. **Go to SQL Editor**
3. **Copy this file:** `00-ALL-IN-ONE.sql`
4. **Paste and Run**
5. **Done!** ✅

---

## 📊 What Tables Will Be Created

After running the SQL, you'll have:

### Required Tables:
- ✅ `projects` - Your portfolio projects
- ✅ `project_images` - Project photos/images

### Optional Tables:
- ⚠️ `tags` - For categorizing projects
- ⚠️ `project_tags` - Links projects to tags
- ⚠️ `testimonials` - Client testimonials

---

## 🆘 Common Issues

**"Missing environment variables"**
- You need to create `.env` file with your Supabase credentials
- See `SETUP_INSTRUCTIONS.md`

**"Relation does not exist"**
- You haven't run the SQL yet
- Go to SQL Editor and run the code

**"No projects found"**
- This is CORRECT! Database is empty
- Add projects through admin panel or manually

---

## 📞 Need Help?

1. Check `README.md` in this folder
2. Check `SETUP_INSTRUCTIONS.md` in project root
3. Check `SUPABASE_IMPLEMENTATION_PLAN.md` for full details

---

**Ready to go? Run `00-ALL-IN-ONE.sql` now!** 🚀
