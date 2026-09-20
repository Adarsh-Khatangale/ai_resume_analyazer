import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-supabase-url') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Trigger Google OAuth via Supabase.
 * This redirects to Google Sign-In with "Choose an account to continue to <project>.supabase.co"
 */
export const signInWithGoogleViaSupabase = async () => {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) throw error;
  return data;
};

/**
 * Sign in with email and password via Supabase
 */
export const signInWithEmailViaSupabase = async (email, password) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

/**
 * Sign up with email and password via Supabase
 */
export const signUpWithEmailViaSupabase = async (name, email, password) => {
  if (!supabase) throw new Error('Supabase is not configured.');
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        name: name,
      },
    },
  });
  if (error) throw error;
  return data;
};

/**
 * Sign out via Supabase
 */
export const signOutViaSupabase = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};
