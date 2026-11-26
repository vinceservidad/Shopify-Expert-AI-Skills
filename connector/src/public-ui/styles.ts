/* Marketing Skills — Shopify VA public design system (gemini-frontend-design):
   - Subject-matched Shopify commerce palette: deep pine emerald stages + crisp cool gallery white & mint-slate editorial bands (0 beige, 0 purple).
   - Pure native system fonts ONLY (0 @font-face, 0 webfont preloads), max 2 families (sans + mono).
   - Strict 3-size body scale: 13px / 15px / 18px (nothing below 13px); consistent 15px body prose across all paragraphs and lists.
   - Hero bleeds edge-to-edge to y = 0 behind a borderless single-line 64px header.
   - Anti-slop: 0 pill badges, 0 eyebrow kickers, 0 nested cards, 0 detached button walls, 0 overflow at 320px/390px. */
export const PUBLIC_STYLES = `
:root{
  color-scheme:light;
  --sans:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
  --ground:#ffffff;
  --mist:#f2f7f5;
  --ink:#091713;
  --ink-2:#2c4239;
  --muted:#4c645a;
  --border:#cde0d7;
  --hair:#dcebe4;
  --hover:#e7f2ed;
  --accent:#007a5c;
  --on-accent:#ffffff;
  --forest:#031a14;
  --forest-2:#072e23;
  --forest-deep:#02120e;
  --forest-ink:#eef8f3;
  --forest-ink-2:#b6d1c6;
  --forest-muted:#89ab9d;
  --forest-line:rgba(142,224,184,.2);
  --forest-hover:rgba(142,224,184,.08);
  --lime:#b9eb6a;
  --on-lime:#031f17;
  --mint:#5fe3a1;
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
a:focus-visible,button:focus-visible,input:focus-visible,label:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
code,pre{font-family:var(--mono)}
code{overflow-wrap:anywhere;font-size:inherit}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--ground);color:var(--ink);font-size:13px;border:1px solid var(--border);z-index:30}
.skip-link:focus{top:12px}
.shell{width:min(1120px,calc(100% - 48px));margin-inline:auto}

/* Single-line 64px header: borderless over hero bleeding to y = 0, clean hairline on doc pages */
.top-bar{position:relative;z-index:10;border-bottom:1px solid var(--border);background:var(--ground)}
body.has-hero .top-bar{position:absolute;inset:0 0 auto 0;border-bottom:0;background:transparent}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px}
.setup-brand{font-family:var(--sans);font-size:18px;font-weight:750;letter-spacing:-.025em;line-height:1;color:var(--ink);text-decoration:none;white-space:nowrap}
.setup-brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--sans);font-size:13px;font-weight:500}
.family-tabs a{display:flex;align-items:center;padding:0 12px;margin-bottom:-1px;color:var(--muted);border-bottom:2px solid transparent;white-space:nowrap;text-decoration:none;transition:color .18s var(--ease),border-color .18s var(--ease)}
.family-tabs a:hover{color:var(--ink);text-decoration:none}
.family-tabs a[data-product=va][aria-current=page]{color:var(--ink);border-bottom-color:var(--accent)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-family:var(--sans);font-size:13px;font-weight:500}
.family-nav a{color:var(--ink-2);white-space:nowrap;text-decoration:none;transition:color .18s var(--ease)}
.family-nav a:hover{color:var(--ink);text-decoration:none}
body.has-hero .setup-brand{color:#ffffff}
body.has-hero .family-tabs a{color:var(--forest-muted)}
body.has-hero .family-tabs a:hover{color:#ffffff}
body.has-hero .family-tabs a[data-product=va][aria-current=page]{color:#ffffff;border-bottom-color:var(--lime)}
body.has-hero .family-nav a{color:var(--forest-ink-2)}
body.has-hero .family-nav a:hover{color:#ffffff}
body.has-hero a:focus-visible,body.has-hero button:focus-visible,body.has-hero input:focus-visible,body.has-hero label:focus-visible{outline-color:var(--lime)}

/* Full-bleed Shopify emerald-forest hero bleeding to y = 0, centered monumental layout */
.hero.stage{position:relative;isolation:isolate;overflow:hidden;width:100%;padding:124px 0 84px;color:var(--forest-ink);background:radial-gradient(110% 95% at 50% 0%,var(--forest-2) 0%,var(--forest) 58%,var(--forest-deep) 100%)}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0;transition:opacity .7s var(--ease)}
.hero-canvas.is-live{opacity:1}
.hero-inner{max-width:860px;margin-inline:auto;text-align:center;animation:hero-rise 260ms var(--ease)}
.hero-h1{font-size:clamp(42px,6.8vw,80px);line-height:.98;font-weight:800;letter-spacing:-.045em;color:#ffffff;margin:0 0 20px}
.hero-sub{font-size:15px;line-height:1.6;color:var(--forest-ink-2);max-width:54ch;margin:0 auto 30px}

/* Wide interactive 2-tab setup workbench centered inside the hero */
.workbench{max-width:740px;margin:0 auto;text-align:center}
.wb-radio{position:absolute;opacity:0;pointer-events:none}
.wb-tabs{display:inline-flex;border-radius:6px;background:rgba(2,18,14,.72);border:1px solid var(--forest-line);overflow:hidden;margin:0 auto 14px}
.wb-tabs label{padding:9px 18px;font-size:13px;font-weight:600;color:var(--forest-ink-2);cursor:pointer;user-select:none;transition:background-color .16s var(--ease),color .16s var(--ease)}
.wb-tabs label+label{border-left:1px solid var(--forest-line)}
.wb-tabs label:hover{color:#ffffff}
#wb-open:checked ~ .wb-tabs label[for=wb-open],#wb-cli:checked ~ .wb-tabs label[for=wb-cli]{background:var(--lime);color:var(--on-lime)}
.wb-panel{display:none}
#wb-open:checked ~ .wb-panels .wb-open,#wb-cli:checked ~ .wb-panels .wb-cli{display:block;animation:fade-in 180ms var(--ease)}
.wb-row{display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:6px;background:rgba(2,18,14,.84);border:1px solid var(--forest-line);text-align:left}
.wb-row code{flex:1;min-width:0;font-size:13px;line-height:1.5;color:#ffffff;overflow-wrap:anywhere}
.copy-btn{flex-shrink:0;min-height:36px;padding:6px 14px;border:1px solid transparent;border-radius:5px;background:var(--lime);color:var(--on-lime);font-family:var(--sans);font-size:13px;font-weight:650;cursor:pointer;transition:background-color .16s var(--ease),color .16s var(--ease),border-color .16s var(--ease)}
.copy-btn:hover{background:#ccf388}
.copy-btn-line{background:transparent;color:var(--accent);border-color:var(--border)}
.copy-btn-line:hover{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.band-forest .copy-btn-line{color:var(--lime);border-color:var(--forest-line)}
.band-forest .copy-btn-line:hover{background:var(--lime);color:var(--on-lime);border-color:var(--lime)}
.wb-note{font-size:13px;line-height:1.55;color:var(--forest-muted);margin:10px auto 0;text-align:center}
.wb-note a{color:var(--lime)}

/* Alternating editorial bands: gallery white, cool mint-slate, and deep forest */
.band{width:100%;padding:76px 0;background:var(--ground);border-bottom:1px solid var(--hair)}
.band-mist{background:var(--mist)}
.band-forest{color:var(--forest-ink);border-bottom:0;background:radial-gradient(100% 90% at 50% 0%,var(--forest-2) 0%,var(--forest) 60%,var(--forest-deep) 100%)}
.band-forest h2,.band-forest h3{color:#ffffff}
.band-forest p,.band-forest li,.band-forest dd{color:var(--forest-ink-2)}
.band-forest a{color:var(--lime)}
.will-reveal{opacity:0;transform:translateY(12px);transition:opacity .38s var(--ease),transform .38s var(--ease)}
.will-reveal.is-in{opacity:1;transform:none}
.section-head{text-align:center;max-width:68ch;margin:0 auto 32px}
.section-head p{margin:0 auto}
h1,h2,h3{color:var(--ink);margin-top:0}
h2{font-size:clamp(26px,3.6vw,36px);line-height:1.12;font-weight:750;letter-spacing:-.035em;margin:0 0 12px}
h3{font-size:18px;line-height:1.3;font-weight:650;margin:0 0 6px}
p,li,dd{font-size:15px;line-height:1.62;color:var(--ink-2)}
p{margin:0 0 14px;max-width:65ch}
.muted{font-size:13px;color:var(--muted)}

/* 3-Step Genuine Sequence: open hairline strip (centered to match hero & headings) */
.steps-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:28px;border-top:1px solid var(--border);padding-top:28px;text-align:center}
.step-item{min-width:0}
.step-num{display:block;font-family:var(--sans);font-variant-numeric:tabular-nums;font-size:13px;font-weight:700;color:var(--accent);margin-bottom:8px}
.step-item h3{font-size:18px;margin-bottom:8px}
.step-item p{margin:0 auto}

/* Hairline-ruled architectural tables (Bottlenecks & Sidekick comparison) */
.table-wrap{width:100%;overflow-x:auto;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
.bottleneck-table,.compare-table{width:100%;border-collapse:collapse;text-align:left}
.bottleneck-table th,.compare-table th{padding:14px 12px;font-size:13px;font-weight:650;color:var(--muted);border-bottom:1px solid var(--border);white-space:nowrap}
.bottleneck-table th:first-child,.bottleneck-table td:first-child,.compare-table th:first-child,.compare-table td:first-child{padding-left:0}
.bottleneck-table th:last-child,.bottleneck-table td:last-child,.compare-table th:last-child,.compare-table td:last-child{padding-right:0}
.bottleneck-table th:last-child{text-align:right}
.bottleneck-table td,.compare-table td{padding:15px 12px;font-size:15px;line-height:1.45;color:var(--ink-2);border-bottom:1px solid var(--hair);vertical-align:middle}
.bottleneck-table tbody tr:last-child td,.compare-table tbody tr:last-child td{border-bottom:0}
.bottleneck-table tbody tr:hover{background:var(--hover)}
.bottleneck-table td.bn-problem{font-weight:600;color:var(--ink)}
.bottleneck-table td.bn-first{color:var(--accent);font-weight:650;white-space:nowrap}
.bottleneck-table td.bn-next{font-size:13px;color:var(--muted)}
.bottleneck-table td.bn-action{text-align:right;white-space:nowrap}

.compare-table th.cmp-ours{color:var(--accent)}
.compare-table td{vertical-align:top}
.compare-table td.cmp-job{font-weight:650;color:var(--ink);width:28%}
.compare-table td.cmp-ours{color:var(--ink);width:38%}
.compare-table td.cmp-other{color:var(--muted);width:34%}
.compare-note{margin:18px auto 0;text-align:center}
.compare-note strong{color:var(--ink)}

/* Connected segmented tabs + search + hairline-ruled 19-playbook index (no boxed cards!) */
.catalog-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 20px;margin-bottom:28px}
.seg-tabs{display:inline-flex;flex-wrap:wrap;border:1px solid var(--forest-line);border-radius:6px;overflow:hidden;background:rgba(2,18,14,.62)}
.seg-tab{min-height:36px;padding:6px 14px;border:0;background:transparent;color:var(--forest-ink-2);font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;transition:background-color .16s var(--ease),color .16s var(--ease)}
.seg-tab+.seg-tab{border-left:1px solid var(--forest-line)}
.seg-tab:hover{color:#ffffff;background:var(--forest-hover)}
.seg-tab[aria-pressed=true]{background:var(--lime);color:var(--on-lime)}
.skill-filter{display:flex;align-items:center;gap:12px}
.skill-filter input{width:296px;max-width:100%;min-height:38px;padding:7px 12px;border-radius:6px;border:1px solid var(--forest-line);background:rgba(2,18,14,.72);color:#ffffff;font-family:var(--sans);font-size:13px}
.skill-filter input::placeholder{color:var(--forest-muted)}
.skill-filter input:focus{border-color:var(--lime);outline:none}
.skill-filter span{font-family:var(--sans);font-variant-numeric:tabular-nums;font-size:13px;font-weight:600;color:var(--lime);white-space:nowrap}

.skill-index{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:32px;row-gap:0;border-top:1px solid var(--forest-line)}
.skill-entry{display:flex;flex-direction:column;justify-content:space-between;gap:12px;padding:20px 0;border-bottom:1px solid var(--forest-line)}
.skill-entry h3{font-size:18px;margin:0 0 6px;color:#ffffff}
.skill-entry p{font-size:15px;line-height:1.5;margin:0;color:var(--forest-ink-2)}
.skill-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:4px}
.skill-actions a{font-size:13px;font-weight:600;color:var(--mint);white-space:nowrap}
.skill-actions a:hover{color:var(--lime)}

/* Unified 1px hairline matrix for the 4x2 (desktop) / 2x4 (mobile) supported AI apps */
.apps-matrix{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--border);border:1px solid var(--border);margin:24px 0 32px}
.app-cell{padding:16px 18px;background:var(--ground)}
.app-name{display:block;font-size:15px;font-weight:650;color:var(--ink);margin-bottom:4px}
.app-mode{display:block;font-size:13px;color:var(--muted)}

/* Clean hairline command rows (zero nested box cages) */
.cmd-list{border-top:1px solid var(--border)}
.cmd-item{display:grid;grid-template-columns:minmax(180px,240px) 1fr auto;gap:10px 20px;align-items:center;padding:14px 0;border-bottom:1px solid var(--hair)}
.cmd-label strong{display:block;font-size:15px;color:var(--ink);font-weight:650}
.cmd-label span{display:block;font-size:13px;color:var(--muted);margin-top:2px}
.cmd-code{font-family:var(--mono);font-size:13px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere;min-width:0}
.quick-setup{list-style:none;counter-reset:qs;max-width:760px;margin:0 auto 40px;padding:0;border-top:1px solid var(--border)}
.quick-setup>li{counter-increment:qs;position:relative;padding:22px 0 22px 44px;border-bottom:1px solid var(--hair)}
.quick-setup>li::before{content:counter(qs);position:absolute;left:0;top:22px;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:700;font-variant-numeric:tabular-nums;color:var(--accent);border:1px solid var(--border)}
.quick-setup h3{margin-bottom:8px}
.quick-setup .wb-row{margin:4px 0 14px}
.quick-setup .request{margin-bottom:8px}
.setup-subhead{text-align:center;margin-bottom:6px}
.setup-intro{text-align:center;margin:0 auto 0}
.setup-foot{margin:18px auto 0;font-size:13px;color:var(--muted);text-align:center}

/* FAQ hairline accordion */
.faq-list{border-top:1px solid var(--border);margin:24px auto 0;max-width:780px}
.faq-item{border-bottom:1px solid var(--hair)}
.faq-item summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;font-size:18px;font-weight:600;color:var(--ink);cursor:pointer;list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:'+';font-family:var(--mono);font-size:18px;font-weight:600;color:var(--accent);flex-shrink:0}
.faq-item[open] summary::after{content:'−'}
.faq-item p{padding:0 0 18px;margin:0}

/* Document pages (/help, /privacy) */
.page-body{padding-bottom:64px}
.doc-head{padding:52px 0 32px;border-bottom:1px solid var(--border)}
.doc-head h1{font-size:clamp(30px,4.5vw,44px);line-height:1.08;font-weight:750;letter-spacing:-.035em;margin:0 0 12px}
.page-body section{padding:44px 0;border-bottom:1px solid var(--hair);scroll-margin-top:20px}
.page-body section:last-child{border-bottom:0}
.command,.request{margin:12px 0 16px;padding:14px 16px;border-radius:6px;background:var(--mist);border:1px solid var(--border);color:var(--ink);font-size:13px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.steps,.file-list,.retention-list,.plain-list{padding-left:20px;margin:12px 0 16px}
.steps>li{margin-block:10px}
.file-list li,.retention-list li,.plain-list li{margin-block:8px}
dt{font-weight:650;font-size:15px;color:var(--ink);margin-top:18px}
dd{margin:6px 0 0}

/* Footer */
.footer-band{width:100%;background:var(--forest-deep);border-top:1px solid var(--forest-line)}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:14px 24px;padding:28px 0 36px;font-size:13px;color:var(--forest-muted)}
.site-footer p{margin:0;font-size:13px;color:var(--forest-muted)}
.site-footer p a{color:#ffffff}
.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 22px}
.site-footer a{color:var(--forest-muted);font-size:13px;transition:color .16s var(--ease)}
.site-footer a:hover{color:var(--lime)}

/* Embedded Shopify Admin (/app) */
.app-home{background:#f6f6f7;font-size:15px;color:#18181b}.app-home a{color:#00634b}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:15px;color:#18181b}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px;color:#18181b}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px;color:#18181b}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:13px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0;color:#18181b}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}

@keyframes hero-rise{from{opacity:.5;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

@media(max-width:960px){
  .skill-index{grid-template-columns:repeat(2,minmax(0,1fr))}
  .steps-grid{grid-template-columns:1fr;gap:22px}
  .cmd-item{grid-template-columns:1fr auto;gap:6px 14px}
  .cmd-label{grid-column:1 / -1}
}
@media(max-width:720px){
  .shell{width:calc(100% - 32px)}
  .family-header{flex-wrap:wrap;height:auto;gap:0 12px;padding-top:14px}
  .setup-brand{font-size:15px}
  .family-nav{gap:12px;font-size:13px}
  .family-tabs{order:3;width:100%;height:44px;margin-top:8px}
  .family-tabs a{padding:0 10px}
  .family-tabs a:first-child{padding-left:0}
  .hero.stage{padding:128px 0 56px}
  .hero-h1{font-size:clamp(34px,9.5vw,52px)}
  .apps-matrix{grid-template-columns:repeat(2,minmax(0,1fr))}
  .skill-index{grid-template-columns:1fr}
  .seg-tabs{width:100%}
  .seg-tab{flex:1 1 auto;padding:8px 10px}
  .skill-filter{width:100%}
  .skill-filter input{flex:1;width:auto;min-width:0}
  .wb-tabs{display:flex;width:100%}
  .wb-tabs label{flex:1;text-align:center;padding:8px 10px}
  .bottleneck-table th:nth-child(3),.bottleneck-table td:nth-child(3){display:none}
  .bottleneck-table td.bn-first{white-space:normal}
  .compare-table th,.compare-table td{padding:12px 8px;font-size:13px}
  .compare-table td.cmp-job,.compare-table td.cmp-ours,.compare-table td.cmp-other{width:auto}
  .app-home input{width:100%}
  .connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}
}
@media(max-width:360px){
  .shell{width:calc(100% - 24px)}
  .family-header{gap:0 8px}
  .family-nav{gap:9px}
  .wb-row{flex-direction:column;align-items:stretch;padding:10px}
  .wb-row .copy-btn{width:100%}
  .cmd-item{grid-template-columns:1fr}
  .cmd-item .copy-btn{justify-self:start}
}
@media(prefers-reduced-motion:reduce){
  .hero-inner,.wb-panel,.will-reveal{animation:none;transition:none;opacity:1;transform:none}
  .hero-canvas,.family-tabs a,.family-nav a,.wb-tabs label,.seg-tab,.copy-btn,.site-footer a{transition:none}
}
`;
