"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Theme = "light" | "dark";
type PackageId = "homepage" | "category" | "feature";

type CampaignPackage = {
  id: PackageId;
  name: string;
  duration: string;
  price: number;
  description: string;
};

const campaignPackages: CampaignPackage[] = [
  { id: "homepage", name: "24-hour Homepage Spotlight", duration: "24 hours", price: 29, description: "A fast signal for a new offer or event." },
  { id: "category", name: "Category Spotlight", duration: "7 days", price: 149, description: "Stay visible while locals compare." },
  { id: "feature", name: "Business Feature", duration: "30 days", price: 399, description: "Give your place a fuller local story." },
];

const popularCategories = ["Food & drink", "Things to do", "Services", "Community", "Wellness", "Shopping & stays"];

const exploreCategories = [
  { name: "Food & drink", tags: ["Cafés", "Local plates", "Bakeries"], more: "+12", tone: "lime" },
  { name: "Things to do", tags: ["Events", "Experiences", "Weekend plans"], more: "+10", tone: "blue" },
  { name: "Services", tags: ["Repairs", "Design", "Local help"], more: "+9", tone: "orange" },
  { name: "Community", tags: ["Projects", "Groups", "Workshops"], more: "+7", tone: "coral" },
  { name: "Wellness", tags: ["Movement", "Care", "Recovery"], more: "+6", tone: "soft" },
  { name: "Shopping & stays", tags: ["Independent shops", "Rooms", "Gifts"], more: "+8", tone: "soft" },
  { name: "Creative studios", tags: ["Branding", "Photography", "Making"], more: "+5", tone: "blue" },
  { name: "Learning", tags: ["Classes", "Tutors", "Skill shares"], more: "+4", tone: "lime" },
  { name: "Outdoors", tags: ["Coast", "Walks", "Fresh air"], more: "+3", tone: "orange" },
  { name: "Local stays", tags: ["Hotels", "Homestays", "Weekends"], more: "+5", tone: "coral" },
];

const freshListings = [
  { initials: "HL", name: "Harbour & Lime Café", category: "Food & drink", detail: "Coffee, coastal plates, and a slow table.", tone: "lime", joined: "Joined 2d ago" },
  { initials: "DW", name: "Daman Ganga Sunset Walks", category: "Things to do", detail: "Easy evening routes for curious locals.", tone: "blue", joined: "Joined 3d ago" },
  { initials: "TT", name: "Tide & Type Studio", category: "Services", detail: "Brand, web, and signage help for nearby makers.", tone: "orange", joined: "Joined 5d ago" },
];

function Logo() {
  return <span className="ref-logo">Best in <em>Daman</em></span>;
}

