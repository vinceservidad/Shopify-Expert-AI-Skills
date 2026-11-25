/* Marketing Skills — Shopify VA public design system:
   - Matches mktskills.com navy-black palette & header geometry (0 header shift between marketing/ and shopify-va/).
   - Pure native system fonts ONLY (0 @font-face, 0 webfont preloads), max 2 families (sans + mono).
   - Strict 3-size body scale: 13px / 15px / 18px (nothing below 13px).
   - Zero pill badges (999px), zero eyebrow kickers, zero nested cards, zero purple/beige, zero overflow at 320px/390px. */
export const PUBLIC_STYLES = `
:root{
  color-scheme:dark;
  --sans:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
  --ground:#020812;
  --paper:#06111f;
  --raise:#0a1a2e;
  --side:#040d19;
  --ink:#dcebfa;
  --ink-2:#a8c0d8;
  --muted:#8aa3be;
  --border:#16314f;
  --hair:#0e2239;
  --hover:#0c1d33;
  --code:#081628;
  --accent:#3fa9ff;
  --accent-va:#5fe3a1;
  --on-accent-va:#020812;
  --solid:#1a5fd6;
  --solid-hover:#2470eb;
  --on-solid:#ffffff;
  --text-sm:13px;
  --text-base:15px;
  --text-lg:18px;
  --ease:cubic-bezier(0.22,1,0.36,1);
  font-family:var(--sans);
  font-size:15px;
  line-height:1.6;
  color:var(--ink);
  background:var(--ground);
}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--ground);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:clip}
a{color:var(--accent);text-underline-offset:4px;text-decoration:none}
a:hover{text-decoration:underline}
a:focus-visible,button:focus-visible,input:focus-visible,label:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent-va);outline-offset:2px}
code,pre{font-family:var(--mono)}
code{overflow-wrap:anywhere;font-size:inherit}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--paper);color:var(--ink);font-size:13px;border:1px solid var(--border);z-index:30}
.skip-link:focus{top:12px}
.shell{width:min(1120px,calc(100% - 48px));margin-inline:auto}

/* Shared Marketing Skills header: matches mktskills.com dimensions & breakpoints */
.top-bar{position:relative;z-index:10;border-bottom:1px solid var(--hair);background:var(--ground)}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px}
.setup-brand{font-family:var(--sans);font-size:18px;font-weight:700;letter-spacing:-.02em;line-height:1;color:#ffffff;text-decoration:none;white-space:nowrap}
.setup-brand:hover{text-decoration:none;color:#ffffff}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--sans);font-size:13px;font-weight:500}
.family-tabs a{display:flex;align-items:center;padding:0 12px;margin-bottom:-1px;color:var(--muted);border-bottom:2px solid transparent;white-space:nowrap;text-decoration:none;transition:color .18s var(--ease),border-color .18s var(--ease)}
.family-tabs a:hover{color:var(--ink);text-decoration:none}
.family-tabs a[data-product=va][aria-current=page]{color:var(--ink);border-bottom-color:var(--accent-va)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-family:var(--sans);font-size:13px;font-weight:500}
.family-nav a{color:var(--ink-2);white-space:nowrap;text-decoration:none;transition:color .18s var(--ease)}
.family-nav a:hover{color:var(--ink);text-decoration:none}

/* Hero stage */
.hero.stage{position:relative;isolation:isolate;overflow:hidden;width:100%;padding:76px 0 72px;border-bottom:1px solid var(--hair);background:radial-gradient(85% 95% at 50% 0%,rgba(26,95,214,.20) 0%,rgba(95,227,161,.06) 40%,var(--ground) 78%),linear-gradient(to right,rgba(22,49,79,.22) 1px,transparent 1px),linear-gradient(to bottom,rgba(22,49,79,.22) 1px,transparent 1px);background-size:100% 100%,48px 48px,48px 48px}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s var(--ease)}
.hero-canvas.is-live{opacity:1}
.hero-inner{max-width:820px;margin-inline:auto;text-align:center;animation:hero-rise 260ms var(--ease)}
.hero-h1{font-size:clamp(38px,6vw,68px);line-height:1.03;font-weight:800;letter-spacing:-.04em;color:#ffffff;margin:0 0 20px}
.hero-sub{font-size:18px;line-height:1.55;color:var(--ink-2);max-width:58ch;margin:0 auto 20px}
.hero-proof{font-size:15px;line-height:1.5;color:var(--muted);margin:0 auto 30px}
.hero-proof strong{color:var(--ink);font-weight:600}

/* Interactive 2-tab quick-start bar in the hero */
.workbench{max-width:740px;margin:0 auto;text-align:left}
.wb-radio{position:absolute;opacity:0;pointer-events:none}
.wb-tabs{display:inline-flex;gap:4px;padding:4px;border-radius:8px;background:var(--paper);border:1px solid var(--border);margin-bottom:14px}
.wb-tabs label{padding:8px 16px;border-radius:6px;font-size:13px;font-weight:600;color:var(--ink-2);cursor:pointer;user-select:none;transition:background-color .16s var(--ease),color .16s var(--ease)}
.wb-tabs label:hover{color:#ffffff}
#wb-open:checked ~ .wb-tabs label[for=wb-open],#wb-cli:checked ~ .wb-tabs label[for=wb-cli]{background:var(--accent-va);color:var(--on-accent-va)}
.wb-panel{display:none}
#wb-open:checked ~ .wb-panels .wb-open,#wb-cli:checked ~ .wb-panels .wb-cli{display:block;animation:fade-in 180ms var(--ease)}
.wb-row{display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:8px;background:var(--paper);border:1px solid var(--border)}
.wb-row code{flex:1;min-width:0;font-size:13px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.copy-btn{flex-shrink:0;min-height:36px;padding:6px 14px;border:1px solid transparent;border-radius:6px;background:var(--accent-va);color:var(--on-accent-va);font-family:var(--sans);font-size:13px;font-weight:650;cursor:pointer;transition:filter .16s var(--ease)}
.copy-btn:hover{filter:brightness(1.07)}
.copy-btn-quiet{background:var(--raise);color:var(--ink);border-color:var(--border)}
.copy-btn-quiet:hover{background:var(--hover);border-color:var(--accent-va);color:#ffffff;filter:none}
.wb-note{font-size:13px;line-height:1.55;color:var(--muted);margin:10px 0 0}
.wb-note a{color:var(--accent-va)}

/* Sections & typography (strict body sizes: 13px, 15px, 18px) */
.band{width:100%;padding:68px 0;border-bottom:1px solid var(--hair)}
.band-alt{background:var(--side)}
.will-reveal{opacity:0;transform:translateY(12px);transition:opacity .38s var(--ease),transform .38s var(--ease)}
.will-reveal.is-in{opacity:1;transform:none}
.section-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 32px;margin-bottom:28px}
.section-head p{margin:0}
h1,h2,h3{color:#ffffff;margin-top:0}
h2{font-size:clamp(26px,3.4vw,34px);line-height:1.15;font-weight:750;letter-spacing:-.03em;margin:0 0 10px}
h3{font-size:18px;line-height:1.3;font-weight:650;margin:0 0 6px}
p,li,dd{font-size:15px;line-height:1.62;color:var(--ink-2)}
p{margin:0 0 14px;max-width:65ch}
.lead{font-size:18px;line-height:1.55;color:var(--ink-2);max-width:60ch}
.muted{font-size:13px;color:var(--muted)}
.button{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:9px 18px;border-radius:8px;background:var(--accent-va);color:var(--on-accent-va);font-size:15px;font-weight:650;text-decoration:none;transition:filter .16s var(--ease)}
.button:hover{text-decoration:none;filter:brightness(1.07)}
.button svg{width:16px;height:16px;flex-shrink:0}

/* 3-Step Explainer (flat columns, zero nested cards) */
.steps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;margin-top:28px;border-top:1px solid var(--border);padding-top:24px}
.step-item{min-width:0}
.step-num{display:block;font-family:var(--mono);font-size:13px;font-weight:700;color:var(--accent-va);margin-bottom:8px}
.step-item h3{font-size:18px;margin-bottom:8px}
.step-item p{font-size:15px;margin:0;color:var(--ink-2)}

/* Interactive Bottleneck Table */
.table-wrap{width:100%;overflow-x:auto;border:1px solid var(--border);border-radius:8px;background:var(--paper)}
.bottleneck-table{width:100%;border-collapse:collapse;text-align:left}
.bottleneck-table th{padding:14px 16px;font-size:13px;font-weight:650;color:var(--muted);background:var(--side);border-bottom:1px solid var(--border);white-space:nowrap}
.bottleneck-table th:last-child{text-align:right}
.bottleneck-table td{padding:15px 16px;font-size:15px;line-height:1.45;color:var(--ink-2);border-bottom:1px solid var(--hair);vertical-align:middle}
.bottleneck-table tbody tr:last-child td{border-bottom:0}
.bottleneck-table tbody tr:hover{background:var(--hover)}
.bottleneck-table td.bn-problem{font-weight:600;color:#ffffff}
.bottleneck-table td.bn-first{color:var(--accent-va);font-weight:600;white-space:nowrap}
.bottleneck-table td.bn-next{font-size:13px;color:var(--muted)}
.bottleneck-table td.bn-action{text-align:right;white-space:nowrap}

/* Sidekick comparison table */
.compare-table{width:100%;border-collapse:collapse;text-align:left}
.compare-table th{padding:14px 16px;font-size:13px;font-weight:650;color:var(--muted);background:var(--side);border-bottom:1px solid var(--border)}
.compare-table th.cmp-ours{color:var(--accent-va)}
.compare-table td{padding:15px 16px;font-size:15px;line-height:1.45;color:var(--ink-2);border-bottom:1px solid var(--hair);vertical-align:top}
.compare-table tbody tr:last-child td{border-bottom:0}
.compare-table td.cmp-job{font-weight:600;color:#ffffff;width:28%}
.compare-table td.cmp-ours{color:var(--ink);width:38%}
.compare-table td.cmp-other{color:var(--muted);width:34%}
.compare-note{margin:16px 0 0;font-size:15px;color:var(--ink-2)}
.compare-note strong{color:#ffffff}

/* Searchable & filterable 19-skill catalog */
.catalog-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 20px;margin-bottom:24px}
.cat-tabs{display:flex;flex-wrap:wrap;gap:8px}
.cat-btn{min-height:36px;padding:6px 12px;border-radius:6px;border:1px solid var(--border);background:var(--paper);color:var(--ink-2);font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;transition:background-color .16s var(--ease),color .16s var(--ease),border-color .16s var(--ease)}
.cat-btn:hover{color:#ffffff;border-color:var(--accent)}
.cat-btn[aria-pressed=true]{background:var(--accent-va);color:var(--on-accent-va);border-color:var(--accent-va)}
.skill-filter{display:flex;align-items:center;gap:12px}
.skill-filter input{width:296px;max-width:100%;min-height:38px;padding:7px 12px;border-radius:6px;border:1px solid var(--border);background:var(--paper);color:var(--ink);font-family:var(--sans);font-size:13px}
.skill-filter input::placeholder{color:var(--muted)}
.skill-filter input:focus{border-color:var(--accent-va);outline:none}
.skill-filter span{font-family:var(--mono);font-size:13px;font-variant-numeric:tabular-nums;color:var(--accent-va);white-space:nowrap}

.skill-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.skill-item{display:flex;flex-direction:column;justify-content:space-between;gap:14px;padding:20px;border-radius:8px;border:1px solid var(--border);background:var(--paper);transition:border-color .16s var(--ease),background-color .16s var(--ease)}
.skill-item:hover{border-color:var(--accent);background:var(--raise)}
.skill-item h3{font-size:18px;margin:0 0 6px;color:#ffffff}
.skill-item p{font-size:15px;line-height:1.5;margin:0;color:var(--ink-2)}
.skill-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid var(--hair)}
.skill-actions a{font-size:13px;font-weight:600;color:var(--accent);white-space:nowrap}

/* Balanced 4x2 (desktop) / 2x4 (mobile) supported AI apps grid */
.apps-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:24px 0 32px}
.app-cell{padding:16px;border-radius:8px;border:1px solid var(--border);background:var(--paper)}
.app-name{display:block;font-size:15px;font-weight:650;color:#ffffff;margin-bottom:4px}
.app-mode{display:block;font-size:13px;color:var(--muted)}

/* Flat command rows for multi-platform setup */
.cmd-list{border-top:1px solid var(--border)}
.cmd-item{display:grid;grid-template-columns:minmax(180px,240px) 1fr;gap:12px 24px;align-items:center;padding:16px 0;border-bottom:1px solid var(--hair)}
.cmd-label strong{display:block;font-size:15px;color:#ffffff;font-weight:650}
.cmd-label span{display:block;font-size:13px;color:var(--muted);margin-top:2px}
.cmd-row{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:8px;background:var(--paper);border:1px solid var(--border);min-width:0}
.cmd-row code{flex:1;min-width:0;font-size:13px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.setup-foot{margin-top:20px;font-size:13px;color:var(--muted)}
.setup-foot a{color:var(--accent-va)}

/* FAQ accordion */
.faq-list{border-top:1px solid var(--border);margin-top:24px}
.faq-item{border-bottom:1px solid var(--hair)}
.faq-item summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;font-size:18px;font-weight:600;color:#ffffff;cursor:pointer;list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:'+';font-family:var(--mono);font-size:18px;font-weight:600;color:var(--accent-va);flex-shrink:0}
.faq-item[open] summary::after{content:'−'}
.faq-item p{padding:0 0 18px;margin:0;font-size:15px;line-height:1.62;color:var(--ink-2);max-width:68ch}

/* Document pages (/help, /privacy) */
.page-body{padding-bottom:64px}
.doc-head{padding:52px 0 32px;border-bottom:1px solid var(--hair)}
.doc-head h1{font-size:clamp(30px,4.5vw,44px);line-height:1.08;font-weight:750;letter-spacing:-.035em;margin:0 0 12px}
.page-body section{padding:44px 0;border-bottom:1px solid var(--hair);scroll-margin-top:20px}
.page-body section:last-child{border-bottom:0}
.command,.request{margin:12px 0 16px;padding:14px 16px;border-radius:8px;background:var(--paper);border:1px solid var(--border);color:var(--ink);font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.steps,.file-list,.retention-list,.plain-list{padding-left:20px;margin:12px 0 16px}
.steps>li{margin-block:10px}
.file-list li,.retention-list li,.plain-list li{margin-block:8px}
dt{font-weight:650;font-size:15px;color:#ffffff;margin-top:18px}
dd{margin:6px 0 0;font-size:15px;color:var(--ink-2)}

/* Footer */
.footer-band{width:100%;background:var(--side);border-top:1px solid var(--hair)}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 24px;padding:28px 0 36px;font-size:13px;color:var(--muted)}
.site-footer p{margin:0;font-size:13px;color:var(--muted)}
.site-footer p a{color:var(--ink)}
.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px}
.site-footer a{color:var(--muted);font-size:13px}
.site-footer a:hover{color:var(--accent-va)}

/* Embedded Shopify Admin (/app) — preserves Polaris light admin styles */
.app-home{background:#f6f6f7;font-size:15px;color:#18181b}.app-home a{color:#00634b}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:15px;color:#18181b}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px;color:#18181b}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px;color:#18181b}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:13px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0;color:#18181b}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}

@keyframes hero-rise{from{opacity:.5;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

@media(max-width:960px){
  .skill-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .steps-grid{grid-template-columns:1fr;gap:20px}
  .cmd-item{grid-template-columns:1fr;gap:8px}
}
@media(max-width:720px){
  .shell{width:calc(100% - 32px)}
  .family-header{flex-wrap:wrap;height:auto;gap:0 12px;padding-top:14px}
  .setup-brand{font-size:15px}
  .family-nav{gap:12px;font-size:13px}
  .family-tabs{order:3;width:100%;height:44px;margin-top:10px}
  .family-tabs a{padding:0 10px}
  .family-tabs a:first-child{padding-left:0}
  .hero.stage{padding:48px 0 52px}
  .hero-h1{font-size:clamp(32px,9vw,46px)}
  .hero-sub{font-size:15px}
  .apps-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
  .skill-grid{grid-template-columns:1fr}
  .skill-filter{width:100%}
  .skill-filter input{flex:1;width:auto;min-width:0}
  .wb-tabs{display:flex;width:100%}
  .wb-tabs label{flex:1;text-align:center;padding:8px 10px}
  .bottleneck-table th:nth-child(3),.bottleneck-table td:nth-child(3){display:none}
  .bn-first{white-space:normal}
  .compare-table th,.compare-table td{padding:12px 10px;font-size:13px}
  .compare-table td.cmp-job,.compare-table td.cmp-ours,.compare-table td.cmp-other{width:auto}
  .app-home input{width:100%}
  .connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}
}
@media(max-width:360px){
  .shell{width:calc(100% - 24px)}
  .family-header{gap:0 8px}
  .family-nav{gap:9px}
  .wb-row,.cmd-row{flex-direction:column;align-items:stretch;padding:10px}
  .wb-row .copy-btn,.cmd-row .copy-btn{width:100%}
}
@media(prefers-reduced-motion:reduce){
  .hero-inner,.wb-panel,.will-reveal{animation:none;transition:none;opacity:1;transform:none}
  .hero-canvas,.button,.family-tabs a,.family-nav a,.wb-tabs label,.skill-item,.cat-btn{transition:none}
}
`;
