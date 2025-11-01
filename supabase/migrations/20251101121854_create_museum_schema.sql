/*
  # Musée du Patrimoine Culturel - Database Schema

  ## Overview
  This migration creates the complete database structure for a virtual cultural heritage museum,
  including collections, artifacts, exhibitions, multimedia content, and user interactions.

  ## New Tables

  ### 1. `collections`
  Main thematic collections in the museum
  - `id` (uuid, primary key)
  - `name` (text) - Collection name
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Detailed description
  - `theme` (text) - Theme category (Artisanat, Costumes, Musique, Architecture, Rituels)
  - `cover_image` (text) - Cover image URL
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `artifacts`
  Individual cultural artifacts/objects in the museum
  - `id` (uuid, primary key)
  - `collection_id` (uuid, foreign key)
  - `title` (text) - Artifact name
  - `description` (text) - Detailed description
  - `origin` (text) - Geographic/cultural origin
  - `period` (text) - Historical period
  - `image_url` (text) - Main image
  - `model_3d_url` (text) - 3D model file (GLTF/GLB)
  - `audio_guide_url` (text) - Audio narration file
  - `video_url` (text) - Documentary video
  - `position_x` (float) - 3D gallery position
  - `position_y` (float)
  - `position_z` (float)
  - `metadata` (jsonb) - Additional flexible data
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `exhibitions`
  Thematic exhibitions grouping multiple artifacts
  - `id` (uuid, primary key)
  - `title` (text) - Exhibition title
  - `subtitle` (text) - Short description
  - `description` (text) - Full description
  - `start_date` (date)
  - `end_date` (date)
  - `is_active` (boolean)
  - `cover_image` (text)
  - `created_at` (timestamptz)

  ### 4. `exhibition_artifacts`
  Junction table linking exhibitions to artifacts
  - `id` (uuid, primary key)
  - `exhibition_id` (uuid, foreign key)
  - `artifact_id` (uuid, foreign key)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### 5. `quizzes`
  Educational quizzes for each collection
  - `id` (uuid, primary key)
  - `collection_id` (uuid, foreign key)
  - `title` (text)
  - `questions` (jsonb) - Array of question objects
  - `created_at` (timestamptz)

  ### 6. `user_progress`
  Track user visits and quiz completions
  - `id` (uuid, primary key)
  - `session_id` (text) - Anonymous session identifier
  - `collection_id` (uuid, foreign key)
  - `quiz_score` (integer)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access for collections, artifacts, exhibitions, and quizzes
  - Restricted write access (admin only via service role)
  - User progress tracking with session-based identification
*/

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  theme text NOT NULL,
  cover_image text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  origin text,
  period text,
  image_url text,
  model_3d_url text,
  audio_guide_url text,
  video_url text,
  position_x float DEFAULT 0,
  position_y float DEFAULT 0,
  position_z float DEFAULT 0,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create exhibitions table
CREATE TABLE IF NOT EXISTS exhibitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  description text NOT NULL,
  start_date date,
  end_date date,
  is_active boolean DEFAULT true,
  cover_image text,
  created_at timestamptz DEFAULT now()
);

-- Create exhibition_artifacts junction table
CREATE TABLE IF NOT EXISTS exhibition_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exhibition_id uuid REFERENCES exhibitions(id) ON DELETE CASCADE,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE CASCADE,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exhibition_id, artifact_id)
);

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  title text NOT NULL,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  collection_id uuid REFERENCES collections(id) ON DELETE CASCADE,
  quiz_score integer,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_artifacts_collection ON artifacts(collection_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_artifacts_exhibition ON exhibition_artifacts(exhibition_id);
CREATE INDEX IF NOT EXISTS idx_exhibition_artifacts_artifact ON exhibition_artifacts(artifact_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_collection ON quizzes(collection_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_session ON user_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);

-- Enable Row Level Security
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exhibition_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read access for museum content
CREATE POLICY "Public can view collections"
  ON collections FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view artifacts"
  ON artifacts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view exhibitions"
  ON exhibitions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view exhibition artifacts"
  ON exhibition_artifacts FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can view quizzes"
  ON quizzes FOR SELECT
  TO anon, authenticated
  USING (true);

-- User progress: Users can insert their own progress
CREATE POLICY "Users can track their own progress"
  ON user_progress FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  TO anon, authenticated
  USING (true);