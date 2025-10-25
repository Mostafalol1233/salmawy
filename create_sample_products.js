import { neon } from "@neondatabase/serverless";

async function createSampleProducts() {
  const sql = neon(process.env.DATABASE_URL);
  
  const sampleProducts = [
    // Subscription Products
    {
      name: "Discord Nitro",
      currency: "USD",
      image: "https://ui-avatars.com/api/?name=Discord+Nitro&size=300&background=5865F2&color=fff&bold=true",
      category: "subscriptions",
      description: "Premium Discord subscription with enhanced features",
      isActive: true,
      prices: [
        { value: 1, label: "Basic - 1 Month", price: "9.99" },
        { value: 12, label: "Basic - 1 Year", price: "99.99" },
        { value: 1, label: "Nitro - 1 Month", price: "14.99" }
      ]
    },
    {
      name: "ChatGPT Plus",
      currency: "USD",
      image: "https://ui-avatars.com/api/?name=ChatGPT+Plus&size=300&background=10a37f&color=fff&bold=true",
      category: "subscriptions",
      description: "Advanced AI assistant with GPT-4 access",
      isActive: true,
      prices: [
        { value: 1, label: "Monthly", price: "20.00" },
        { value: 12, label: "Annual", price: "200.00" }
      ]
    },
    {
      name: "Spotify Premium",
      currency: "USD",
      image: "https://ui-avatars.com/api/?name=Spotify&size=300&background=1DB954&color=fff&bold=true",
      category: "subscriptions",
      description: "Ad-free music streaming with offline downloads",
      isActive: true,
      prices: [
        { value: 1, label: "Individual - 1 Month", price: "10.99" },
        { value: 6, label: "Individual - 6 Months", price: "59.99" },
        { value: 12, label: "Individual - 1 Year", price: "109.99" }
      ]
    },
    // Social Media Products
    {
      name: "Instagram Followers",
      currency: "Followers",
      image: "https://ui-avatars.com/api/?name=Instagram&size=300&background=E4405F&color=fff&bold=true",
      category: "social_media",
      description: "Boost your Instagram presence with real followers",
      isActive: true,
      prices: [
        { value: 1000, label: "1,000 Followers", price: "15.99" },
        { value: 5000, label: "5,000 Followers", price: "59.99" },
        { value: 10000, label: "10,000 Followers", price: "99.99" }
      ]
    },
    {
      name: "TikTok Likes",
      currency: "Likes",
      image: "https://ui-avatars.com/api/?name=TikTok&size=300&background=000000&color=00f2ea&bold=true",
      category: "social_media",
      description: "Increase engagement on your TikTok videos",
      isActive: true,
      prices: [
        { value: 500, label: "500 Likes", price: "9.99" },
        { value: 1000, label: "1,000 Likes", price: "16.99" },
        { value: 5000, label: "5,000 Likes", price: "69.99" }
      ]
    },
    {
      name: "YouTube Views",
      currency: "Views",
      image: "https://ui-avatars.com/api/?name=YouTube&size=300&background=FF0000&color=fff&bold=true",
      category: "social_media",
      description: "Grow your YouTube channel with authentic views",
      isActive: true,
      prices: [
        { value: 1000, label: "1,000 Views", price: "12.99" },
        { value: 10000, label: "10,000 Views", price: "89.99" },
        { value: 50000, label: "50,000 Views", price: "349.99" }
      ]
    }
  ];

  try {
    console.log("Creating sample products...\n");

    for (const product of sampleProducts) {
      // Check if product already exists
      const existing = await sql`SELECT * FROM products WHERE name = ${product.name}`;
      
      if (existing.length > 0) {
        console.log(`✓ Product "${product.name}" already exists, skipping...`);
        continue;
      }

      // Insert product
      const [newProduct] = await sql`
        INSERT INTO products (name, currency, image, category, description, is_active)
        VALUES (${product.name}, ${product.currency}, ${product.image}, ${product.category}, ${product.description}, ${product.isActive})
        RETURNING id
      `;

      console.log(`✓ Created product: ${product.name}`);

      // Insert prices for the product
      for (const price of product.prices) {
        await sql`
          INSERT INTO product_prices (product_id, value, label, price)
          VALUES (${newProduct.id}, ${price.value}, ${price.label}, ${price.price})
        `;
      }
      
      console.log(`  Added ${product.prices.length} price tiers`);
    }

    console.log("\n✅ Sample products created successfully!");
    console.log("\nCreated products:");
    console.log("Subscriptions:");
    console.log("  - Discord Nitro (3 tiers)");
    console.log("  - ChatGPT Plus (2 tiers)");
    console.log("  - Spotify Premium (3 tiers)");
    console.log("\nSocial Media:");
    console.log("  - Instagram Followers (3 tiers)");
    console.log("  - TikTok Likes (3 tiers)");
    console.log("  - YouTube Views (3 tiers)");

  } catch (error) {
    console.error("❌ Error creating sample products:", error.message);
    process.exit(1);
  }
}

createSampleProducts();
