import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = supabaseConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

export async function createListingSubmission(payload) {
  if (!supabase) return { data: null, error: null, mode: 'local' };

  const { data, error } = await supabase
    .from('listings')
    .insert({ ...payload, status: 'pending' })
    .select('id, url, name, category, description, current_bid, status, created_at')
    .single();

  return { data, error, mode: 'supabase' };
}

export async function fetchApprovedListings() {
  if (!supabase) return { data: null, error: null, mode: 'local' };

  const { data, error } = await supabase
    .from('listings')
    .select('id, url, name, category, description, current_bid, impressions, unique_reach, listing_views, created_at, updated_at')
    .eq('status', 'approved')
    .order('current_bid', { ascending: false });

  return { data, error, mode: 'supabase' };
}

export async function incrementHomepageView() {
  if (!supabase) return { data: null, error: null, mode: 'local' };
  const { data, error } = await supabase.rpc('increment_homepage_view');
  return { data, error, mode: 'supabase' };
}

export async function incrementListingView(listingId) {
  if (!supabase || !listingId) return { data: null, error: null, mode: 'local' };
  const { data, error } = await supabase.rpc('increment_listing_view', { target_listing_id: listingId });
  return { data, error, mode: 'supabase' };
}
