// lib/db.ts
import { neon } from '@neondatabase/serverless';

let sql: ReturnType<typeof neon> | null = null;

export default async function getDbConnection() {
  console.log("Attempting to connect to NeonDB");
  if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL environment variable is not defined.");
    throw new Error("DATABASE_URL environment variable is not defined");
  }

  if (!sql) {
    try {
      sql = neon(process.env.DATABASE_URL);
      console.log("Successfully connected to NeonDB");
    } catch (error) {
      console.error("Error connecting to NeonDB:", error);
      throw error;
    }
  } else {
    console.log("Reusing existing NeonDB connection");
  }

  return sql;
}