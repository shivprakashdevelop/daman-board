import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link01Icon, MinusSignIcon, PlusSignIcon, FireIcon, Store01Icon, Calendar03Icon, Camera01Icon, ToolsIcon, SparklesIcon, ArrowUpRight01Icon, ShieldCheckIcon, ViewIcon, Cursor01Icon, Location01Icon, ArrowUp01Icon, HeartAddIcon, Time04Icon, TradeUpIcon, CheckmarkCircle02Icon, ChartLineData01Icon } from '@hugeicons/core-free-icons';
import './styles.css';

function AppIcon({icon,size=24,...props}){
  return <HugeiconsIcon icon={icon} size={size} color="currentColor" strokeWidth={1.8} {...props}/>;
}

// This shape intentionally mirrors the future Supabase `listings` table.
// Keeping the UI data-normalized makes the prototype easy to replace with a query.
const listings = [
  { rank: 1, name: 'Sea View Café', category: 'Food', amount: 499, desc: 'Sunset coffee, breakfast and weekend live music near the coast.', clicks: 148, time: '12 min ago', icon: '☕' },
  { rank: 2, name: 'Daman Weekend Market', category: 'Event', amount: 420, desc: 'Local food, creators, handmade products and music this Sunday.', clicks: 121, time: '26 min ago', icon: '🎪' },
  { rank: 3, name: 'FrameStory Daman', category: 'Creator', amount: 350, desc: 'Portraits, events and pre-wedding photography across Daman.', clicks: 95, time: '41 min ago', icon: '📸' },
  { rank: 4, name: 'QuickFix Electrician', category: 'Service', amount: 299, desc: 'Home electrical repairs and emergency visits in Nani & Moti Daman.', clicks: 82, time: '1 hr ago', icon: '⚡' },
  { rank: 5, name: 'Home Oven by Riya', category: 'Food', amount: 249, desc: 'Custom cakes, brownies and dessert boxes made locally.', clicks: 70, time: '2 hrs ago', icon: '🧁' },
  { rank: 6, name: 'Coastal Sketch Club', category: 'Community', amount: 199, desc: 'Urban sketching meetups around forts, beaches and old streets.', clicks: 63, time: '3 hrs ago', icon: '🎨' },
  { rank: 7, name: 'Daman Tuition Hub', category: 'Education', amount: 149, desc: 'Local tutors for school, boards and entrance preparation.', clicks: 53, time: '4 hrs ago', icon: '📚' },
  { rank: 8, name: 'FreshCatch Home Kitchen', category: 'Food', amount: 99, desc: 'Weekend seafood menu. Pre-orders through WhatsApp.', clicks: 44, time: '5 hrs ago', icon: '🐟' },
  { rank: 9, name: 'Daman Fort Walks', category: 'Discovery', amount: 89, desc: 'Local stories and slow walks through Moti Daman’s old streets.', clicks: 38, time: '6 hrs ago', icon: '🏰' },
  { rank: 10, name: 'Moti Daman Barber', category: 'Service', amount: 79, desc: 'Classic cuts, beard trims and easy appointments near the fort.', clicks: 31, time: '7 hrs ago', icon: '💈' },
  { rank: 11, name: 'Beach Cleanup Circle', category: 'Community', amount: 69, desc: 'Weekend cleanup meetups and a little more care for the coast.', clicks: 26, time: '8 hrs ago', icon: '🌱' },
  { rank: 12, name: 'Portuguese House Stay', category: 'Stay', amount: 59, desc: 'A quiet heritage stay with local breakfast in Moti Daman.', clicks: 21, time: '9 hrs ago', icon: '🏠' }
];
const categories = ['All', ...new Set(listings.map((listing) => listing.category))];
const formatINR = (value) => new Intl.NumberFormat('en-IN').format(value);
const sponsorRows = [
  { rank: 1, name: 'Coastal Creators Club', amount: 799, icon: '🌊' },
  { rank: 2, name: 'Nani Daman Market', amount: 649, icon: '🛍️' },
  { rank: 3, name: '@madeindaman', amount: 499, icon: '📍' }
];
const recentBids = [
  { name: 'Sea View Café', action: 'moved to #1', amount: 499, time: '12 min ago', icon: '☕' },
  { name: 'Daman Weekend Market', action: 'moved to #2', amount: 420, time: '26 min ago', icon: '🎪' },
  { name: 'FrameStory Daman', action: 'moved to #3', amount: 350, time: '41 min ago', icon: '📸' },
  { name: 'QuickFix Electrician', action: 'joined the board', amount: 299, time: '1 hr ago', icon: '⚡' },
  { name: 'Home Oven by Riya', action: 'joined the board', amount: 249, time: '2 hrs ago', icon: '🧁' }
];

