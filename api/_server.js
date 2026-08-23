import { createClient } from '@supabase/supabase-js';

export function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').end(JSON.stringify(body));
}

export function readBody(req) {
  if (req.body && typeof req.body === 'object') return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch (error) { reject(error); } });
    req.on('error', reject);
  });
}

export function adminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  // Supabase now exposes `secret` keys alongside the legacy service-role key.
  // Both are server-only and bypass RLS for trusted API handlers.
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server environment is not configured.');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export function requirePost(req, res) {
  if (req.method !== 'POST') { json(res, 405, {error: 'Method not allowed'}); return false; }
  return true;
}

export async function requireAdmin(req, res) {
  const authorization = req.headers.authorization || '';
  const accessToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!accessToken) { json(res, 401, {error: 'Admin sign-in required.'}); return null; }
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !publishableKey) { json(res, 500, {error: 'Supabase public environment is not configured.'}); return null; }
  const publicClient = createClient(url, publishableKey, {auth: {autoRefreshToken: false, persistSession: false}});
  const {data: {user}, error: userError} = await publicClient.auth.getUser(accessToken);
  if (userError || !user) { json(res, 401, {error: 'Admin session is invalid.'}); return null; }
  const admin = adminClient();
  const {data: profile} = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  const allowedEmails = (process.env.ADMIN_EMAILS || '').split(',').map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (profile?.role !== 'admin' && !allowedEmails.includes((user.email || '').toLowerCase())) { json(res, 403, {error: 'This account is not an admin.'}); return null; }
  return {user, admin};
}
