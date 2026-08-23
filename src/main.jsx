import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link01Icon, Globe02Icon, GridViewIcon, Search02Icon, OrganicFoodIcon, MinusSignIcon, PlusSignIcon, FireIcon, Store01Icon, Calendar03Icon, Camera01Icon, ToolsIcon, SparklesIcon, ShieldCheckIcon, ViewIcon, Cursor01Icon, Location01Icon, ArrowUp01Icon, HeartAddIcon, Time04Icon, TradeUpIcon, CheckmarkCircle02Icon, ChartLineData01Icon } from '@hugeicons/core-free-icons';
import { createListingSubmission, fetchApprovedListings, supabase, supabaseConfigured } from './lib/supabase';
import { razorpayConfigured, startRazorpayPayment } from './lib/razorpay';
import logoUrl from './assets/logo.png';
import './styles.css';

function AppIcon({icon,size=24,...props}){
  return <HugeiconsIcon icon={icon} size={size} color="currentColor" strokeWidth={1.8} {...props}/>;
}

const formatINR = (value) => new Intl.NumberFormat('en-IN').format(value);
const formatReach = (value) => new Intl.NumberFormat('en-IN', {notation: 'compact', maximumFractionDigits: 1}).format(value);
function mapSupabaseListing(item){
  return {rank: 0, id: item.id, name: item.name, url: item.url, category: item.category, amount: item.current_bid, desc: item.description, clicks: item.unique_reach || 0, impressions: item.impressions || 0, listingViews: item.listing_views || 0, time: 'live', icon: '📍'};
}

function App(){
  const [amount, setAmount] = useState(29);
  const [link, setLink] = useState('');
  const [listingName, setListingName] = useState('');
  const [listingDescription, setListingDescription] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [tab, setTab] = useState(() => new URLSearchParams(window.location.search).get('admin') === '1' ? 'Admin' : 'Board');
  const [claimed, setClaimed] = useState(false);
  const [listingCategory, setListingCategory] = useState('');
  const [boardListings, setBoardListings] = useState([]);
  const [activity, setActivity] = useState([]);
  const [dataMode, setDataMode] = useState(supabaseConfigured ? 'connecting' : 'unavailable');
  const [onlineCount, setOnlineCount] = useState(0);
  useEffect(() => {
    let active = true;
    fetchApprovedListings().then(({data, error, mode}) => {
      if (!active) return;
      if (!error && mode === 'supabase' && data) setBoardListings(data.map(mapSupabaseListing));
      setDataMode(error ? 'error' : mode);
    });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!supabase) return undefined;
    const presenceKey = window.crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase.channel('best-in-daman:presence', {config: {presence: {key: presenceKey}}});
    const updateOnlineCount = () => {
      const state = channel.presenceState();
      setOnlineCount(Object.values(state).reduce((count, visitors) => count + visitors.length, 0));
    };
    channel.on('presence', {event: 'sync'}, updateOnlineCount).subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({online_at: new Date().toISOString()});
        updateOnlineCount();
      }
    });
    return () => { channel.untrack(); supabase.removeChannel(channel); };
  }, []);

  const submitListing = async ({url, bid, category}) => {
    const normalizedUrl = /^https?:\/\//i.test(url) ? url.trim() : `https://${url.trim()}`;
    let parsedUrl;
    try { parsedUrl = new URL(normalizedUrl); } catch { return {ok: false, error: 'Use a valid link.'}; }
    if (!listingName.trim() || !listingDescription.trim() || !ownerName.trim() || !ownerContact.trim()) {
      return {ok: false, error: 'Add the listing name, description, your name, and contact.'};
    }
    if (supabaseConfigured) {
      const {data, error} = await createListingSubmission({
        url: normalizedUrl, name: listingName.trim(), category: category || 'Discovery',
        description: listingDescription.trim(), owner_name: ownerName.trim(), owner_contact: ownerContact.trim(), current_bid: bid
      });
      if (error) return {ok: false, error: error.message || 'We could not submit this listing.'};
      return {ok: true, status: 'pending'};
    }
    return {ok: false, error: 'Supabase is not connected. Please try again after the production database is configured.'};
  };

  const position = useMemo(() => {
    const sorted = [...boardListings, {amount}].sort((a,b)=>b.amount-a.amount);
    return sorted.findIndex(x => x.amount === amount && !x.name) + 1;
  }, [amount, boardListings]);

  const page = {
    Board: <Board listings={boardListings} onlineCount={onlineCount} recentBids={activity} amount={amount} setAmount={setAmount} link={link} setLink={setLink} listingName={listingName} setListingName={setListingName} listingDescription={listingDescription} setListingDescription={setListingDescription} ownerName={ownerName} setOwnerName={setOwnerName} ownerContact={ownerContact} setOwnerContact={setOwnerContact} listingCategory={listingCategory} setListingCategory={setListingCategory} claimed={claimed} setClaimed={setClaimed} position={position} onSubmit={submitListing} dataMode={dataMode} />,
    Stats: <Stats listings={boardListings} recentBids={activity} />,
    About: <AboutPage listings={boardListings} />,
    Rules: <RulesPage />,
    Admin: <AdminPage />
  };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>setTab('Board')} aria-label="Best in Daman home">
        <img src={logoUrl} alt="Best in Daman #1" />
      </button>
      <nav>
        {['Board','Stats','About','Rules'].map(item => <button key={item} className={tab===item?'active':''} onClick={()=>setTab(item)}>{item}</button>)}
      </nav>
    </header>
    {page[tab]}
    <Footer setTab={setTab}/>
  </div>
}

