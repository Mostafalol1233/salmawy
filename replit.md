# Slamawy Store - Gaming Cards E-commerce

A modern, single-page gaming card store built with React, TypeScript, and Tailwind CSS featuring a dark theme with electric blue accents.

## Project Overview

Slamawy Store is a gaming card marketplace that allows customers to purchase in-game currencies for popular games like PUBG, Free Fire, CrossFire, Valorant, and more through WhatsApp.

## Key Features

- **Anime-Style Hero Section**: Full-screen hero with animated glowing background
- **Product Catalog**: 7+ gaming cards (CrossFire, Free Fire, PUBG Mobile, Valorant, Genshin Impact, League of Legends, Fortnite)
- **WhatsApp Integration**: Direct purchase via WhatsApp with pre-filled messages
- **Bilingual Support**: Toggle between English and Arabic
- **Custom Request Section**: For Discord Nitro and other unlisted products
- **Customer Reviews**: Trusted customer section with star ratings
- **Fully Responsive**: Mobile-first design with beautiful breakpoints

## Configuration

### WhatsApp Phone Number

The store's WhatsApp contact number is configured in `client/src/pages/Home.tsx`:

```typescript
const whatsappNumber = "201234567890"; // Update this with your actual number
```

**To update:**
1. Open `client/src/pages/Home.tsx`
2. Change the `whatsappNumber` constant (line ~121)
3. Use international format without `+` or spaces (e.g., "201234567890" for +20 123 456 7890)

This number is used for:
- Product purchase links
- Custom request inquiries
- About section contact button
- Footer contact links

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Icons**: Lucide React
- **Backend**: Express.js (minimal API)
- **Storage**: In-memory storage

## Design System

- **Theme**: Dark mode with electric blue (#5865F2) primary color
- **Background**: Deep charcoal (#0f0f0f)
- **Typography**: Inter + Poppins fonts
- **Components**: Shadcn/ui with custom elevation system
- **Animations**: Glowing background effects, smooth transitions

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── HeroSection.tsx       # Hero with animated background
│   │   ├── ProductCard.tsx        # Individual product card
│   │   ├── RequestSection.tsx     # Custom request card
│   │   ├── ReviewCard.tsx         # Customer review display
│   │   ├── AboutSection.tsx       # Store information
│   │   └── Footer.tsx             # Footer with contacts
│   ├── pages/
│   │   └── Home.tsx               # Main landing page
│   └── index.css                  # Global styles + animations
server/
├── routes.ts                      # API endpoints
└── storage.ts                     # Data storage interface
shared/
└── schema.ts                      # TypeScript interfaces
```

## Development

The application runs with a single command:
```bash
npm run dev
```

This starts both the Express backend (port 5000) and Vite frontend in development mode.

## User Journey

1. **Landing**: User arrives at hero section with stunning anime-style background
2. **Browse**: Click "Shop Now" to smoothly scroll to products
3. **Select**: Choose game and amount using pill-style selectors
4. **Purchase**: Click "Buy via WhatsApp" - opens WhatsApp with pre-filled message
5. **Custom Request**: Can ask for Discord Nitro or other cards via dedicated section
6. **Trust Signals**: View customer reviews and guarantee badges
7. **Contact**: Multiple WhatsApp/Facebook touchpoints in About and Footer

## Responsive Design

- **Mobile** (< 640px): Single column, stacked layout
- **Tablet** (640-1024px): 2-column product grid
- **Desktop** (1024-1280px): 3-column product grid  
- **Large** (> 1280px): 4-column product grid

## Recent Changes

- Replaced all emoji with lucide-react icons (Globe, Flame, Heart, Globe2)
- Fixed WhatsApp integration with proper phone number deep linking
- Removed custom hover states, using Shadcn elevation system
- Added bilingual support (English/Arabic)
- Generated all product images using AI
- Implemented beautiful loading states with skeleton loaders

## Future Enhancements

- Shopping cart for multi-item purchases
- Payment gateway integration (Stripe/PayPal)
- Order tracking system
- Admin dashboard for product management
- Customer accounts and order history
- Real-time pricing updates via API

## Notes

- The site uses dark mode by default (`class="dark"` on HTML element)
- All WhatsApp links use `https://wa.me/{phone}?text={message}` format
- Product data is static in frontend with API structure ready for backend
- Images are AI-generated and stored in `attached_assets/generated_images/`
