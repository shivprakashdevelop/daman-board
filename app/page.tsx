"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type PackageId = "homepage" | "category" | "feature";

type CampaignPackage = {
  id: PackageId;
  eyebrow: string;
  name: string;
  duration: string;
  price: number;
  placement: string;
  useCase: string;
  metrics: string;
  accent: string;
};

const campaignPackages: CampaignPackage[] = [
  {
    id: "homepage",
    eyebrow: "Fast signal",
    name: "24-hour Homepage Spotlight",
    duration: "24 hours",
    price: 29,
    placement: "Top of the Daman board",
    useCase: "A new offer, event, opening, or time-sensitive announcement.",
    metrics: "Homepage impressions · actions",
    accent: "blue",
  },
  {
    id: "category",
    eyebrow: "Stay discoverable",
    name: "7-day Category Spotlight",
    duration: "7 days",
    price: 149,
    placement: "Featured in one category",
    useCase: "Stay visible while people compare local places and services.",
    metrics: "Listing impressions · views · actions",
    accent: "lime",
  },
  {
    id: "feature",
    eyebrow: "Your full story",
    name: "30-day Local Business Feature",
    duration: "30 days",
    price: 399,
    placement: "Featured listing + category board",
    useCase: "Build a stronger local presence with a richer business profile.",
    metrics: "Unique viewers · views · actions",
    accent: "orange",
  },
];

const categories = ["All areas", "Food & drink", "Things to do", "Services", "Community", "Wellness", "Shopping & stays"];