function Board({listings: boardListings, onlineCount, recentBids: boardActivity, amount, setAmount, link, setLink, listingName, setListingName, listingDescription, setListingDescription, ownerName, setOwnerName, ownerContact, setOwnerContact, listingCategory, setListingCategory, claimed, setClaimed, position, onSubmit, dataMode}){
  const [category, setCategory] = useState('All');
  const [openPanel, setOpenPanel] = useState(null);
  const [claimError, setClaimError] = useState('');
  const [showClaimDetails, setShowClaimDetails] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const rankedListings = [...boardListings].sort((a, b) => b.amount - a.amount).map((listing, index) => ({...listing, rank: index + 1}));
  const boardCategories = ['All', ...new Set(rankedListings.map((listing) => listing.category))];
  const categoryIcons = {All: GridViewIcon, Food: OrganicFoodIcon, Event: Calendar03Icon, Service: ToolsIcon, Creator: Camera01Icon, Business: Store01Icon, Community: SparklesIcon, Discovery: Search02Icon};
  const visibleListings = category === 'All' ? rankedListings : rankedListings.filter((listing) => listing.category === category);
  const topThree = visibleListings.slice(0, 3);
  const topTen = visibleListings.slice(3, 10);
  const rest = visibleListings.slice(10);
  const totalViews = boardListings.reduce((sum, listing) => sum + (listing.listingViews || 0), 0);
  const submitClaim = async () => {
    if (!link.trim()) return;
    if (!listingName.trim() || !listingDescription.trim() || !ownerName.trim() || !ownerContact.trim()) {
      setShowClaimDetails(true);
      setClaimError('Add your name, contact, listing name, and a short description to continue.');
      return;
    }
    setClaiming(true);
    let result;
    try {
      result = razorpayConfigured ? await startRazorpayPayment({url: link, name: listingName, category: listingCategory, description: listingDescription, owner_name: ownerName, owner_contact: ownerContact, amount}) : await onSubmit({url: link, bid: amount, category: listingCategory});
    } catch (error) {
      result = {ok: false, error: error.message || 'We could not start the payment.'};
    } finally {
      setClaiming(false);
    }
    setClaimed(Boolean(result?.ok));
    setClaimError(result?.ok ? '' : result?.error || 'We could not submit this listing.');
  };
  return <main>
    <section className="hero">
      <div className="live-pill"><span className="pulse-dot"/> <strong>{onlineCount} online now</strong><span className="divider"/> <b>{formatReach(totalViews)}</b>&nbsp;views so far</div>
      <h1>Claim <em>#1</em> in<br/>Daman today.</h1>
      <p className="hero-copy"><strong>Spots start at ₹29.</strong> Bid under the #1 price and you still land on the board — exactly where your amount ranks.</p>

      <div className="amount-row">
        <button onClick={()=>setAmount(Math.max(29, amount-50))} aria-label="Decrease bid by ₹50"><AppIcon icon={MinusSignIcon} size={34}/></button>
        <div className="amount">₹{formatINR(amount)}</div>
        <button onClick={()=>setAmount(amount+50)} aria-label="Increase bid by ₹50"><AppIcon icon={PlusSignIcon} size={34}/></button>
      </div>
      <div className="rank-preview">Estimated position: <strong>#{position || 1}</strong></div>

      <div id="claim-form" className={`claim-form ${claimed ? 'is-success' : ''}`}>
        <div className="claim-primary">
          <label className="claim-field">
            <AppIcon icon={Globe02Icon} size={22}/>
            <input aria-label="Listing link" value={link} onChange={e=>{setLink(e.target.value);setClaimed(false);setClaimError('')}} placeholder="Your product URL or @handle"/>
          </label>
          <label className="claim-field claim-select-field">
            <select aria-label="Listing category" value={listingCategory} onChange={e=>{setListingCategory(e.target.value);setClaimed(false);setClaimError('')}}>
              <option value="">Choose a category</option>
              <option value="Food">Food & drink</option>
              <option value="Event">Event</option>
              <option value="Service">Service</option>
              <option value="Creator">Creator</option>
              <option value="Business">Business</option>
              <option value="Community">Community</option>
              <option value="Discovery">Discovery</option>
            </select>
            <AppIcon icon={ArrowUp01Icon} size={20}/>
          </label>
          <button className="claim-submit" onClick={submitClaim} disabled={claiming || !link.trim() || !listingCategory}>{claiming ? 'Opening payment…' : claimed ? 'Request received ✓' : razorpayConfigured ? 'Pay & submit' : 'Submit for review'}</button>
        </div>
        <div className={`claim-details ${showClaimDetails ? 'is-visible' : ''}`}>
          <input aria-label="Listing name" value={listingName} onChange={e=>{setListingName(e.target.value);setClaimed(false)}} placeholder="Listing name" />
          <input aria-label="Your name" value={ownerName} onChange={e=>{setOwnerName(e.target.value);setClaimed(false)}} placeholder="Your name" />
          <input aria-label="Email or WhatsApp number" value={ownerContact} onChange={e=>{setOwnerContact(e.target.value);setClaimed(false)}} placeholder="Email or WhatsApp number" />
          <textarea aria-label="Short description" value={listingDescription} onChange={e=>{setListingDescription(e.target.value);setClaimed(false)}} placeholder="Short description of what people will find…" rows="2" />
        </div>
      </div>
      <p className={`microcopy ${claimError ? 'claim-error' : ''}`}>{claimError || (claimed ? 'Submitted for review. It will appear after approval.' : 'Already listed? Use the same link to move higher — you only pay the difference.')}</p>
    </section>

    <section className="utility-panels" aria-label="Board activity">
      <UtilityPanel title="Spotlight" icon={<AppIcon icon={HeartAddIcon} size={16}/>} summary="Top listings" value={`${Math.min(3, boardListings.length)} spots`} open={openPanel === 'spotlight'} onClick={() => setOpenPanel(openPanel === 'spotlight' ? null : 'spotlight')}>
        {topThree.length > 0 ? <div className="utility-rows">{topThree.map((listing) => <div className="utility-row" key={listing.id || listing.name}><span className="utility-rank">#{listing.rank}</span><span className="mini-avatar">{listing.icon}</span><strong>{listing.name}</strong><b>₹{formatINR(listing.amount)}</b></div>)}</div> : <p className="empty-state">No approved listings yet.</p>}
      </UtilityPanel>
      <UtilityPanel title="Recent bids" icon={<AppIcon icon={Time04Icon} size={16}/>} summary={`${boardActivity.length} bids`} value="Live" open={openPanel === 'recent'} onClick={() => setOpenPanel(openPanel === 'recent' ? null : 'recent')}>
        {boardActivity.length > 0 ? <div className="utility-rows">{boardActivity.slice(0, 5).map((bid, index) => <div className="utility-row recent-row" key={`${bid.name}-${index}`}><span className="mini-avatar">{bid.icon}</span><strong>{bid.name}</strong><span className="recent-action">{bid.action}</span><b>₹{formatINR(bid.amount)}</b><small>{bid.time}</small></div>)}</div> : <p className="empty-state">No bid activity recorded yet.</p>}
      </UtilityPanel>
    </section>

    <section className="board-section">
      <div className="section-heading">
        <div><span className="eyebrow"><AppIcon icon={FireIcon} size={16}/> LIVE BOARD</span><h2>Daman's front page</h2></div>
        <div className="category-icons" aria-hidden="true"><AppIcon icon={Store01Icon}/><AppIcon icon={Calendar03Icon}/><AppIcon icon={Camera01Icon}/><AppIcon icon={ToolsIcon}/><AppIcon icon={SparklesIcon}/></div>
      </div>
      <div className="board-toolbar">
        <div className="filter-row" aria-label="Filter listings by category">
          {boardCategories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}><AppIcon icon={categoryIcons[item] || SparklesIcon} size={20}/><span>{item}</span></button>)}
        </div>
        <span className="board-count">{visibleListings.length} live listings</span>
      </div>

      {visibleListings.length === 0 && <div className="empty-board"><strong>No approved listings yet.</strong><span>Be the first to claim a spot on the live Daman Board.</span></div>}
      {topThree.length > 0 && <><GroupSeparator label="Top 3" /><div className="top-three">{topThree.map(card => <ListingCard key={card.rank} card={card} featured onTakeSpot={() => { setAmount(card.amount + 50); document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />)}</div></>}
      {topTen.length > 0 && <><GroupSeparator label="Top 10" /><div className="rest-list">{topTen.map(card => <ListingCard key={card.rank} card={card} onTakeSpot={() => { setAmount(card.amount + 50); document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />)}</div></>}
      {rest.length > 0 && <><GroupSeparator label="The rest" /><div className="rest-list">{rest.map(card => <ListingCard key={card.rank} card={card} onTakeSpot={() => { setAmount(card.amount + 50); document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />)}</div></>}
    </section>
  </main>
}

function UtilityPanel({title,icon,summary,value,open,onClick,children}){
  return <div className={`utility-panel ${open ? 'is-open' : ''}`}><button className="utility-toggle" aria-expanded={open} onClick={onClick}><span className="utility-title">{icon}<strong>{title}</strong></span><span className="utility-summary">{summary}</span><b>{value}</b><AppIcon icon={ArrowUp01Icon} size={16} className="utility-chevron" /></button>{open && <div className="utility-content">{children}</div>}</div>
}

function GroupSeparator({label}){
  return <div className="group-separator" role="separator" aria-label={label}><span></span><strong>{label}</strong><span></span></div>
}

function ListingCard({card,featured,onTakeSpot}){
  const footer = (
    <div className="listing-footer">
      <span className="click-badge"><AppIcon icon={ViewIcon} size={featured?20:16}/>{formatReach(card.clicks)} Daman Reach</span>
      <span className="listing-time">{card.time}</span>
      <button className="take-spot" onClick={onTakeSpot}>Take this spot</button>
    </div>
  );
  return <article className={`listing ${featured?'featured':''}`}>
    <div className="listing-row">
      <div className="rank-icon">
        <span className="rank">#{card.rank}</span>
        <div className="avatar">{card.icon}</div>
      </div>
      <div className="listing-content">
        <div className="listing-title-row"><h4>{card.name}</h4><strong className="bid">₹{formatINR(card.amount)}</strong></div>
        <p>{card.desc}</p>
        {!featured && footer}
      </div>
    </div>
    {featured && footer}
  </article>
}

function Stats({listings: boardListings, recentBids: boardActivity}){
  const liveCount = boardListings.length;
  const standingBids = boardListings.reduce((sum, item) => sum + item.amount, 0);
  const totalReach = boardListings.reduce((sum, item) => sum + item.clicks, 0);
  const totalViews = boardListings.reduce((sum, item) => sum + (item.listingViews || 0), 0);
  return <main className="stats-page page-wrap"><div className="page-intro"><h1>What Daman is<br/><em>looking at today.</em></h1><p>These totals are calculated from approved listings and recorded analytics.</p><span className="updated"><span className="pulse-dot"/> Updated just now</span></div><div className="stat-grid"><Stat icon={<AppIcon icon={ViewIcon}/>} value={formatReach(totalViews)} label="listing views" /><Stat icon={<AppIcon icon={ViewIcon}/>} value={formatReach(totalReach)} label="Daman Reach" /><Stat icon={<AppIcon icon={Location01Icon}/>} value={liveCount} label="live spots" /><Stat icon={<AppIcon icon={TradeUpIcon}/>} value={`₹${formatINR(standingBids)}`} label="standing bids" /><Stat icon={<AppIcon icon={ChartLineData01Icon}/>} value={boardActivity.length} label="recent bids" /><Stat icon={<AppIcon icon={HeartAddIcon}/>} value={liveCount ? `₹${formatINR(Math.max(...boardListings.map((item) => item.amount)))}` : '₹0'} label="highest bid" /></div><div className="chart-card"><div className="chart-heading"><div><h2>Local reach</h2><span>{formatReach(totalReach)} recorded reach</span></div><span className="chart-label">Live</span></div><p className="empty-state">Time-series analytics will appear here as live events are recorded.</p></div><div className="stats-columns"><div className="data-card"><div className="data-heading"><h2>Highest Daman Reach</h2><span>Top 5</span></div>{boardListings.length ? [...boardListings].sort((a,b)=>b.clicks-a.clicks).slice(0,5).map((listing,index) => <div className="ranked-row" key={listing.id || listing.name}><span>{index + 1}</span><span className="mini-avatar">{listing.icon}</span><strong>{listing.name}</strong><b>{formatReach(listing.clicks)} reach</b></div>) : <p className="empty-state">No approved listing analytics yet.</p>}</div><div className="data-card"><div className="data-heading"><h2>Recent bids</h2><span>Live</span></div>{boardActivity.length ? boardActivity.slice(0,5).map((bid, index) => <div className="recent-stat-row" key={`${bid.name}-${index}`}><span className="mini-avatar">{bid.icon}</span><div><strong>{bid.name}</strong><small>{bid.action} · {bid.time}</small></div><b>₹{formatINR(bid.amount)}</b></div>) : <p className="empty-state">No bid activity recorded yet.</p>}</div></div><div className="info-note"><AppIcon icon={ShieldCheckIcon} size={20}/><span>Daman Reach is based on recorded unique reach. Listing views and actions are tracked separately as data becomes available.</span></div></main>
}

function AdminPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [session, setSession] = useState(null);
  const [pendingListings, setPendingListings] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const loadListings = async (currentSession) => {
    const response = await fetch('/api/admin-listings', {headers: {Authorization: `Bearer ${currentSession.access_token}`}});
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Could not load listings.');
    setPendingListings(result.listings || []);
  };
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({data}) => { if (data.session) { setSession(data.session); loadListings(data.session).catch((loadError) => setError(loadError.message)); } });
  }, []);
  const signIn = async (event) => {
    event.preventDefault(); setLoading(true); setError('');
    const {data, error: signInError} = await supabase.auth.signInWithPassword({email, password});
    if (signInError) setError(signInError.message);
    else { setSession(data.session); try { await loadListings(data.session); } catch (loadError) { setError(loadError.message); } }
    setLoading(false);
  };
  const moderate = async (id, status) => {
    setLoading(true); setError('');
    const response = await fetch('/api/admin-listings', {method: 'PATCH', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`}, body: JSON.stringify({id, status})});
    const result = await response.json();
    if (!response.ok) setError(result.error || 'Could not update listing.');
    else setPendingListings((items) => items.filter((item) => item.id !== id));
    setLoading(false);
  };
  const deleteListing = async (listing) => {
    if (!window.confirm(`Permanently delete “${listing.name}”? This also removes its bids and activity.`)) return;
    setLoading(true); setError('');
    const response = await fetch('/api/admin-listings', {method: 'DELETE', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`}, body: JSON.stringify({id: listing.id})});
    const result = await response.json();
    if (!response.ok) setError(result.error || 'Could not delete listing.');
    else setPendingListings((items) => items.filter((item) => item.id !== listing.id));
    setLoading(false);
  };
  const startEdit = (listing) => { setEditingId(listing.id); setEditForm({...listing}); setError(''); };
  const saveEdit = async () => {
    setLoading(true); setError('');
    const response = await fetch('/api/admin-listings', {method: 'PATCH', headers: {'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}`}, body: JSON.stringify({id: editingId, url: editForm.url, name: editForm.name, category: editForm.category, description: editForm.description, owner_name: editForm.owner_name, owner_contact: editForm.owner_contact, amount: Number(editForm.current_bid)})});
    const result = await response.json();
    if (!response.ok) setError(result.error || 'Could not save listing.');
    else { setPendingListings((items) => items.map((item) => item.id === editingId ? {...item, ...result.listing} : item)); setEditingId(null); }
    setLoading(false);
  };
  if (!supabaseConfigured) return <main className="simple-page info-page"><span className="eyebrow">ADMIN</span><h1>Supabase is<br/><em>not connected.</em></h1><p>Add the Supabase environment variables in Vercel before using moderation.</p></main>;
  if (!session) return <main className="simple-page info-page admin-page"><span className="eyebrow">ADMIN MODERATION</span><h1>Review what goes<br/><em>on the board.</em></h1><p>Sign in with the admin account created in Supabase Authentication.</p><form className="admin-login" onSubmit={signIn}><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Admin email" required /><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" required /><button className="claim-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button></form>{error && <p className="claim-error">{error}</p>}</main>;
  return <main className="page-wrap admin-page"><div className="page-intro"><span className="eyebrow">ADMIN MODERATION</span><h1>All board<br/><em>listings.</em></h1><p>Review, edit, approve, pause, reject, or remove any database listing.</p></div><div className="admin-toolbar"><strong>{pendingListings.length} database listings</strong><button onClick={() => supabase.auth.signOut().then(() => setSession(null))}>Sign out</button></div>{error && <p className="claim-error">{error}</p>}<div className="admin-list">{pendingListings.length === 0 ? <div className="data-card"><strong>No database listings yet.</strong><p className="muted">Approved and pending records from Supabase will appear here.</p></div> : pendingListings.map((listing) => <article className="admin-item" key={listing.id}><div>{editingId === listing.id ? <div className="admin-edit-form"><input value={editForm.name || ''} onChange={(event) => setEditForm({...editForm, name: event.target.value})} placeholder="Listing name" /><input value={editForm.url || ''} onChange={(event) => setEditForm({...editForm, url: event.target.value})} placeholder="URL" /><input value={editForm.category || ''} onChange={(event) => setEditForm({...editForm, category: event.target.value})} placeholder="Category" /><input value={editForm.owner_name || ''} onChange={(event) => setEditForm({...editForm, owner_name: event.target.value})} placeholder="Owner name" /><input value={editForm.owner_contact || ''} onChange={(event) => setEditForm({...editForm, owner_contact: event.target.value})} placeholder="Owner contact" /><input type="number" min="29" value={editForm.current_bid || 29} onChange={(event) => setEditForm({...editForm, current_bid: event.target.value})} placeholder="Bid" /><textarea value={editForm.description || ''} onChange={(event) => setEditForm({...editForm, description: event.target.value})} rows="3" placeholder="Description" /><div className="admin-actions"><button className="admin-approve" disabled={loading} onClick={saveEdit}>Save changes</button><button disabled={loading} onClick={() => setEditingId(null)}>Cancel</button></div></div> : <><span className="eyebrow">{listing.status} · {listing.category} · ₹{formatINR(listing.current_bid)}</span><h2>{listing.name}</h2><p>{listing.description}</p><small>{listing.owner_name} · {listing.owner_contact}</small><a href={listing.url} target="_blank" rel="noreferrer">Open listing ↗</a></>}</div>{editingId !== listing.id && <div className="admin-actions"><button className="admin-approve" disabled={loading || listing.status === 'approved'} onClick={() => moderate(listing.id, 'approved')}>Approve</button><button disabled={loading || listing.status === 'paused'} onClick={() => moderate(listing.id, 'paused')}>Pause</button><button className="admin-reject" disabled={loading || listing.status === 'rejected'} onClick={() => moderate(listing.id, 'rejected')}>Reject</button><button disabled={loading} onClick={() => startEdit(listing)}>Edit</button><button className="admin-delete" disabled={loading} onClick={() => deleteListing(listing)}>Delete</button></div>}</article>)}</div></main>;
}

function Stat({icon,value,label}){ return <div className="stat-card">{icon}<strong>{value}</strong><span>{label}</span></div> }

function AboutPage({listings: boardListings}){
  const standingBids = boardListings.reduce((sum, item) => sum + item.amount, 0);
  const totalReach = boardListings.reduce((sum, item) => sum + (item.clicks || 0), 0);
  return <main className="simple-page info-page"><h1>One board for<br/><em>what’s local.</em></h1><p>Best in Daman is a public front page for the people, places and projects making the territory interesting. Put one clear link on the board, choose your number, and let the town decide what rises.</p><p>Every listing is local by design. Cafés, creators, services, events, community groups and useful discoveries all get the same transparent chance to be seen.</p><h2>Live board totals</h2><p className="muted">These figures come from approved Supabase listings and update as the board changes.</p><div className="about-stats"><div><strong>{boardListings.length}</strong><span>live listings</span></div><div><strong>₹{formatINR(standingBids)}</strong><span>standing bids</span></div><div><strong>{formatReach(totalReach)}</strong><span>Daman Reach</span></div></div><h2>Why it exists</h2><p>Local discovery should feel more like a town square than an ad dashboard. One list, one number, fully visible. If something deserves attention, it can earn its place—and anyone can move it tomorrow.</p><div className="info-note"><AppIcon icon={CheckmarkCircle02Icon} size={20}/><span>Best in Daman is built around local usefulness, transparent ranking, and human moderation.</span></div></main>
}

function RulesPage(){
  return <main className="simple-page info-page rules-page"><h1>Keep it local.<br/><em>Keep it fair.</em></h1><p>Best in Daman is one public board for local businesses, creators, events, services and community projects. Your spot is decided by one number: your bid.</p><RuleSection title="Ranking" items={['Spots start at ₹29 and move in ₹50 steps.', 'Bid under #1 and you still land on the board wherever your amount ranks.', 'Existing listings keep their amount until the owner raises it or someone passes them.', 'If two listings hold the same amount, the newer bid ranks ahead.']} /><RuleSection title="What can be listed" items={['A genuine local business, event, creator, service, project or discovery in Daman.', 'Use a working Instagram, website or WhatsApp link that helps people understand the listing.', 'Listings must be useful, accurate and appropriate for a public local board.']} /><RuleSection title="After you claim" items={['Your request is reviewed before it goes live on the board.', 'Public reach and listing views are calculated from recorded analytics.', 'Bids are not a guarantee of permanent placement—being passed is part of the board.']} /><RuleSection title="Payments & disputes" items={['Checkout is handled through a server-side Razorpay payment flow after order verification.', 'Never share payment secrets in the browser or client-side code.', 'For a duplicate charge or missing listing, contact support before opening a dispute.']} /><div className="info-note"><AppIcon icon={ShieldCheckIcon} size={20}/><span>Approved listings and public metrics come from the live production database.</span></div></main>
}

function RuleSection({title,items}){ return <section className="rule-section"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section> }

function Footer({setTab}){
  return <footer className="site-footer"><div><strong>Best in Daman®</strong><span>One local board. Your bid is your spot.</span></div><nav aria-label="Footer"><button onClick={() => setTab('Rules')}>Rules</button><button onClick={() => setTab('About')}>About</button><button onClick={() => setTab('Stats')}>Live stats</button><span>Payments secured by Razorpay</span></nav></footer>
}

function InfoPage({eyebrow,title,text,cards}){
  return <main className="simple-page"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p><div className="info-cards">{cards.map((card, index) => <div className="info-card" key={card}><span>0{index + 1}</span><strong>{card}</strong></div>)}</div></main>
}

createRoot(document.getElementById('root')).render(<App />);