function App(){
  const [amount, setAmount] = useState(299);
  const [link, setLink] = useState('');
  const [tab, setTab] = useState('Board');
  const [claimed, setClaimed] = useState(false);

  const position = useMemo(() => {
    const sorted = [...listings, {amount}].sort((a,b)=>b.amount-a.amount);
    return sorted.findIndex(x => x.amount === amount && !x.name) + 1;
  }, [amount]);

  const page = {
    Board: <Board amount={amount} setAmount={setAmount} link={link} setLink={setLink} claimed={claimed} setClaimed={setClaimed} position={position} />,
    Stats: <Stats />,
    About: <AboutPage />,
    Rules: <RulesPage />
  };

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={()=>setTab('Board')} aria-label="Made in Daman home">
        <span>Made in</span><strong>Daman</strong><small>®</small>
      </button>
      <nav>
        {['Board','Stats','About','Rules'].map(item => <button key={item} className={tab===item?'active':''} onClick={()=>setTab(item)}>{item}</button>)}
      </nav>
    </header>
    {page[tab]}
    <Footer setTab={setTab}/>
  </div>
}

function Board({amount,setAmount,link,setLink,claimed,setClaimed,position}){
  const [category, setCategory] = useState('All');
  const [openPanel, setOpenPanel] = useState(null);
  const [sponsorAmount, setSponsorAmount] = useState(499);
  const [sponsored, setSponsored] = useState(false);
  const visibleListings = category === 'All' ? listings : listings.filter((listing) => listing.category === category);
  const topThree = visibleListings.slice(0, 3);
  const topTen = visibleListings.slice(3, 10);
  const rest = visibleListings.slice(10);
  const submitClaim = () => {
    if (!link.trim()) return;
    setClaimed(true);
  };
  return <main>
    <section className="hero">
      <div className="live-pill"><span className="pulse-dot"/> <strong>47 online now</strong><span className="divider"/> <b>12,420</b>&nbsp;views today</div>
      <h1>Claim <em>#1</em> in<br/>Daman today.</h1>
      <p className="hero-copy"><strong>Spots start at ₹49.</strong> Bid under the #1 price and you still land on the board — exactly where your amount ranks.</p>

      <div className="amount-row">
        <button onClick={()=>setAmount(Math.max(49, amount-50))} aria-label="Decrease bid by ₹50"><AppIcon icon={MinusSignIcon} size={34}/></button>
        <div className="amount">₹{formatINR(amount)}</div>
        <button onClick={()=>setAmount(amount+50)} aria-label="Increase bid by ₹50"><AppIcon icon={PlusSignIcon} size={34}/></button>
      </div>
      <div className="rank-preview">Estimated position: <strong>#{position || 1}</strong></div>

      <div id="claim-form" className={`claim-bar ${claimed ? 'is-success' : ''}`}>
        <AppIcon icon={Link01Icon} size={24}/>
        <input aria-label="Listing link" value={link} onChange={e=>{setLink(e.target.value);setClaimed(false)}} placeholder="Instagram, website or WhatsApp link…"/>
        <button onClick={submitClaim} disabled={!link.trim()}>{claimed ? 'Request received ✓' : 'Claim spot'}</button>
      </div>
      <p className="microcopy">{claimed ? 'Nice — your link is ready for review. A real payment step will plug in here.' : 'Already listed? Use the same link to move higher — you only pay the difference.'}</p>
    </section>

    <section className="utility-panels" aria-label="Board activity">
      <UtilityPanel title="Spotlight" icon={<AppIcon icon={HeartAddIcon} size={16}/>} summary="Local picks" value="3 spots" open={openPanel === 'spotlight'} onClick={() => setOpenPanel(openPanel === 'spotlight' ? null : 'spotlight')}>
        <div className="utility-rows">{sponsorRows.map((sponsor) => <div className="utility-row" key={sponsor.name}><span className="utility-rank">#{sponsor.rank}</span><span className="mini-avatar">{sponsor.icon}</span><strong>{sponsor.name}</strong><b>₹{formatINR(sponsor.amount)}</b></div>)}</div>
        <div className="utility-form"><input aria-label="Spotlight name" placeholder="Your name or page"/><input className="mini-amount" aria-label="Spotlight amount" inputMode="numeric" value={sponsorAmount} onChange={(event) => setSponsorAmount(Math.max(199, Number(event.target.value) || 199))}/><button onClick={() => setSponsored(true)}>{sponsored ? 'Queued ✓' : 'Spotlight'}</button></div>
        <p className="utility-note">From ₹199. The highest amount gets the top local spotlight.</p>
      </UtilityPanel>
      <UtilityPanel title="Recent bids" icon={<AppIcon icon={Time04Icon} size={16}/>} summary={`${recentBids.length} bids`} value="Live" open={openPanel === 'recent'} onClick={() => setOpenPanel(openPanel === 'recent' ? null : 'recent')}>
        <div className="utility-rows">{recentBids.map((bid) => <div className="utility-row recent-row" key={bid.name}><span className="mini-avatar">{bid.icon}</span><strong>{bid.name}</strong><span className="recent-action">{bid.action}</span><b>₹{formatINR(bid.amount)}</b><small>{bid.time}</small></div>)}</div>
      </UtilityPanel>
    </section>

    <section className="board-section">
      <div className="section-heading">
        <div><span className="eyebrow"><AppIcon icon={FireIcon} size={16}/> LIVE BOARD</span><h2>Daman's front page</h2></div>
        <div className="category-icons" aria-hidden="true"><AppIcon icon={Store01Icon}/><AppIcon icon={Calendar03Icon}/><AppIcon icon={Camera01Icon}/><AppIcon icon={ToolsIcon}/><AppIcon icon={SparklesIcon}/></div>
      </div>
      <div className="board-toolbar">
        <div className="filter-row" aria-label="Filter listings by category">
          {categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <span className="board-count">{visibleListings.length} live listings</span>
      </div>

      <GroupSeparator label="Top 3" />
      <div className="top-three">{topThree.map(card => <ListingCard key={card.rank} card={card} featured onTakeSpot={() => { setAmount(card.amount + 50); document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />)}</div>
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
  return <article className={`listing ${featured?'featured':''}`}>
    <div className="rank">#{card.rank}</div>
    <div className="avatar">{card.icon}</div>
    <div className="listing-main">
      <div className="listing-title-row"><div><h4>{card.name}</h4><span className="category">{card.category}</span></div><strong className="bid">₹{formatINR(card.amount)}</strong></div>
      <p>{card.desc}</p>
      <div className="listing-footer">
        <div className="meta"><span className="click-badge"><AppIcon icon={Cursor01Icon} size={18}/>{card.clicks} clicks</span><span>{card.time}</span></div>
        <button className="take-spot" onClick={onTakeSpot}>Take this spot <AppIcon icon={ArrowUpRight01Icon} size={17}/></button>
      </div>
    </div>
  </article>
}

function Stats(){
  return <main className="stats-page page-wrap"><div className="page-intro"><span className="eyebrow">LIVE STATS</span><h1>What Daman is<br/><em>looking at today.</em></h1><p>Everything here refreshes automatically. Counting since the board went live.</p><span className="updated"><span className="pulse-dot"/> Updated just now</span></div><div className="stat-grid"><Stat icon={<AppIcon icon={ViewIcon}/>} value="12,420" label="board views · 24h" /><Stat icon={<AppIcon icon={Cursor01Icon}/>} value="1,904" label="listing clicks · 24h" /><Stat icon={<AppIcon icon={Location01Icon}/>} value="12" label="live spots" /><Stat icon={<AppIcon icon={TradeUpIcon}/>} value="₹2,264" label="standing bids" /><Stat icon={<AppIcon icon={ChartLineData01Icon}/>} value="42" label="bids this week" /><Stat icon={<AppIcon icon={HeartAddIcon}/>} value="₹799" label="highest spotlight" /></div><div className="chart-card"><div className="chart-heading"><div><h2>Traffic · last 24 hours</h2><span>12,420 page views</span></div><span className="chart-label">Now</span></div><MiniChart /></div><div className="stats-columns"><div className="data-card"><div className="data-heading"><h2>Most clicked listings</h2><span>Top 5</span></div>{listings.slice(0,5).map((listing,index) => <div className="ranked-row" key={listing.name}><span>{index + 1}</span><span className="mini-avatar">{listing.icon}</span><strong>{listing.name}</strong><b>{listing.clicks} clicks</b></div>)}</div><div className="data-card"><div className="data-heading"><h2>Recent bids</h2><span>Live</span></div>{recentBids.map((bid) => <div className="recent-stat-row" key={bid.name}><span className="mini-avatar">{bid.icon}</span><div><strong>{bid.name}</strong><small>{bid.action} · {bid.time}</small></div><b>₹{formatINR(bid.amount)}</b></div>)}</div></div><div className="info-note"><AppIcon icon={ShieldCheckIcon} size={20}/><span>Stats are currently sample data. Anonymous analytics will be connected once listings have real IDs and click events.</span></div></main>
}

function Stat({icon,value,label}){ return <div className="stat-card">{icon}<strong>{value}</strong><span>{label}</span></div> }

function MiniChart(){
  const heights = [28,42,35,58,66,48,72,54,61,76,64,82,69,58,71,87,78,91,73,65,80,88,76,96];
  return <div className="mini-chart" aria-label="Traffic chart">{heights.map((height,index) => <span key={index} style={{height: `${height}%`}} />)}</div>
}

function AboutPage(){
  return <main className="simple-page info-page"><span className="eyebrow">ABOUT MADE IN DAMAN</span><h1>One board for<br/><em>what’s local.</em></h1><p>Made in Daman is a public front page for the people, places and projects making the territory interesting. Put one clear link on the board, choose your number, and let the town decide what rises.</p><p>Every listing is local by design. Cafés, creators, services, events, community groups and useful discoveries all get the same transparent chance to be seen.</p><h2>Since launch</h2><p className="muted">The board is in its early days. Numbers below are sample data while the product foundation is being connected to live listings.</p><div className="about-stats"><div><strong>12</strong><span>live listings</span></div><div><strong>₹2,264</strong><span>standing bids</span></div><div><strong>₹799</strong><span>highest spotlight</span></div></div><h2>Why it exists</h2><p>Local discovery should feel more like a town square than an ad dashboard. One list, one number, fully visible. If something deserves attention, it can earn its place—and anyone can move it tomorrow.</p><div className="info-note"><AppIcon icon={CheckmarkCircle02Icon} size={20}/><span>Made in Daman is being built around local usefulness, transparent ranking, and human moderation.</span></div></main>
}

function RulesPage(){
  return <main className="simple-page info-page rules-page"><span className="eyebrow">KEEP IT LOCAL</span><h1>Good boards need<br/><em>good neighbours.</em></h1><p>Made in Daman is one public board for local businesses, creators, events, services and community projects. Your spot is decided by one number: your bid.</p><RuleSection title="Ranking" items={['Spots start at ₹49 and move in ₹50 steps in this prototype.', 'Bid under #1 and you still land on the board wherever your amount ranks.', 'Existing listings keep their amount until the owner raises it or someone passes them.', 'If two listings hold the same amount, the newer bid ranks ahead.']} /><RuleSection title="What can be listed" items={['A genuine local business, event, creator, service, project or discovery in Daman.', 'Use a working Instagram, website or WhatsApp link that helps people understand the listing.', 'Listings must be useful, accurate and appropriate for a public local board.']} /><RuleSection title="After you claim" items={['Your request is reviewed before it goes live on the board.', 'Every click can eventually be counted through a tracked redirect.', 'Bids are not a guarantee of permanent placement—being passed is part of the board.']} /><RuleSection title="Payments & disputes" items={['Checkout will be handled by a server-side payment flow once Razorpay is connected.', 'Never share payment secrets in the browser or client-side code.', 'For a duplicate charge or missing listing, contact support before opening a dispute.']} /><div className="info-note"><AppIcon icon={ShieldCheckIcon} size={20}/><span>These are product rules for the current foundation and will be reviewed before public launch.</span></div></main>
}

function RuleSection({title,items}){ return <section className="rule-section"><h2>{title}</h2><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section> }

function Footer({setTab}){
  return <footer className="site-footer"><div><strong>Made in Daman®</strong><span>One local board. Your bid is your spot.</span></div><nav aria-label="Footer"><button onClick={() => setTab('Rules')}>Rules</button><button onClick={() => setTab('About')}>About</button><button onClick={() => setTab('Stats')}>Live stats</button><span>Payments coming soon</span></nav></footer>
}

function InfoPage({eyebrow,title,text,cards}){
  return <main className="simple-page"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p><div className="info-cards">{cards.map((card, index) => <div className="info-card" key={card}><span>0{index + 1}</span><strong>{card}</strong></div>)}</div></main>
}

createRoot(document.getElementById('root')).render(<App />);
