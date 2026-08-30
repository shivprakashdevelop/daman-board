"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type DirectoryType = "all" | "business" | "event" | "service" | "community";

const directoryCategories = ["All categories", "Food & drink", "Things to do", "Services", "Community", "Wellness", "Shopping & stays"];
const directoryTypes: Array<{ value: DirectoryType; label: string }> = [
  { value: "all", label: "All listings" },
  { value: "business", label: "Businesses" },
  { value: "event", label: "Events" },
  { value: "service", label: "Services" },
  { value: "community", label: "Community" },
];
const directoryAreas = ["Anywhere", "Moti Daman", "Nani Daman", "Daman Ganga", "Nearby"];
const directoryStatuses = ["All statuses", "Live now", "Opening soon"];
type DirectoryListing = {
  id: string;
  name: string;
  initials: string;
  description: string;
  category: string;
  type: Exclude<DirectoryType, "all">;
  area: string;
  status: Exclude<(typeof directoryStatuses)[number], "All statuses">;
  accent: string;
};

const directoryListings: DirectoryListing[] = [
  { id: "harbour-lime", name: "Harbour & Lime Café", initials: "HL", description: "Coffee, coastal plates, and a slow table.", category: "Food & drink", type: "business", area: "Moti Daman", status: "Live now", accent: "directory-avatar-lime" },
  { id: "sunset-walks", name: "Daman Ganga Sunset Walks", initials: "DW", description: "Easy evening routes for curious locals.", category: "Things to do", type: "event", area: "Nani Daman", status: "Opening soon", accent: "directory-avatar-blue" },
  { id: "tide-type", name: "Tide & Type Studio", initials: "TT", description: "Small brand, web, and signage help for nearby makers.", category: "Services", type: "service", area: "Daman Ganga", status: "Live now", accent: "directory-avatar-orange" },
  { id: "paper-boat", name: "The Paper Boat Project", initials: "PB", description: "Community workshops and things worth showing up for.", category: "Community", type: "community", area: "Moti Daman", status: "Live now", accent: "directory-avatar-coral" },
  { id: "palm-pause", name: "Palm & Pause Wellness", initials: "PP", description: "Movement and recovery, kept close to home.", category: "Wellness", type: "business", area: "Nani Daman", status: "Opening soon", accent: "directory-avatar-soft" },
  { id: "saltline-stay", name: "Saltline Stay Co.", initials: "SS", description: "Independent rooms for weekends by the coast.", category: "Shopping & stays", type: "business", area: "Moti Daman", status: "Live now", accent: "directory-avatar-blue" },
];

function Logo() {
  return <span className="brand-lockup"><span className="brand-mark" aria-hidden="true">B</span><span className="brand-wordmark">Best in <em>Daman</em></span></span>;
}

function Icon({ children }: { children: string }) {
  return <span className="ui-icon" aria-hidden="true">{children}</span>;
}

