import pg from "pg";
const { Pool } = pg;
import dotenv from "dotenv";
// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Custom database query function
async function queryDB(text, params) {
    try {
      const result = await pool.query(text, params);
      return result; // Return the result data
    } catch (error) {
      console.error('Error executing the query:', error);
      throw error; // Re-throw the error for handling at a higher level
    }
  }

export { pool, queryDB };
