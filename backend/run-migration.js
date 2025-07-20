#!/usr/bin/env node

import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
  }
});

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log("🚀 Starting database migration...");

    // Read the migration file
    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_initial_schema.sql"
    );
    const migrationSQL = fs.readFileSync(migrationPath, "utf8");

    console.log("📖 Reading migration file...");

    // Execute the migration
    console.log("⚡ Executing migration...");
    await client.query(migrationSQL);

    console.log("✅ Migration completed successfully!");
    console.log(
      "📊 Database schema has been created with all necessary tables."
    );

    // Verify tables were created
    console.log("\n🔍 Verifying tables...");
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log(`📋 Found ${result.rows.length} tables:`);
    result.rows.forEach((row, index) => {
      console.log(`   ${index + 1}. ${row.table_name}`);
    });
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Check if environment variables are set
function validateEnvironment() {
  const required = ["DB_USER", "DB_HOST", "DB_NAME", "DB_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("\nPlease set these variables in your .env file");
    process.exit(1);
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  validateEnvironment();
  runMigration();
}

export { runMigration };
