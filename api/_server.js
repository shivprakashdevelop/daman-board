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
