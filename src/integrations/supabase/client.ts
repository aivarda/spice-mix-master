
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rerfghtchrakecxcyima.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlcmZnaHRjaHJha2VjeGN5aW1hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5NzYyMzcsImV4cCI6MjA1NzU1MjIzN30.VRlKuouxLv7ZfAYZIKS7viO_MKZE6fOsh938oLozXh4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Extended client with custom types
type ExtendedDatabase = Database & {
  public: {
    Tables: {
      processes: {
        Row: {
          id: string;
          name: string;
          type: 'pre-production' | 'production';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: 'pre-production' | 'production';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: 'pre-production' | 'production';
          created_at?: string;
          updated_at?: string;
        };
      };
      production_status: {
        Row: {
          id: string;
          month: string;
          year: number;
          process: string;
          raw_material_id: string;
          opening_balance: number;
          assigned: number;
          completed: number;
          wastage: number;
          pending: number;
          adjustment: number;
          closing_balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          month: string;
          year: number;
          process: string;
          raw_material_id: string;
          opening_balance?: number;
          assigned?: number;
          completed?: number;
          wastage?: number;
          pending?: number;
          adjustment?: number;
          closing_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          month?: string;
          year?: number;
          process?: string;
          raw_material_id?: string;
          opening_balance?: number;
          assigned?: number;
          completed?: number;
          wastage?: number;
          pending?: number;
          adjustment?: number;
          closing_balance?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    } & Database['public']['Tables'];
  };
};

export const supabase = createClient<ExtendedDatabase>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
