import { neon } from "@neondatabase/serverless";

import { drizzle } from "drizzle-orm/node-postgres";

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

// Initialize the database connection
const sql = neon(process.env.NEON_DATABASE_URL!);
const db = drizzle(sql);


export default db;
