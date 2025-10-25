# Vercel Deployment Guide for Slamawy Store

This guide will help you deploy your Slamawy Store application to Vercel.

## Prerequisites

1. A GitHub account with your code pushed to: https://github.com/Mostafalol1233/salmawy
2. A Vercel account (sign up at https://vercel.com)
3. A PostgreSQL database (Neon, Supabase, or any PostgreSQL provider)

## Step 1: Push Your Code to GitHub

If you haven't already pushed your code, run these commands in your terminal:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

If you're pushing for the first time to the repository:

```bash
git remote add origin https://github.com/Mostafalol1233/salmawy.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Your Database

### Option A: Using Neon (Recommended - Free Tier Available)

1. Go to https://neon.tech
2. Sign up and create a new project
3. Create a database called `salmawy` or any name you prefer
4. Copy the connection string (it looks like: `postgresql://user:password@host/database?sslmode=require`)
5. Save this connection string - you'll need it in Step 4

### Option B: Using Supabase

1. Go to https://supabase.com
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (URI format)
5. Save this connection string - you'll need it in Step 4

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and log in
2. Click "Add New Project"
3. Import your GitHub repository: `Mostafalol1233/salmawy`
4. Vercel will automatically detect it's a Node.js project

### Build Configuration

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Step 4: Add Environment Variables

In the Vercel deployment settings, add the following environment variables:

1. Click on "Environment Variables" section
2. Add these variables:

   **Variable Name**: `DATABASE_URL`  
   **Value**: Your PostgreSQL connection string from Step 2

   **Variable Name**: `NODE_ENV`  
   **Value**: `production`

3. Make sure to add them for "Production", "Preview", and "Development" environments

## Step 5: Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (usually takes 2-3 minutes)
3. Once done, you'll get a URL like: `https://salmawy-xxx.vercel.app`

## Step 6: Set Up Your Database Schema

After your first deployment, you need to initialize your database:

### Method 1: Using Drizzle Studio (Recommended)

1. Install Drizzle Kit globally (on your local machine):
   ```bash
   npm install -g drizzle-kit
   ```

2. Set your DATABASE_URL in your local environment:
   ```bash
   export DATABASE_URL="your_production_database_url"
   ```

3. Push the schema to your database:
   ```bash
   npm run db:push
   ```

### Method 2: Run SQL Directly

Connect to your database using a SQL client and run the schema creation queries from `shared/schema.ts`.

## Step 7: Create Admin User (Optional)

If you want to access the admin panel:

1. Connect to your database
2. Run the `create_admin.js` script with your production DATABASE_URL:
   ```bash
   DATABASE_URL="your_production_url" node create_admin.js
   ```

Or manually insert an admin user into the `admins` table.

## Step 8: Add Custom Domain (Optional)

1. In your Vercel project, go to Settings > Domains
2. Add your custom domain
3. Follow Vercel's instructions to configure your DNS

## Environment Variables Summary

Make sure you have these in Vercel:

```
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
NODE_ENV=production
```

## Troubleshooting

### Database Connection Issues

- Make sure your DATABASE_URL includes `?sslmode=require` at the end
- Verify the connection string works by testing it locally first
- Check that your database allows connections from Vercel's IP ranges

### Build Failures

- Check the build logs in Vercel dashboard
- Make sure all dependencies are in `package.json`
- Verify your Node.js version is compatible (18.x or higher recommended)

### Runtime Errors

- Check the Function Logs in Vercel dashboard
- Verify all environment variables are set correctly
- Make sure your database schema is up to date

## Post-Deployment

After successful deployment:

1. ✅ Visit your site: `https://your-site.vercel.app`
2. ✅ Test the homepage loads in dark mode (default)
3. ✅ Verify the games category appears first
4. ✅ Check the footer credit link works
5. ✅ Test product browsing and WhatsApp integration
6. ✅ If using admin panel, test login at `/admin-login`

## Updates and Redeployment

Vercel automatically redeploys when you push to GitHub:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel will detect the push and redeploy automatically!

## Support

- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs
- Need help? Contact: [Your support email/contact]

---

**Made with ❤️ by [Mustafa](https://linktr.ee/Mustafa_Bemo)**
