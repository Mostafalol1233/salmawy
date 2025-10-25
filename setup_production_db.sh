#!/bin/bash

# Production Database Setup Script for Slamawy Store
# This script will set up your production database with all tables and data

echo "🚀 Starting Production Database Setup..."
echo ""

# Set your production database URL
export DATABASE_URL="postgresql://neondb_owner:npg_eh1SxUO0tdbD@ep-aged-night-ad7ixcm6-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

echo "✅ Database URL configured"
echo ""

# Step 1: Create database tables
echo "📋 Step 1/3: Creating database tables..."
npm run db:push
echo ""

# Step 2: Add all products (subscriptions & social media)
echo "🛍️  Step 2/3: Adding products (subscriptions & social media services)..."
node create_sample_products.js
echo ""

# Step 3: Create admin account
echo "👤 Step 3/3: Creating admin account..."
node create_admin.js
echo ""

echo "✨ Production database setup complete!"
echo ""
echo "📝 Your admin credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "🌐 You can now deploy to Vercel!"
