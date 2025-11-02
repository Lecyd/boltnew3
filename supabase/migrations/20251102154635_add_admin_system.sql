/*
  # Add Admin System

  ## Overview
  Adds authentication and authorization for the admin panel, allowing administrators
  to manage artifacts and 3D galleries with full CRUD operations.

  ## New Tables

  ### 1. `admin_users`
  Store admin credentials
  - `id` (uuid, primary key)
  - `email` (text, unique) - Admin email
  - `password_hash` (text) - Hashed password
  - `name` (text) - Admin display name
  - `created_at` (timestamptz)

  ### 2. `admin_sessions`
  Track admin login sessions
  - `id` (uuid, primary key)
  - `admin_user_id` (uuid, foreign key)
  - `token` (text, unique) - Session token
  - `expires_at` (timestamptz) - Expiration time
  - `created_at` (timestamptz)

  ## Updates to Existing Tables
  
  ### Collections
  - Add `category` field for organization
  - Add `audio_description_url` field for audio descriptions

  ### Artifacts
  - Add `category` field for categorization
  - Add `label` field for display name

  ## Security
  - Enable RLS on all admin tables
  - Add service role policies for CRUD operations on collections and artifacts
  - Admin operations require valid session token
*/

-- Add new fields to collections
ALTER TABLE collections ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS audio_description_url text;

-- Add new fields to artifacts
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS category text;
ALTER TABLE artifacts ADD COLUMN IF NOT EXISTS label text;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL DEFAULT 'Admin',
  created_at timestamptz DEFAULT now()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_admin_user ON admin_sessions(admin_user_id);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Admin write policies for collections
CREATE POLICY "Service role can insert collections"
  ON collections FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update collections"
  ON collections FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete collections"
  ON collections FOR DELETE
  TO service_role
  USING (true);

-- Admin write policies for artifacts
CREATE POLICY "Service role can insert artifacts"
  ON artifacts FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update artifacts"
  ON artifacts FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete artifacts"
  ON artifacts FOR DELETE
  TO service_role
  USING (true);

-- Insert default admin user
-- Email: admin@museum.com
-- Password: admin123 (CHANGE THIS IN PRODUCTION!)
-- Password hash is bcrypt hash of 'admin123'
INSERT INTO admin_users (email, password_hash, name)
VALUES ('admin@museum.com', '$2a$10$rXKhPvQc5YmVqC.FzM3LGuJ6z8bXVJ.WxJ1S4ZCxXvQnvxYF5YUHG', 'Administrateur')
ON CONFLICT (email) DO NOTHING;
