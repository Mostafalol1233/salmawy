# Slamawy Store - Gaming Cards E-commerce Platform

## Overview

Slamawy Store is an Egyptian-based gaming cards e-commerce platform specializing in digital game currency and gaming cards. The application provides a bilingual (English/Arabic) shopping experience with WhatsApp integration for order processing and customer support. The platform features popular gaming products including PUBG UC, Free Fire Diamonds, Valorant VP, CrossFire ZP, Genshin Impact, League of Legends, Fortnite, Roblox, and Call of Duty cards.

## Deployment Status

**✅ READY FOR VERCEL DEPLOYMENT**

The application is fully configured and ready for Vercel deployment with all features operational:

- ✅ Build successful (`npm run build` completes without errors)
- ✅ No code errors (LSP diagnostics clean)
- ✅ Serverless API configured (`api/index.ts`)
- ✅ All features tested and working
- ✅ Subscription packages ready (Discord Nitro, ChatGPT Plus, Spotify Premium)
- ✅ Social media services ready (Instagram, TikTok, YouTube)
- ✅ Complete deployment documentation available

**Quick Deploy**: See `VERCEL_DEPLOYMENT_CHECKLIST.md` for complete deployment guide.

## Recent Changes (October 25, 2025)

### Latest Updates - Vercel Deployment Ready
- **Deployment Configuration Complete**: Verified all Vercel deployment files (vercel.json, api/index.ts, build scripts)
- **Build Verified**: Production build completed successfully with all assets compiled to dist/public
- **Subscription Packages Confirmed**: All 3 subscription products ready (Discord Nitro, ChatGPT Plus, Spotify Premium)
- **Social Media Services Confirmed**: All 3 social media products ready (Instagram Followers, TikTok Likes, YouTube Views)
- **Deployment Checklist Created**: Comprehensive deployment verification document with all features, routes, and post-deployment steps
- **Code Quality Verified**: No LSP errors, clean codebase ready for production

### Previous Updates - Bug Fixes & Improvements
- **Dark Mode Default Fixed**: Changed `App.tsx` defaultTheme from "light" to "dark" - new users now see dark mode by default without needing to toggle
- **Admin Dashboard Redirect Fixed**: Added automatic redirect from `/admin/dashboard` to `/admin/dashboard/products` so admins see content immediately instead of empty welcome page
- **Database Verification**: Confirmed all 15 products (9 gaming, 3 subscriptions, 3 social media) are properly stored and accessible via API
- **API Routes Verified**: All routes working correctly including POST /api/reviews for review submission and blog comment endpoints

### Previous Updates - Deployment Preparation
- **Games Category Priority**: Updated product category sorting to display games first in the "All Products" tab
- **Developer Credit**: Added visible footer credit "Made with ❤️ by Mustafa" with link to linktr.ee/Mustafa_Bemo
- **Deployment Configuration**: Created comprehensive deployment guides (VERCEL_DEPLOYMENT.md, GITHUB_DEPLOYMENT.md) and .env.example template for production deployment
- **Security Enhancement**: Updated .gitignore to properly exclude .env files, logs, and other sensitive data from version control

### Previous Updates
- **Gaming Products Database Restoration**: Added all 9 gaming products to database (CrossFire, Free Fire, PUBG Mobile, Valorant, Genshin Impact, League of Legends, Fortnite, Roblox, Call of Duty) making them available in the admin dashboard for management
- **Product Icon Images Upgrade**: Replaced text-based UI Avatar placeholders with proper icon images for all subscription services (Discord Nitro, ChatGPT Plus, Spotify Premium) and social media services (Instagram, TikTok, YouTube)
- **ProductCard Bug Fix**: Resolved React duplicate key warning by implementing unique composite keys using product ID, value, and index
- **Dashboard Testing**: Comprehensive testing of all admin features including site settings updates, announcement management, product CRUD operations, review approvals, blog post creation, and social link management
- **Blog Comments System**: Implemented complete commenting functionality for blog posts with admin moderation, database schema (blogComments table), storage methods, API routes, and UI components with loading states
- **Enhanced Blog Editor**: Added advanced formatting options including code blocks (inline and block), blockquotes, horizontal rules, strikethrough, ordered/unordered lists for rich content creation
- **Blog Functionality**: Added public-facing blog pages at `/blog` (listing) and `/blog/:slug` (individual posts) with markdown support and theme-aware design
- **Product Category Filtering**: Implemented tab-based filtering on the home page allowing users to browse products by category (All, Gaming, Subscriptions, Social Media)
- **Theme-Aware Branding**: Updated all logo displays (HeroSection and AboutSection) to automatically switch between light and dark mode versions


## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool.

**UI Library**: Shadcn/ui components built on Radix UI primitives, providing a comprehensive set of accessible, customizable components. The design system follows a dark-mode-first approach inspired by Amazon's e-commerce patterns combined with Discord's dark aesthetic.

**Styling**: Tailwind CSS with custom theme configuration supporting both light and dark modes. The color palette emphasizes deep charcoal backgrounds (`#0f0f0f`), electric blue accents (`#5865F2`), and success green for WhatsApp integration.

