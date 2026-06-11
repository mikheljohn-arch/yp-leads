# YP Leads — Yellow Pages AU Lead Generator

A full-stack lead management app built with Next.js, Supabase, and deployable to Vercel.

## Stack
- **Next.js 14** (App Router) + TypeScript + Tailwind CSS
- **Supabase** — Auth + PostgreSQL database
- **Vercel** — hosting & deployment

---

## Step 1 — Supabase setup

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In your project, go to **SQL Editor → New Query**.
3. Paste the contents of `supabase-schema.sql` and click **Run**.
4. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon / public` key

---

## Step 2 — Local development

```bash
# Clone and install
git clone <your-repo>
cd yp-leads
npm install

# Set up environment
cp .env.local.example .env.local
# Edit .env.local and paste your Supabase URL and anon key

# Run locally
npm run dev
# Open http://localhost:3000
```

---

## Step 3 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
# Create a repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/yp-leads.git
git push -u origin main
```

---

## Step 4 — Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repo.
3. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
4. Click **Deploy**. Done!

---

## Features
- Email/password auth (Supabase Auth)
- Add, edit, delete leads
- Track: managing director, title, company, address, phone, email, category, status, notes
- Filter by status (New / Contacted / Qualified / Closed)
- Search across all fields
- Export to CSV
- Direct link to Yellow Pages AU search
- Row Level Security — each user only sees their own leads
