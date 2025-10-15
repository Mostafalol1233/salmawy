# Slamawy Store - Design Guidelines

## Design Approach
**Reference-Based**: Inspired by Amazon's e-commerce patterns combined with Discord's dark aesthetic and modern gaming UI trends. The design prioritizes clean product presentation with eye-catching anime aesthetics.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: `222 14% 6%` (Deep charcoal #0f0f0f)
- Surface: `222 14% 10%` (Card backgrounds)
- Electric Blue (Discord-style): `235 86% 65%` (#5865F2)
- Text Primary: `0 0% 98%`
- Text Secondary: `0 0% 70%`

**Accent Colors:**
- Success Green: `142 76% 45%` (For WhatsApp buttons)
- Glow Effect: Electric blue with opacity for animated backgrounds

### B. Typography

**Font Stack:**
- Primary: 'Inter' or 'Poppins' from Google Fonts
- Headings: Bold (600-700 weight)
- Body: Regular (400 weight)
- Hero Banner: Extra Bold (800 weight), 3xl to 5xl

**Sizes:**
- Hero Title: text-4xl md:text-5xl
- Section Headers: text-2xl md:text-3xl
- Product Titles: text-lg font-semibold
- Body Text: text-base
- Button Text: text-sm font-medium

### C. Layout System

**Spacing Units:** Tailwind units of 4, 6, 8, 12, 16, 24
- Section padding: py-16 md:py-24
- Card padding: p-6
- Button padding: px-6 py-3
- Grid gaps: gap-6 md:gap-8

**Container:**
- Max width: max-w-7xl mx-auto
- Side padding: px-4 md:px-6

### D. Component Library

**Hero Section:**
- Full viewport height with anime-style illustration background
- 3 character composition (male center, 2 females on sides)
- Glowing animated background using gradients/blur effects
- Centered banner text with fire emoji
- Primary CTA button (Shop Now)
- Language toggle button (top-right corner)

**Product Cards (Amazon-style):**
- Grid layout: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Card structure: Image top, title, pill-style amount selectors, WhatsApp button
- Hover effect: Subtle lift with shadow
- Amount selectors: Horizontal pills with active state in electric blue
- WhatsApp button: Green background with icon

**Games to Include:**
- CrossFire (5K, 10K, 20K, 50K ZP)
- Free Fire (100, 310, 520, 1060 Diamonds)
- PUBG Mobile (60, 325, 660, 1800 UC)
- Valorant (475, 1000, 2050, 3650 VP)
- Plus 3-4 additional games (Genshin Impact, League of Legends, Fortnite, etc.)

**Request Card:**
- Prominent card with Discord Nitro mention
- WhatsApp button with pre-filled message template
- Icon or illustration

**Trusted Section:**
- Star ratings display (5-star system)
- Customer names only, no text reviews
- Avatar placeholders or icons
- Grid layout for multiple reviews

**About/Contact:**
- Seller info with tagline "Guaranteed by everyone 💌🕸"
- Social links (Facebook, WhatsApp) with icons
- Clean information presentation

**Footer:**
- Contact numbers prominently displayed
- Social media icons (Facebook, WhatsApp)
- Copyright: "© 2025 Slamawy Store"
- Dark background with lighter text

### E. Animations

**Background Glow:**
- Animated radial gradients
- Pulsing electric blue effects
- Smooth CSS animations (3-5s duration)

**Interactions:**
- Card hover: transform scale-105 with shadow
- Button hover: Brightness increase
- Smooth transitions: transition-all duration-300

## Images

**Hero Background Image:**
- Large full-width anime-style illustration
- 3 characters arranged: Male protagonist (center), 2 female characters (left/right sides)
- Gaming/tech aesthetic with glowing elements
- Recommended size: 1920x1080px minimum
- Placement: Background of hero section with overlay gradient

**Product Images:**
- Game card thumbnails for each product
- Square aspect ratio (1:1)
- High quality logos/artwork for each game
- Size: 300x300px minimum

## Functional Requirements

**WhatsApp Integration:**
- Pre-filled message format: "Hi, I want to buy [Game] - [Amount] [Currency]"
- Request section message: "Hi, is Discord Nitro or another card available right now?"
- Opens in new tab with whatsapp://send or web.whatsapp.com

**Language Toggle:**
- Button positioned top-right of hero
- Icon: 🌐 with "Translate to Arabic"
- Toggles all text content between English/Arabic
- Maintains right-to-left layout for Arabic

**Responsive Behavior:**
- Mobile: Single column product grid, stacked sections
- Tablet: 2-column product grid
- Desktop: 3-4 column product grid
- Hero adjusts text size and spacing per breakpoint