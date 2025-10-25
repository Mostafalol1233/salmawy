# Slamawy Store - Gaming Cards E-commerce Platform

## Overview

Slamawy Store is an Egyptian-based gaming cards e-commerce platform specializing in digital game currency and gaming cards. The application provides a bilingual (English/Arabic) shopping experience with WhatsApp integration for order processing and customer support. The platform features popular gaming products including PUBG UC, Free Fire Diamonds, Valorant VP, CrossFire ZP, Genshin Impact, League of Legends, Fortnite, Roblox, and Call of Duty cards.

## Recent Changes (October 25, 2025)

- **Blog Functionality**: Added public-facing blog pages at `/blog` (listing) and `/blog/:slug` (individual posts) with markdown support and theme-aware design
- **Product Category Filtering**: Implemented tab-based filtering on the home page allowing users to browse products by category (All, Gaming, Subscriptions, Social Media)
- **Theme-Aware Branding**: Updated all logo displays (HeroSection and AboutSection) to automatically switch between light and dark mode versions
- **Generated Assets**: Created light mode Slamawy brand logo to complement the existing dark mode version

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript and Vite as the build tool.

**UI Library**: Shadcn/ui components built on Radix UI primitives, providing a comprehensive set of accessible, customizable components. The design system follows a dark-mode-first approach inspired by Amazon's e-commerce patterns combined with Discord's dark aesthetic.

**Styling**: Tailwind CSS with custom theme configuration supporting both light and dark modes. The color palette emphasizes deep charcoal backgrounds (`#0f0f0f`), electric blue accents (`#5865F2`), and success green for WhatsApp integration.

**State Management**: TanStack Query (React Query) for server state management and data fetching. Local state is managed with React hooks.

**Routing**: Wouter for lightweight client-side routing.

**Data Storage**: In-memory storage pattern using a `MemStorage` class that implements the `IStorage` interface. Products and reviews are stored in memory and served via API endpoints.

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

**Note**: Currently using in-memory storage, but the infrastructure is prepared for PostgreSQL integration when needed.

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