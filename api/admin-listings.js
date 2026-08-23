import { json, readBody, requireAdmin } from './_server.js';

export default async function handler(req, res) {
  const context = await requireAdmin(req, res);
  if (!context) return;
  try {
    if (req.method === 'GET') {
      const {data, error} = await context.admin.from('listings').select('id, url, name, category, description, owner_name, owner_contact, current_bid, status, moderation_note, created_at').order('created_at', {ascending: false});
      if (error) throw error;
      return json(res, 200, {listings: data});
    }
    if (req.method === 'PATCH') {
      const body = await readBody(req);
      if (!body.id) return json(res, 400, {error: 'Listing id is required.'});
      const updates = {updated_at: new Date().toISOString()};
      if (body.status !== undefined) {
        if (!['approved', 'rejected', 'paused', 'pending'].includes(body.status)) return json(res, 400, {error: 'Invalid moderation update.'});
        updates.status = body.status;
        updates.moderation_note = body.note || null;
      }
      for (const field of ['url', 'name', 'category', 'description', 'owner_name', 'owner_contact']) if (typeof body[field] === 'string' && body[field].trim()) updates[field] = body[field].trim();
      if (body.amount !== undefined && Number.isInteger(body.amount) && body.amount >= 29) updates.current_bid = body.amount;
      const {data, error} = await context.admin.from('listings').update(updates).eq('id', body.id).select('id, url, name, category, description, owner_name, owner_contact, current_bid, status, moderation_note, created_at').single();
      if (error) throw error;
      await context.admin.from('listing_events').insert({listing_id: body.id, event_type: body.status === 'approved' ? 'approved' : body.status === 'rejected' ? 'rejected' : 'submitted', metadata: {moderator_id: context.user.id, note: body.note || null}});
      return json(res, 200, {listing: data});
    }
    if (req.method === 'DELETE') {
      const body = await readBody(req);
      if (!body.id) return json(res, 400, {error: 'Listing id is required.'});
      const {error} = await context.admin.from('listings').delete().eq('id', body.id);
      if (error) throw error;
      return json(res, 200, {ok: true});
    }
    return json(res, 405, {error: 'Method not allowed'});
  } catch (error) { return json(res, 500, {error: error.message || 'Admin request failed.'}); }
}
