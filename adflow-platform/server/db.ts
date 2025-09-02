
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, text, timestamp, varchar, boolean, integer } from 'drizzle-orm/pg-core';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/adflow';
const sql = postgres(connectionString);
export const db = drizzle(sql);

// Sessions table for express-session
export const sessions = pgTable('sessions', {
  sid: varchar('sid', { length: 255 }).primaryKey(),
  sess: text('sess').notNull(),
  expire: timestamp('expire').notNull(),
});

// Users table
export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  profileImage: text('profile_image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: varchar('id', { length: 255 }).primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  platform: varchar('platform', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  budget: integer('budget').default(0),
  spend: integer('spend').default(0),
  impressions: integer('impressions').default(0),
  clicks: integer('clicks').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Initialize database
export async function initDatabase() {
  try {
    // Create sessions table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        sid VARCHAR(255) PRIMARY KEY,
        sess TEXT NOT NULL,
        expire TIMESTAMP NOT NULL
      )
    `;

    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create campaigns table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        platform VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'draft',
        budget INTEGER DEFAULT 0,
        spend INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}
