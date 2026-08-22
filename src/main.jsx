import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Link2, Minus, Plus, Flame, Store, CalendarDays, Camera, Wrench, Sparkles, ArrowUpRight, ShieldCheck, Eye, MousePointerClick, MapPin } from 'lucide-react';
import './styles.css';

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
  { rank: 8, name: 'FreshCatch Home Kitchen', category: 'Food', amount: 99, desc: 'Weekend seafood menu. Pre-orders through WhatsApp.', clicks: 44, time: '5 hrs ago', icon: '🐟' }
];
const categories = ['All', ...new Set(listings.map((listing) => listing.category))];
const formatINR = (value) => new Intl.NumberFormat('en-IN').format(value);

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
    About: <InfoPage eyebrow="MADE IN DAMAN®" title="A little more signal for local." text="Made in Daman is a public front page for the people, places and projects making the territory interesting." cards={['Anyone can submit a local listing.', 'Spotlight is transparent and ranked by bid.', 'Every claim is reviewed before it goes live.']} />,
    Rules: <InfoPage eyebrow="KEEP IT LOCAL" title="Good boards need good neighbours." text="Keep listings local, useful and genuine. No misleading claims, prohibited goods, spam or impersonation." cards={['One listing per link. Keep it current.', 'No hate, adult, illegal or deceptive content.', 'We may pause or remove anything reported.']} />
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
  </div>
}

function Board({amount,setAmount,link,setLink,claimed,setClaimed,position}){
  const [category, setCategory] = useState('All');
  const visibleListings = category === 'All' ? listings : listings.filter((listing) => listing.category === category);
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
        <button onClick={()=>setAmount(Math.max(49, amount-50))} aria-label="Decrease bid"><Minus size={34}/></button>
        <div className="amount">₹{formatINR(amount)}</div>
        <button onClick={()=>setAmount(amount+50)} aria-label="Increase bid"><Plus size={34}/></button>
      </div>
      <div className="rank-preview">Estimated position: <strong>#{position || 1}</strong></div>

      <div id="claim-form" className={`claim-bar ${claimed ? 'is-success' : ''}`}>
        <Link2 size={24}/>
        <input aria-label="Listing link" value={link} onChange={e=>{setLink(e.target.value);setClaimed(false)}} placeholder="Instagram, website or WhatsApp link…"/>
        <button onClick={submitClaim} disabled={!link.trim()}>{claimed ? 'Request received ✓' : 'Claim spot'}</button>
      </div>
      <p className="microcopy">{claimed ? 'Nice — your link is ready for review. A real payment step will plug in here.' : 'Already listed? Use the same link to move higher — you only pay the difference.'}</p>
    </section>

    <section className="board-section">
      <div className="section-heading">
        <div><span className="eyebrow"><Flame size={16}/> LIVE BOARD</span><h2>Daman's front page</h2></div>
        <div className="category-icons" aria-hidden="true"><Store/><CalendarDays/><Camera/><Wrench/><Sparkles/></div>
      </div>
      <div className="board-toolbar">
        <div className="filter-row" aria-label="Filter listings by category">
          {categories.map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}
        </div>
        <span className="board-count">{visibleListings.length} live listings</span>
      </div>

      <div className="top-three">
        {visibleListings.slice(0,3).map(card => <ListingCard key={card.rank} card={card} featured onTakeSpot={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />)}
      </div>
      <h3 className="subhead">Top {visibleListings.length}</h3>
      <div className="rest-list">
        {visibleListings.slice(3).map(card => <ListingCard key={card.rank} card={card} onTakeSpot={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} />)}
      </div>
    </section>
  </main>
}

function ListingCard({card,featured,onTakeSpot}){
  return <article className={`listing ${featured?'featured':''}`}>
    <div className="rank">#{card.rank}</div>
    <div className="avatar">{card.icon}</div>
    <div className="listing-main">
      <div className="listing-title-row"><div><h4>{card.name}</h4><span className="category">{card.category}</span></div><strong className="bid">₹{formatINR(card.amount)}</strong></div>
      <p>{card.desc}</p>
      <div className="meta"><span>{card.clicks} clicks</span><span>•</span><span>{card.time}</span></div>
    </div>
    <button className="take-spot" onClick={onTakeSpot}>Take this spot <ArrowUpRight size={15}/></button>
  </article>
}

function Stats(){
  return <main className="simple-page stats-page"><span className="eyebrow">TODAY IN DAMAN</span><h1>Small board.<br/><em>Big local signal.</em></h1><p>Public, simple numbers that show what the town is paying attention to right now.</p><div className="stat-grid"><Stat icon={<Eye/>} value="12,420" label="board views" /><Stat icon={<MousePointerClick/>} value="1,904" label="listing clicks" /><Stat icon={<MapPin/>} value="8" label="live spots" /></div><div className="info-note"><ShieldCheck size={20}/><span>Stats are currently sample data. Analytics will be connected once listings have real IDs and click events.</span></div></main>
}

function Stat({icon,value,label}){ return <div className="stat-card">{icon}<strong>{value}</strong><span>{label}</span></div> }

function InfoPage({eyebrow,title,text,cards}){
  return <main className="simple-page"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p><div className="info-cards">{cards.map((card, index) => <div className="info-card" key={card}><span>0{index + 1}</span><strong>{card}</strong></div>)}</div></main>
}

createRoot(document.getElementById('root')).render(<App />);
