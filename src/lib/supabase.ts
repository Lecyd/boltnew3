import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Collection = {
  id: string;
  name: string;
  slug: string;
  description: string;
  theme: string;
  cover_image: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Artifact = {
  id: string;
  collection_id: string;
  title: string;
  description: string;
  origin: string | null;
  period: string | null;
  image_url: string | null;
  model_3d_url: string | null;
  audio_guide_url: string | null;
  video_url: string | null;
  position_x: number;
  position_y: number;
  position_z: number;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Quiz = {
  id: string;
  collection_id: string;
  title: string;
  questions: QuizQuestion[];
  created_at: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  correct: number;
};