export default function DirectoryPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<DirectoryType>("all");
  const [category, setCategory] = useState("All categories");
  const [area, setArea] = useState("Anywhere");
  const [status, setStatus] = useState("All statuses");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  const hasFilters = Boolean(query.trim()) || type !== "all" || category !== "All categories" || area !== "Anywhere" || status !== "All statuses";
  const filteredListings = directoryListings.filter((listing) => {
    const searchText = `${listing.name} ${listing.description} ${listing.category} ${listing.area}`.toLowerCase();
    return (!query.trim() || searchText.includes(query.trim().toLowerCase()))
      && (type === "all" || listing.type === type)
      && (category === "All categories" || listing.category === category)
      && (area === "Anywhere" || listing.area === area)
      && (status === "All statuses" || listing.status === status);
  });

  function clearFilters() {
    setQuery("");
    setType("all");
    setCategory("All categories");
    setArea("Anywhere");
    setStatus("All statuses");
  }

  return (
    <main className="directory-page">
      <a className="skip-link" href="#directory-content">Skip to content</a>

      <header className="site-header shell directory-header">
        <Link className="brand-link" href="/" aria-label="Best in Daman home"><Logo /></Link>
        <nav className="desktop-nav" aria-label="Directory navigation">
          <Link href="/">Home</Link><Link href="/#how-it-works">How it works</Link><Link className="directory-nav-active" href="/directory">Directory</Link>
        </nav>
        <div className="header-actions">
          <button className="theme-toggle" type="button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><Icon>{theme === "light" ? "☾" : "☼"}</Icon></button>
          <Link className="button button-small directory-header-cta" href="/#book">List your place</Link>
        </div>
      </header>

      <div className="shell directory-main" id="directory-content">
        <Link className="directory-back" href="/"><Icon>←</Icon> Home</Link>

        <section className="directory-intro" aria-labelledby="directory-title">
          <div className="eyebrow">Directory</div>
          <h1 id="directory-title">All local<br /><span>discoveries.</span></h1>
          <p className="directory-lede">Every approved business, event, service, and community project in Daman, filterable by what you need. The first listings will appear here after review.</p>
        </section>

        <section className="directory-filters" aria-label="Filter the Daman directory">
          <form className="directory-search" onSubmit={handleSearch}>
            <label className="directory-search-box">
              <span className="directory-search-icon" aria-hidden="true">⌕</span>
              <span className="sr-only">Search the directory</span>
              <input aria-label="Search by name or what you need" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or what you need…" />
            </label>
            <button className="button button-primary directory-search-button" type="submit">Search</button>
          </form>

          <div className="directory-filter-grid">
            <label className="directory-filter-field"><span>Type</span><select value={type} onChange={(event) => setType(event.target.value as DirectoryType)}>{directoryTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
            <label className="directory-filter-field"><span>Category</span><select value={category} onChange={(event) => setCategory(event.target.value)}>{directoryCategories.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="directory-filter-field"><span>Area</span><select value={area} onChange={(event) => setArea(event.target.value)}>{directoryAreas.map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className="directory-filter-field"><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{directoryStatuses.map((item) => <option key={item}>{item}</option>)}</select></label>
          </div>
        </section>

        <section className="directory-results" aria-labelledby="directory-results-title">
          <div className="directory-results-heading">
            <div><div className="eyebrow">Public board preview</div><h2 id="directory-results-title">{hasFilters ? "Matches nearby." : "Everyone local."}</h2></div>
            <span className="directory-count" aria-live="polite">{filteredListings.length} sample {filteredListings.length === 1 ? "entry" : "entries"}</span>
          </div>

          {filteredListings.length > 0 ? <div className="directory-listings" role="list">
            {filteredListings.map((listing) => <div className="directory-listing" role="listitem" key={listing.id}>
              <div className={`directory-listing-avatar ${listing.accent}`} aria-hidden="true">{listing.initials}</div>
              <div className="directory-listing-copy"><div className="directory-listing-title"><h3>{listing.name}</h3><span className="directory-preview-pill"><i />Preview only</span></div><p>{listing.description}</p><div className="directory-listing-meta"><span>{listing.category}</span><span>·</span><span>{listing.area}</span><span>·</span><span>{listing.status}</span></div></div>
              <div className="directory-listing-side"><strong>Sample</strong><span>local listing</span></div>
            </div>)}
          </div> : <div className="directory-empty">
            <div className="empty-orbit" aria-hidden="true"><span>✳</span></div>
            <div>
              <div className="empty-label">No sample entries match</div>
              <h3>Try another search.</h3>
              <p>These preview cards are only here to show how the directory will feel. Clear the filters or browse the sample entries again.</p>
              <div className="directory-empty-actions">
                <button className="button button-dark" type="button" onClick={clearFilters}>Show all entries <Icon>↗</Icon></button>
              </div>
            </div>
          </div>}

          <div className="directory-honesty"><span className="trust-icon" aria-hidden="true">◎</span><p><strong>Preview mode.</strong> These Daman entries are sample content for layout testing only. They are not live businesses, reviews, or production campaign records.</p></div>
        </section>

        <section className="directory-guide" aria-label="Directory guidance">
          <div className="directory-guide-card directory-guide-lime"><div className="eyebrow">For local owners</div><h2>Be first to be<br /><span>found.</span></h2><p>Choose a fixed-price spotlight and give people a clear next step.</p><Link className="text-link" href="/#book">Start a campaign <Icon>↗</Icon></Link></div>
          <div className="directory-guide-card"><div className="eyebrow">What gets listed</div><h2>Useful places,<br /><span>close by.</span></h2><div className="directory-topic-list"><span>Food & drink</span><span>Things to do</span><span>Services</span><span>Community</span></div></div>
        </section>
      </div>
    </main>
  );
}
