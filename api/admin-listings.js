import { json, readBody, requireAdmin } from './_server.js';

export default async function handler(req, res) {
  const context = await requireAdmin(req, res);
  if (!context) return;
  try {
    if (req.method === 'GET') {
      const {data, error} = await context.admin.from('listings').select('id, url, name, category, description, owner_name, owner_contact, current_bid, status, moderation_note, created_at').in('status', ['pending', 'rejected', 'paused']).order('created_at', {ascending: false});
      if (error) throw error;
      return json(res, 200, {listings: data});
    }
    if (req.method === 'PATCH') {
      const body = await readBody(req);
      if (!body.id || !['approved', 'rejected', 'paused', 'pending'].includes(body.status)) return json(res, 400, {error: 'Invalid moderation update.'});
      const {data, error} = await context.admin.from('listings').update({status: body.status, moderation_note: body.note || null, updated_at: new Date().toISOString()}).eq('id', body.id).select('id, status, moderation_note').single();
      if (error) throw error;
      await context.admin.from('listing_events').insert({listing_id: body.id, event_type: body.status === 'approved' ? 'approved' : body.status === 'rejected' ? 'rejected' : 'submitted', metadata: {moderator_id: context.user.id, note: body.note || null}});
      return json(res, 200, {listing: data});
    }
    return json(res, 405, {error: 'Method not allowed'});
  } catch (error) { return json(res, 500, {error: error.message || 'Admin request failed.'}); }
}