const categoryCards = [
  { name: "Food & drink", description: "Cafés, kitchens, bakeries, and places to linger.", tags: "Eat · drink · gather", accent: "category-card-lime" },
  { name: "Things to do", description: "Events, experiences, and your next good plan.", tags: "Go · see · do", accent: "category-card-blue" },
  { name: "Services", description: "Local help from people who know the place.", tags: "Make · fix · learn", accent: "category-card-orange" },
  { name: "Community", description: "Projects, groups, and ideas worth showing up for.", tags: "Join · support · share", accent: "category-card-coral" },
  { name: "Wellness", description: "Movement, care, and small habits close to home.", tags: "Move · care · reset", accent: "category-card-soft" },
  { name: "Shopping & stays", description: "Independent shops and places to settle in.", tags: "Browse · buy · stay", accent: "category-card-soft" },
];

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-lockup ${compact ? "brand-lockup-compact" : ""}`}>
      <span className="brand-mark" aria-hidden="true">B</span>
      <span className="brand-wordmark">Best in <em>Daman</em></span>
    </span>
  );
}

function Icon({ children, label }: { children: string; label?: string }) {
  return <span className="ui-icon" aria-hidden={label ? undefined : true} aria-label={label}>{children}</span>;
}

function Money({ amount }: { amount: number }) {
  return <span className="money"><small>₹</small>{amount}</span>;
}

export default function Home() {
  const [selectedPackage, setSelectedPackage] = useState<PackageId>("category");
  const [filter, setFilter] = useState("All areas");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [formState, setFormState] = useState<"idle" | "submitted">("idle");
  const chosenPackage = campaignPackages.find((item) => item.id === selectedPackage) ?? campaignPackages[1];

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("submitted");
  }

  function browseCategory(category: string) {
    setFilter(category);
    document.getElementById("board")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header shell">
        <a className="brand-link" href="#top" aria-label="Best in Daman home"><Logo /></a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#how-it-works">How it works</a><a href="/directory">Directory</a>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><Icon>{theme === "light" ? "☾" : "☼"}</Icon></button>
          <a className="button button-small button-primary" href="#book">List your place</a>
        </div>
      </header>

      <div id="main-content">
        <section className="hero shell" id="top">
          <div className="hero-copy">
            <div className="kicker"><span className="kicker-dot" /> Daman, made more discoverable</div>
            <h1>Find great places.<span className="headline-accent">Or make sure they can find you.</span></h1>
            <p className="hero-description">Discover the businesses, creators, events, and community projects that make Daman worth finding — or put your own good work on the map.</p>
            <div className="hero-actions"><a className="button button-primary" href="#book">Start a campaign <Icon>↗</Icon></a><a className="text-link" href="#how-it-works">See how it works <Icon>↓</Icon></a></div>
            <div className="hero-note"><span className="mini-avatars" aria-hidden="true"><i>◐</i><i>✳</i><i>○</i></span><span>Made for local discovery, reviewed by real people.</span></div>
          </div>

          <div className="hero-visual" aria-label="A preview of the Best in Daman local board">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="hero-sticker sticker-blue">LOCAL<br /><strong>MATTERS</strong></div><div className="hero-sticker sticker-orange">₹29<br /><small>to be seen</small></div>
            <div className="board-window">
              <div className="board-window-top"><span className="window-dots"><i /><i /><i /></span><span className="window-label">daman / live board</span><span className="window-menu">•••</span></div>
              <div className="board-window-title"><span>Find your next<br /><strong>local favourite.</strong></span><span className="window-arrow">↗</span></div>
              <div className="mock-listing mock-listing-green"><span className="mock-avatar">D</span><span><strong>Discover something new</strong><small>Food · things to do · services</small></span><span className="mock-chevron">›</span></div>
              <div className="mock-listing mock-listing-yellow"><span className="mock-avatar">+</span><span><strong>Your next customer is nearby.</strong><small>Book a fixed-price spotlight</small></span><span className="mock-chevron">›</span></div>
              <div className="window-footer"><span>Live counters stay honest.</span><span>best in daman <b>●</b></span></div>
            </div>
          </div>
        </section>

        <section className="ticker" aria-label="Best in Daman principles">
          <div className="ticker-track">
            <div className="ticker-set">
              <span>Fixed-price visibility</span><i>✳</i><span>Built for Daman</span><i>✳</i><span>Reviewed before going live</span><i>✳</i><span>Track what matters</span><i>✳</i>
            </div>
            <div className="ticker-set" aria-hidden="true">
              <span>Fixed-price visibility</span><i>✳</i><span>Built for Daman</span><i>✳</i><span>Reviewed before going live</span><i>✳</i><span>Track what matters</span><i>✳</i>
            </div>
          </div>
        </section>

        <section className="section shell packages-section" id="packages">
          <div className="section-heading heading-split"><div><div className="eyebrow">Choose your spotlight</div><h2>Simple campaigns.<br /><span>Clear outcomes.</span></h2></div><p>Every package is fixed-price, time-bound, and built for a different moment in your local story.</p></div>
          <div className="package-grid">
            {campaignPackages.map((item, index) => <article className={`package-card package-card-${item.accent}`} key={item.id}>
              <div className="package-topline"><span>0{index + 1}</span><span className="package-arrow">↗</span></div>
              <div className="package-copy"><div className="package-eyebrow">{item.eyebrow}</div><h3>{item.name}</h3><p>{item.useCase}</p></div>
              <div className="package-rule" /><div className="package-details"><div><span>Placement</span><strong>{item.placement}</strong></div><div><span>Reporting</span><strong>{item.metrics}</strong></div></div>
              <div className="package-footer"><div><Money amount={item.price} /><span className="duration">/ {item.duration}</span></div><button className="text-button" type="button" onClick={() => { setSelectedPackage(item.id); document.getElementById("book")?.scrollIntoView({ behavior: "smooth" }); }}>Choose package <Icon>↗</Icon></button></div>
            </article>)}
          </div>
          <div className="pricing-footnote"><Icon>✓</Icon> No bidding. No surprise charges. You approve the destination before we review it.</div>
        </section>

        <section className="section shell category-section" id="categories">
          <div className="section-heading category-heading"><div><div className="eyebrow">Explore Daman</div><h2>Browse by<br /><span>category.</span></h2></div><p>Start with what you’re in the mood for. When campaigns go live, each category will show approved local listings and their real activity.</p></div>
          <div className="category-grid">{categoryCards.map((category, index) => <button className={`category-card ${category.accent}`} type="button" key={category.name} onClick={() => browseCategory(category.name)}><span className="category-card-top"><span>0{index + 1}</span><span>↗</span></span><span className="category-card-title">{category.name}</span><span className="category-card-description">{category.description}</span><span className="category-card-footer"><span>{category.tags}</span><b>Explore</b></span></button>)}</div>
        </section>

        <section className="section how-section" id="how-it-works"><div className="shell">
          <div className="section-heading heading-split"><div><div className="eyebrow">From idea to local reach</div><h2>One clear path<br /><span>to live.</span></h2></div><p>Your campaign starts as a submission, gets a quick human review, and only appears publicly once it is approved and active.</p></div>
          <div className="steps-grid">
            <article className="step-card"><div className="step-number">01</div><div className="step-icon">⌕</div><h3>Choose a package</h3><p>Pick the fixed-price placement that fits your moment and your budget.</p><a href="#packages">Explore packages <Icon>↗</Icon></a></article>
            <article className="step-card step-card-highlight"><div className="step-number">02</div><div className="step-icon">✓</div><h3>Submit for review</h3><p>Share a destination, a short description, and the action you want people to take.</p><a href="#book">Start a submission <Icon>↗</Icon></a></article>
            <article className="step-card"><div className="step-number">03</div><div className="step-icon">◷</div><h3>See what happens</h3><p>Once live, your owner view keeps impressions, views, and actions separate and clear.</p><a href="#metrics">See the metrics <Icon>↓</Icon></a></article>
          </div>
        </div></section>

        <section className="section board-section shell" id="board">
          <div className="section-heading board-heading"><div><div className="eyebrow">The public board</div><h2>What’s worth<br /><span>finding in Daman.</span></h2></div><div className="board-heading-copy"><p>Approved campaigns become compact, useful listings for people looking for something local.</p><a className="text-link" href="#book">Put your listing here <Icon>↗</Icon></a></div></div>
          <div className="board-toolbar"><div className="filter-row" role="group" aria-label="Filter by category">{categories.map((item) => <button className={`filter-pill ${filter === item ? "filter-pill-active" : ""}`} type="button" key={item} onClick={() => setFilter(item)}>{item}</button>)}</div><span className="board-count"><span className="status-dot" /> Live board</span></div>
          <div className="board-empty"><div className="empty-orbit"><span>✳</span></div><div><div className="empty-label">{filter === "All areas" ? "The board is ready" : `${filter} is ready`}</div><h3>No campaigns live yet.</h3><p>The first approved campaign will appear here with its destination, duration, and real engagement metrics.</p><a className="button button-dark" href="#book">Be first to be seen <Icon>↗</Icon></a></div></div>
          <div className="metrics-strip" id="metrics"><div className="metrics-intro"><span className="live-pulse" /><strong>Live counters</strong><span>production data only</span></div><div className="metric-item"><span>Homepage impressions</span><strong>—</strong></div><div className="metric-item"><span>Listing views</span><strong>—</strong></div><div className="metric-item"><span>Tracked actions</span><strong>—</strong></div></div>
        </section>

        <section className="section book-section shell" id="book">
          <div className="book-intro"><div className="eyebrow">Ready when you are</div><h2>Put your good<br /><span>stuff on the map.</span></h2><p>Tell us where people should go, what they’ll find there, and which campaign fits. All submissions begin as pending and are reviewed before they go live.</p><div className="book-assurance"><span className="assurance-mark">✓</span><span><strong>Human-reviewed</strong><br />Every destination is checked before approval.</span></div><div className="book-assurance"><span className="assurance-mark">₹</span><span><strong>Fixed total</strong><br />The price you see is the price you pay.</span></div></div>

          <div className="booking-panel">
            {formState === "submitted" ? <div className="form-success" role="status"><div className="success-icon">✓</div><div className="eyebrow">Submission received</div><h3>Your campaign is pending review.</h3><p>We’ll review the destination and details, then confirm the next step with you. This preview does not create a production record.</p><button className="button button-dark" type="button" onClick={() => setFormState("idle")}>Submit another campaign <Icon>↗</Icon></button></div> : <form onSubmit={handleSubmit}>
              <div className="form-header"><div><span className="form-step">01 / 03</span><h3>Tell us about it.</h3></div><span className="form-status"><span /> Pending review</span></div>
              <div className="form-grid">
                <label className="field field-wide"><span>Destination link <b>*</b></span><input required type="url" placeholder="https://yourwebsite.com" /><small>Website, Instagram, WhatsApp, or booking URL</small></label>
                <label className="field"><span>Listing / business name <b>*</b></span><input required type="text" placeholder="How should we call you?" /></label><label className="field"><span>Category <b>*</b></span><select required defaultValue=""><option value="" disabled>Select a category</option><option>Food & drink</option><option>Things to do</option><option>Services</option><option>Community</option></select></label>
                <label className="field field-wide"><span>Short description <b>*</b></span><textarea required placeholder="What should people know in one or two sentences?" rows={3} /></label>
                <label className="field"><span>Owner name <b>*</b></span><input required type="text" placeholder="Your name" /></label><label className="field"><span>Email or phone <b>*</b></span><input required type="text" placeholder="How can we reach you?" /></label><label className="field"><span>Campaign starts <b>*</b></span><input required type="date" /></label><label className="field"><span>Preferred CTA</span><select defaultValue="WhatsApp"><option>WhatsApp</option><option>Call</option><option>Directions</option><option>Instagram</option><option>Visit website</option></select></label>
              </div>
              <div className="package-picker"><div className="picker-label">02 / 03 <span>Choose a package</span></div><div className="picker-options">{campaignPackages.map((item) => <button type="button" className={`picker-option ${selectedPackage === item.id ? "picker-option-selected" : ""}`} key={item.id} onClick={() => setSelectedPackage(item.id)}><span><strong>{item.name.replace("Local Business Feature", "Business Feature")}</strong><small>{item.duration} · <Money amount={item.price} /></small></span><span className="picker-check">{selectedPackage === item.id ? "✓" : ""}</span></button>)}</div></div>
              <div className="order-summary"><div className="summary-label">03 / 03 <span>Order summary</span></div><div className="summary-line"><div><strong>{chosenPackage.name}</strong><span>{chosenPackage.placement} · {chosenPackage.duration}</span></div><Money amount={chosenPackage.price} /></div><div className="summary-total"><span>Fixed total</span><strong><Money amount={chosenPackage.price} /></strong></div></div>
              <label className="consent"><input required type="checkbox" /><span>I agree to the <Link href="/policies/terms">Terms</Link> and <Link href="/policies/privacy">Privacy Policy</Link>, and understand campaigns are reviewed before going live.</span></label><button className="button button-primary button-submit" type="submit">Submit for review <Icon>↗</Icon></button><p className="form-footnote">Payment is confirmed after approval. Manual bank transfer / business UPI is available if needed.</p>
            </form>}
          </div>
        </section>

        <section className="section owner-section shell"><div className="owner-card"><div className="owner-card-copy"><div className="eyebrow">For owners</div><h2>Keep an eye<br /><span>on what moves.</span></h2><p>Look up your campaign to review status, dates, payment notes, and the actions people take after they find you.</p><a className="button button-light" href="/owner">Open owner lookup <Icon>↗</Icon></a></div><div className="owner-mini-dashboard"><div className="mini-dash-top"><span>Campaign view</span><span className="mini-dash-pill">Not live yet</span></div><div className="mini-chart"><span>analytics will appear once approved</span><i /><i /><i /><i /><i /><i /><i /></div><div className="mini-dash-footer"><span>Campaign status</span><strong>Pending review</strong></div></div></div></section>
      </div>

      <footer className="site-footer"><div className="shell footer-main"><div><Logo /><p>Local digital visibility for Daman.<br />Useful, fixed-price, human-reviewed.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#packages">Campaigns</a><a href="#board">Local board</a><a href="/directory">Directory</a><a href="#how-it-works">How it works</a><a href="/admin">Admin foundation</a></div><div><strong>Trust</strong><a href="/about">About</a><a href="/contact">Contact</a><Link href="/policies/terms">Terms</Link><Link href="/policies/privacy">Privacy</Link></div><div><strong>Policies</strong><Link href="/policies/refunds">Refunds & cancellation</Link><Link href="/policies/guidelines">Advertising guidelines</Link></div></div></div><div className="shell footer-bottom"><span>© 2026 Best in Daman</span><span>Built for the people looking local.</span><span>Made with <b>♥</b> in Daman</span></div></footer>
    </main>
  );
}