**State Management**: TanStack Query (React Query) for server state management and data fetching. Local state is managed with React hooks.

**Routing**: Wouter for lightweight client-side routing.

**Data Storage**: PostgreSQL database storing products (15 total: 9 gaming, 3 subscriptions, 3 social media), reviews, announcements, blog posts, site settings, and social links. Data is served via API endpoints.

**Type Safety**: Zod schemas for runtime validation of product and review data structures, ensuring type safety across the client-server boundary.

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API with two primary endpoints:
- `GET /api/products` - Returns list of gaming products
- `GET /api/reviews` - Returns customer reviews

**Development Server**: Vite middleware integration for hot module replacement (HMR) during development.

**Static Asset Serving**: Express static middleware serves assets from `attached_assets` folder and root directory in development. In production, the built frontend is served from `dist/public`.

**Error Handling**: Centralized error handling middleware that captures errors and returns appropriate HTTP status codes.

### Database Architecture

**ORM**: Drizzle ORM configured for PostgreSQL via Neon serverless driver.

**Schema Definition**: TypeScript-first schema definitions in `shared/schema.ts` with Zod validation schemas mirroring the database structure.

**Migration Strategy**: Drizzle Kit manages schema migrations with output to `./migrations` directory.

**Connection**: PostgreSQL database connection via `DATABASE_URL` environment variable, using Neon's serverless driver for edge compatibility.

**Current State**: PostgreSQL database is actively used with 15 products across 3 categories, complete with pricing tiers, reviews, blog posts, and site configuration.

### Deployment Architecture

**Static Frontend Deployment**: Configured for deployment to Vercel and Netlify as a static site. Build output goes to `dist/public`.

**Serverless Functions**: Netlify function handler (`netlify/functions/server.js`) wraps the Express app for serverless deployment. Lambda-compatible server entry point available at `server/server-lambda.ts`.

**Build Process**: Vite builds the frontend React application, and esbuild bundles the Node.js backend into ESM format for production.

**Environment Separation**: Development uses Vite dev server with HMR. Production serves pre-built static assets.

### Internationalization

**Bilingual Support**: Component-level language switching between English and Arabic via `isArabic` prop throughout the application. No external i18n library; translations are inline within components.

### Third-Party Integration Design

**WhatsApp Integration**: Direct link generation for customer communication. Each product card and several CTA sections generate pre-filled WhatsApp messages with product details and customer inquiries.

**Analytics**: Vercel Analytics integration for tracking user behavior and site performance.

**Google Services**: Google Tag Manager and Google Analytics (GA4) configured via `gtag.js` for conversion tracking and user analytics.

**SEO**: Comprehensive meta tags for Open Graph (Facebook), Twitter Cards, and standard SEO elements. Robots.txt and sitemap.xml configured for search engine crawling.

### Design System

**Component Library**: Extensive Shadcn/ui component collection including accordions, alerts, avatars, badges, buttons, cards, carousels, charts, checkboxes, dialogs, dropdowns, forms, inputs, modals, navigation menus, popovers, progress bars, radio groups, scrollbars, selects, separators, sheets, sidebars, skeletons, sliders, switches, tables, tabs, textareas, toasts, toggles, and tooltips.

**Theme Variables**: CSS custom properties define a complete color system with support for card borders, button outlines, elevation states, and semantic colors (primary, secondary, accent, destructive, muted).

**Responsive Design**: Mobile-first approach with Tailwind's responsive modifiers. Custom hook `useIsMobile` detects screen size below 768px breakpoint.

**Hover/Active States**: Utility classes `hover-elevate` and `active-elevate-2` provide consistent interaction feedback across interactive elements.

## External Dependencies

### Core Dependencies

- **React Ecosystem**: React 18, React DOM, React Router (via Wouter)
- **State Management**: TanStack Query v5 for server state
- **Form Handling**: React Hook Form with Hookform Resolvers and Zod validation
- **UI Components**: Radix UI primitives (20+ component packages)
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer, class-variance-authority, clsx, tailwind-merge
- **Icons**: Lucide React, React Icons (for Facebook icon)

### Backend Dependencies

- **Server**: Express.js
- **Database**: Drizzle ORM, Neon Serverless PostgreSQL driver
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions
- **Utilities**: date-fns for date manipulation

### Build Tools

- **Bundlers**: Vite for frontend, esbuild for backend
- **TypeScript**: Full TypeScript support across frontend and backend
- **Development**: tsx for running TypeScript directly

### Third-Party Services

- **Analytics**: Vercel Analytics, Google Analytics 4
- **Communication**: WhatsApp Business API (link-based integration)
- **Database**: Neon PostgreSQL (serverless)
- **Deployment Platforms**: Vercel, Netlify
- **CDN**: Google Fonts (Inter/Poppins), Google Tag Manager

### Development Tools

- **Schema Management**: Drizzle Kit for migrations
- **API Tools**: Serverless HTTP (for Netlify functions)
- **Type Generation**: Drizzle Zod for deriving Zod schemas from Drizzle tables