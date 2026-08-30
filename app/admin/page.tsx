import Link from "next/link";

const statusRows = [
  ["Pending review", "—", "Awaiting the first submission"],
  ["Active campaigns", "—", "Only approved + currently active"],
  ["Payment records", "—", "Confirmation required"],
];

export default function AdminPage() {
  return (
    <main className="admin-page">
      <header className="site-header shell"><Link className="brand-link" href="/"><span className="brand-lockup"><span className="brand-mark">B</span><span className="brand-wordmark">Best in <em>Daman</em></span></span></Link><Link className="button button-small button-dark" href="/">Back to site <span className="ui-icon">↗</span></Link></header>
      <div className="shell admin-shell">
        <div className="eyebrow">Admin foundation</div><h1>Keep the board<br /><span>trustworthy.</span></h1><p className="admin-lede">A moderation-first workspace for reviewing submissions, managing campaign dates, and keeping payment and analytics notes in one place.</p>
        <div className="admin-toolbar"><div><strong>Moderation queue</strong><span>All submissions begin pending.</span></div><button className="button button-primary" type="button">Review queue <span className="ui-icon">↗</span></button></div>
        <div className="admin-grid"><section className="admin-panel admin-panel-wide"><div className="panel-heading"><div><span className="panel-kicker">Campaigns</span><h2>Nothing waiting yet.</h2></div><span className="panel-count">0 records</span></div><div className="empty-admin"><span className="empty-admin-icon">✓</span><div><strong>Your moderation queue is clear.</strong><p>New campaigns will appear here with their destination link, selected package, requested dates, and owner contact.</p></div></div></section><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker">Controls</span><h2>Status map</h2></div></div><div className="status-list">{statusRows.map(([name, count, detail]) => <div key={name}><span className="status-dot" /><span><strong>{name}</strong><small>{detail}</small></span><b>{count}</b></div>)}</div></section><section className="admin-panel"><div className="panel-heading"><div><span className="panel-kicker">Analytics</span><h2>Honest by default.</h2></div></div><div className="admin-note"><span className="trust-icon">◎</span><p>Homepage impressions, listing views, unique viewers, and tracked actions stay as separate counters. Public reporting never turns an impression into a person reached.</p></div></section></div>
        <div className="admin-workflow"><div><span className="panel-kicker">Review workflow</span><h2>Approve with context.</h2></div><div className="workflow-steps"><span><b>01</b> Review destination</span><span><b>02</b> Approve, reject, pause, or edit</span><span><b>03</b> Set dates + payment status</span><span><b>04</b> Watch real actions</span></div></div>
      </div>
    </main>
  );
}
