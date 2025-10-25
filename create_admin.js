import { neon } from "@neondatabase/serverless";

async function createAdmin() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    // Check if admin exists
    const existingAdmin = await sql`SELECT * FROM admins WHERE username = 'admin'`;
    
    if (existingAdmin.length > 0) {
      console.log("Admin account already exists!");
      console.log("Username: admin");
      console.log("Password: admin123");
      return;
    }
    
    // Create admin account
    await sql`INSERT INTO admins (username, password) VALUES ('admin', 'admin123')`;
    console.log("Admin account created successfully!");
    console.log("Username: admin");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

createAdmin();
