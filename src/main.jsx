import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ExternalLink, Link2, Minus, Plus, Flame, Store, CalendarDays, Camera, Wrench, Sparkles } from 'lucide-react';
import './styles.css';

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
    Stats: <SimplePage title="Live stats" text="A snapshot of what Daman is looking at today." />,
    About: <SimplePage title="About" text="Made in Daman is a public front page for local businesses, creators, events, services and community projects." />,
    Rules: <SimplePage title="Rules" text="Keep listings local, useful and genuine. No misleading claims, prohibited goods, spam or impersonation." />
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
  return <main>
    <section className="hero">
      <div className="live-pill"><span className="pulse-dot"/> <strong>47 online now</strong><span className="divider"/> <b>12,420</b>&nbsp;views today</div>
      <h1>Claim <em>#1</em> in<br/>Daman today.</h1>
      <p className="hero-copy"><strong>Spots start at ₹49.</strong> Bid under the #1 price and you still land on the board — exactly where your amount ranks.</p>

      <div className="amount-row">
        <button onClick={()=>setAmount(Math.max(49, amount-50))} aria-label="Decrease bid"><Minus size={34}/></button>
        <div className="amount">₹{amount}</div>
        <button onClick={()=>setAmount(amount+50)} aria-label="Increase bid"><Plus size={34}/></button>
      </div>
      <div className="rank-preview">Estimated position: <strong>#{position || 1}</strong></div>

      <div className="claim-bar">
        <Link2 size={24}/>
        <input value={link} onChange={e=>{setLink(e.target.value);setClaimed(false)}} placeholder="Instagram, website or WhatsApp link…"/>
        <button onClick={()=>setClaimed(true)}>{claimed ? 'Saved ✓' : 'Claim spot'}</button>
      </div>
      <p className="microcopy">Already listed? Use the same link to move higher — you only pay the difference.</p>
    </section>

    <section className="board-section">
      <div className="section-heading">
        <div><span className="eyebrow"><Flame size={16}/> LIVE BOARD</span><h2>Daman's front page</h2></div>
        <div className="category-icons" aria-hidden="true"><Store/><CalendarDays/><Camera/><Wrench/><Sparkles/></div>
      </div>

      <div className="top-three">
        {listings.slice(0,3).map(card => <ListingCard key={card.rank} card={card} featured />)}
      </div>
      <h3 className="subhead">Top 10</h3>
      <div className="rest-list">
        {listings.slice(3).map(card => <ListingCard key={card.rank} card={card} />)}
      </div>
    </section>
  </main>
}

function ListingCard({card,featured}){
  return <article className={`listing ${featured?'featured':''}`}>
    <div className="rank">#{card.rank}</div>
    <div className="avatar">{card.icon}</div>
    <div className="listing-main">
      <div className="listing-title-row"><div><h4>{card.name}</h4><span className="category">{card.category}</span></div><strong className="bid">₹{card.amount}</strong></div>
      <p>{card.desc}</p>
      <div className="meta"><span>{card.clicks} clicks</span><span>•</span><span>{card.time}</span></div>
    </div>
    <button className="take-spot">Take this spot <ExternalLink size={15}/></button>
  </article>
}

function SimplePage({title,text}){
  return <main className="simple-page"><span className="eyebrow">MADE IN DAMAN®</span><h1>{title}</h1><p>{text}</p></main>
}

createRoot(document.getElementById('root')).render(<App />);