function Icon({ children }: { children: string }) {
  return <span className="ref-icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("best-in-daman-theme") === "dark" ? "dark" : "light";
  });
  const [target, setTarget] = useState(600);
  const [boosted, setBoosted] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("category");
  const [formState, setFormState] = useState<"idle" | "submitted">("idle");
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("best-in-daman-theme", theme);
  }, [theme]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitted");
  }

  function handleBoost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBoosted(true);
  }

  return (
    <main className="reference-home">
      <a className="ref-skip" href="#main-content">Skip to content</a>

      <header className="ref-header">
        <Link className="ref-header-logo" href="/" aria-label="Best in Daman home"><Logo /></Link>
        <nav className="ref-nav" aria-label="Main navigation">
          <a href="#how">How it works</a>
          <Link href="/directory">Directory</Link>
        </nav>
        <div className="ref-header-actions">
          <button className="ref-theme-toggle" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>
            <Icon>{theme === "light" ? "☾" : "☀"}</Icon>
          </button>
          <a className="ref-header-cta" href="#book">List your place</a>
        </div>
      </header>

      <div id="main-content">
        <section className="ref-hero" aria-labelledby="hero-title">
          <div className="ref-container ref-hero-inner">
            <span className="ref-chip"><span className="ref-chip-dot" aria-hidden="true" />Local discovery board</span>
            <h1 id="hero-title">Find great places.<br />Or make sure they can find you.</h1>
            <p className="ref-hero-lede">Browse businesses, events, services, and community projects across Daman — or list your place for free and let people find you directly.</p>
            <div className="ref-hero-actions">
              <a className="ref-button ref-button-outline" href="/directory">Browse Daman <Icon>→</Icon></a>
              <a className="ref-button ref-button-blue" href="#book">List your place free <Icon>→</Icon></a>
            </div>
            <p className="ref-hero-note">Contact places directly — no project posting, proposals, or long forms.</p>
            <div className="ref-popular-row">
              <span className="ref-muted-label">Popular</span>
              <div className="ref-popular-list">
                {popularCategories.map((category) => <Link href="/directory" key={category}>{category}</Link>)}
              </div>
            </div>
          </div>

          <div className="ref-container ref-sponsored">
            <div className="ref-sponsored-grid">
              <article className="ref-featured-card">
                <div className="ref-sponsored-card-heading"><span>Sponsored</span><span className="ref-chip">All-time</span></div>
                <div className="ref-rank-list">
                  <div className="ref-rank-row ref-rank-row-top"><span className="ref-rank-badge">#1</span><div className="ref-avatar ref-avatar-lime">HL</div><div className="ref-rank-copy"><p>Harbour &amp; Lime Café</p><span>Food &amp; drink</span></div><div className="ref-rank-total"><p>₹1,200</p><span>all-time</span></div></div>
                  <div className="ref-rank-row"><span className="ref-rank-badge">#2</span><div className="ref-avatar ref-avatar-blue">DW</div><div className="ref-rank-copy"><p>Daman Ganga Sunset Walks</p><span>Things to do</span></div><div className="ref-rank-total"><p>₹850</p><span>all-time</span></div></div>
                  <div className="ref-rank-row"><span className="ref-rank-badge">#3</span><div className="ref-avatar ref-avatar-orange">TT</div><div className="ref-rank-copy"><p>Tide &amp; Type Studio</p><span>Services</span></div><div className="ref-rank-total"><p>₹600</p><span>all-time</span></div></div>
                </div>
              </article>
              <div className="ref-side-stack">
                <article className="ref-profile-card"><div className="ref-profile-top"><div className="ref-avatar ref-avatar-coral">HL</div><div className="ref-profile-copy"><p>Harbour &amp; Lime Café</p><span>Coastal plates &amp; good coffee</span></div><span className="ref-status">Now</span></div><div className="ref-profile-tags"><span>Coastal plates</span><span>Good coffee</span><span>Open today</span></div></article>
                <article className="ref-boost-card"><div className="ref-boost-card-heading"><span>Boost a place</span><span>Currently #2</span></div><p><strong>₹850</strong> all-time</p><div className="ref-boost-card-actions"><button type="button" onClick={() => setTarget((value) => value + 100)}>Take #1 · ₹1,200</button><button type="button" onClick={() => setTarget(600)}>₹500 min</button></div></article>
              </div>
            </div>
          </div>
        </section>

        <section className="ref-market ref-container" id="market" aria-labelledby="market-title">
          <div className="ref-market-heading"><div><span className="ref-overline">Live market</span><h2 id="market-title">The Daman 50</h2></div><span className="ref-market-count">3 of 50 claimed</span></div>
          <div className="ref-market-grid">
            <div className="ref-market-copy"><p>Give a local place a lift. A higher all-time total earns a higher place on the board.</p><span className="ref-market-disclaimer">₹500 minimum · anyone can boost anyone. Positions hold until another listing overtakes them. No campaigns live yet in this preview.</span><a className="ref-text-link" href="#how">How boosting works <Icon>→</Icon></a></div>
            <form className="ref-boost-panel" onSubmit={handleBoost}>
              <div className="ref-boost-heading"><span>Boost a place</span><span className="ref-live-label"><i /> Live</span></div>
              <h3>Claim a better<br /><span>spot.</span></h3>
              <label className="ref-search"><span>⌕</span><input aria-label="Search for a Daman listing to boost" placeholder="Search for a place to boost…" /></label>
              <div className="ref-target-row"><span>Target all-time total</span><div><button aria-label="Decrease target" type="button" onClick={() => setTarget((value) => Math.max(500, value - 100))}>−</button><span>₹{target.toLocaleString("en-IN")}</span><button aria-label="Increase target" type="button" onClick={() => setTarget((value) => value + 100)}>+</button></div></div>
              <button className="ref-button ref-button-dark" type="submit">{boosted ? "Boost ready" : "Boost to #1"} <Icon>→</Icon></button>
              <small>{boosted ? "Your preview boost is ready to review." : "Boost your own place or a local favourite."}</small>
            </form>
          </div>
        </section>

        <section className="ref-explore" id="categories" aria-labelledby="explore-title">
          <div className="ref-container"><div className="ref-section-intro"><span className="ref-overline">Explore</span><h2 id="explore-title">Browse by category</h2><p>Find the right local place, person, or plan for what you need next.</p></div><div className="ref-category-grid">
            {exploreCategories.map((category) => <Link className={`ref-category-card ref-tone-${category.tone}`} href="/directory" key={category.name}><div className="ref-category-top"><span>{category.name}</span><Icon>↗</Icon></div><div className="ref-category-tags">{category.tags.map((tag) => <span key={tag}>{tag}</span>)}<span>{category.more}</span></div><div className="ref-category-footer"><span>Explore</span><Icon>→</Icon></div></Link>)}
          </div></div>
        </section>

        <section className="ref-loop" id="how" aria-labelledby="loop-title">
          <div className="ref-container">
            <div className="ref-loop-intro"><span className="ref-overline">The core loop</span><h2 id="loop-title">How local visibility<br /><span>becomes action.</span></h2><p className="ref-loop-lede">List for free, go live instantly, and let people discover, contact, and support the places they rate.</p></div>
            <div className="ref-loop-grid">
              <div><ol className="ref-steps"><li><b>1</b><div><strong>List your place</strong><span>Add a profile in minutes.</span></div></li><li><b>2</b><div><strong>Go live</strong><span>Appear in the Daman directory right away.</span></div></li><li><b>3</b><div><strong>Get discovered</strong><span>People browse by what they need.</span></div></li><li><b>4</b><div><strong>Get contacted</strong><span>Turn attention into your next visit.</span></div></li></ol><p className="ref-loop-footnote">Featured placements are paid visibility — not an endorsement of quality. Like their work? Support them.</p></div>
              <div className="ref-live-card"><div className="ref-live-card-top"><span>Food &amp; drink</span><span>Sponsored · Daman</span></div><div className="ref-live-card-rank">#1 <span>all-time</span></div><div className="ref-live-card-person"><div className="ref-avatar ref-avatar-lime">HL</div><div><strong>Harbour &amp; Lime Café</strong><span>Coastal plates &amp; good coffee</span></div></div><div className="ref-live-card-meta"><span>3,200 views</span><span>₹1,200 boosted</span></div><a className="ref-button ref-button-blue" href="/directory">View listing <Icon>→</Icon></a></div>
            </div>
          </div>
        </section>

        <section className="ref-fresh ref-container" id="fresh" aria-labelledby="fresh-title">
          <div className="ref-section-heading"><div><span className="ref-overline">Just joined</span><h2 id="fresh-title">Fresh listings</h2><p>New places, projects, and people worth finding.</p></div><Link className="ref-text-link" href="/directory">Browse the directory <Icon>→</Icon></Link></div>
          <div className="ref-fresh-grid">{freshListings.map((listing) => <article className="ref-fresh-card" key={listing.name}><div className="ref-fresh-top"><div className={`ref-avatar ref-avatar-${listing.tone}`}>{listing.initials}</div><span className="ref-status">Available now</span></div><a href="/directory" className="ref-fresh-name">{listing.name}</a><p>{listing.category}</p><small>{listing.joined}</small><div className="ref-fresh-footer"><span>{listing.detail}</span><Icon>↗</Icon></div></article>)}</div>
        </section>

        <section className="ref-book ref-container" id="book" aria-labelledby="book-title">
          {formState === "submitted" ? <div className="ref-submit-success"><span className="ref-success-mark">✓</span><span className="ref-overline">Submission received</span><h2>Your place is pending review.</h2><p>We’ll review the details and confirm the next step with you. This preview does not create a production record.</p><button className="ref-button ref-button-dark" type="button" onClick={() => setFormState("idle")}>Submit another place <Icon>→</Icon></button></div> : <><div className="ref-book-copy"><span className="ref-overline">Ready to be found?</span><h2 id="book-title">Put your good<br /><span>stuff on the map.</span></h2><p>List your place for free. Choose a fixed-price spotlight when you want a little more attention.</p><a className="ref-text-link" href="/directory">See the directory <Icon>→</Icon></a></div><form className="ref-list-form" onSubmit={handleSubmit}><div className="ref-form-top"><span>List your place</span><span>Free to start</span></div><label><span>Place or business name</span><input required placeholder="How should we call you?" /></label><label><span>What do you do?</span><input required placeholder="Food, services, events, community…" /></label><label><span>Link to your place</span><input required type="url" placeholder="https://yourwebsite.com" /></label><div className="ref-package-picker"><span>Want a spotlight?</span><div>{campaignPackages.map((item) => <button type="button" className={selectedPackage === item.id ? "selected" : ""} key={item.id} onClick={() => setSelectedPackage(item.id)}><b>{item.name}</b><small>{item.duration} · ₹{item.price}</small></button>)}</div></div><button className="ref-button ref-button-blue ref-form-submit" type="submit">Submit for review <Icon>→</Icon></button><small className="ref-form-note">No bidding. No surprise charges. We review every listing before it goes live.</small></form></>}
        </section>
      </div>

      <footer className="ref-footer"><div className="ref-container ref-footer-main"><div><Logo /><p>Get seen by the people<br />looking local in Daman.</p></div><div className="ref-footer-links"><div><strong>Explore</strong><Link href="/directory">Directory</Link><a href="#fresh">Fresh listings</a><a href="#how">How it works</a><a href="#book">List your place</a></div><div><strong>Trust</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/policies/privacy">Privacy</Link><Link href="/policies/terms">Terms</Link></div></div></div><div className="ref-container ref-footer-bottom"><span>© 2026 Best in Daman</span><span>Made for people looking local.</span><span>Made with <b>♥</b> in Daman</span></div></footer>
    </main>
  );
}
