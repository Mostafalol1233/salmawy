# Deployment Guide

This guide explains how to deploy your application to various platforms.

## Important Note

This application is configured as a **static frontend** for easy deployment to Vercel and Netlify. The deployment configurations are optimized for the frontend only.

If your application requires backend API functionality, you have two options:
1. **Use Replit Deployments** (recommended) - Deploy the full-stack app with one click
2. **Deploy backend separately** - Use Railway, Render, or similar platforms for the backend API

## Prerequisites

- A GitHub repository with your code
- An account on your chosen platform

## Deploying to Vercel

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Click "Deploy"

**What gets deployed**: Static frontend from `dist/public` folder

## Deploying to Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

### Option 2: Netlify Dashboard

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to your Git repository
4. Netlify will automatically detect the configuration from `netlify.toml`
5. Click "Deploy site"

**What gets deployed**: Static frontend from `dist/public` folder with SPA routing

## Deploying Full-Stack to Replit

For the complete application with both frontend and backend:

1. Open your Replit project
2. Click the "Deploy" button
3. Follow the prompts to publish your app
4. Your app will be available at a `.replit.app` domain

**What gets deployed**: Complete Express backend + frontend

## Local Production Build

To test the production build locally:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

Then visit `http://localhost:5000`

## Environment Variables

If your application uses environment variables (API keys, database URLs, etc.):

### Vercel
- Go to Project Settings → Environment Variables
- Add your variables (must be prefixed with `VITE_` for frontend access)

### Netlify
- Go to Site Settings → Build & deploy → Environment
- Add your variables (must be prefixed with `VITE_` for frontend access)

### Replit
- Use the Secrets tab in your Replit project
- Variables are automatically available

## Troubleshooting

### Build fails
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility (v20 recommended)
- Review build logs for specific errors

### Assets not loading
- Verify the build completed successfully
- Check browser console for 404 errors
- Ensure asset paths use the `@assets` import alias

### Application not working after deployment
- If you need API functionality, use Replit Deployments or deploy the backend separately
- Check that all environment variables are set
- Review platform-specific logs

## Platform Recommendations

- **Static frontend only**: Vercel or Netlify (free tier available)
- **Full-stack app**: Replit Deployments (easiest) or Railway/Render for backend
- **Custom domain**: All platforms support custom domains

## Support

For more information:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Replit Deployments](https://docs.replit.com/hosting/deployments/about-deployments)
