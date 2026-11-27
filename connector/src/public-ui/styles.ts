/* Marketing Skills, Shopify VA public design system (anti-slop spec, 2026-11-27):
   - Dark charcoal ladder: ground #15191a, surface #1d2223 (wells, inputs, code, the open drawer), line #343c3d,
     ink #eff2f0, muted #b2bbb6. Two accents with separate roles: accent #62c597 for links, the primary button and
     selected state; signal #eab04f for one thing only, the lit "What comes first" step (row number and gate).
     Text passes 7:1 and accents 4.5:1 (in fact 7:1) on every surface they sit on (tests/public-contrast.test.ts).
   - Self-hosted OFL fonts served from 'self': Schibsted Grotesk (headings, variable 400-900), IBM Plex Sans 400/600
     (body and UI), IBM Plex Mono 400 (code, commands, the stage numbers). font-display:swap.
   - Radius by role: 6px buttons and tabs, 12px panels (the install drawer), 4px code, inputs and wells, 0 on rows.
   - Hierarchy comes from type size, weight, whitespace and 1px dividers: no cards, no glow, no gradients, no lift,
     no reveal on scroll, no uppercase labels, no one-sided coloured borders, no shadows except the open drawer.
   - Motion: only the hero canvas and the sequence canvas animate, and each plays once then rests still (no loops).
     Interactive rows change background on hover.
   - Type scale 14/16/20px and up, 16px form fields. The /app light theme (.app-home) keeps its own look. */
export const PUBLIC_STYLES = `
@font-face{font-family:"Schibsted Grotesk";font-style:normal;font-weight:400 900;font-display:swap;src:url(fonts/schibsted-grotesk-latin-wght-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans";font-style:normal;font-weight:400;font-display:swap;src:url(fonts/ibm-plex-sans-latin-400-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Sans";font-style:normal;font-weight:600;font-display:swap;src:url(fonts/ibm-plex-sans-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-style:normal;font-weight:400;font-display:swap;src:url(fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2")}
:root{
  color-scheme:dark;
  --display:"Schibsted Grotesk","IBM Plex Sans","Helvetica Neue",Helvetica,sans-serif;
  --sans:"IBM Plex Sans","Helvetica Neue",Helvetica,sans-serif;
  --mono:"IBM Plex Mono",Menlo,Consolas,monospace;
  --ground:#15191a;
  --surface:#1d2223;
  --line:#343c3d;
  --ink:#eff2f0;
  --muted:#b2bbb6;
  --accent:#62c597;
  --accent-hover:#7fd1ab;
  --signal:#eab04f;
  --on-accent:#15191a;
  --radius-btn:6px;
  --radius-panel:12px;
  --radius-well:4px;
  --gap-major:128px;
  --gap-related:56px;
  --gap-end:96px;
  --ease:cubic-bezier(.2,0,0,1);
  --dur:.15s;
  font-family:var(--sans);
  font-size:16px;
  line-height:1.55;
  color:var(--ink);
  background:var(--ground);
}
::selection{background:var(--accent);color:var(--on-accent)}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
html,body{margin:0;padding:0;background:var(--ground);color:var(--ink);-webkit-font-smoothing:antialiased;overflow-x:clip}
a{color:var(--accent);text-underline-offset:4px;text-decoration:none}
a:hover{text-decoration:underline}
a:focus-visible,button:focus-visible,input:focus-visible,label:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
code,pre{font-family:var(--mono)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0}
code{overflow-wrap:anywhere;font-size:inherit}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--ground);color:var(--ink);font-size:14px;border:1px solid var(--line);border-radius:var(--radius-btn);z-index:30}
.skip-link:focus{top:12px}
.shell{--gutter:max(24px,env(safe-area-inset-left,0px),env(safe-area-inset-right,0px));width:min(1120px,calc(100% - 2*var(--gutter)));margin-inline:auto}

/* Single-line 64px header: transparent over the hero, hairline on doc pages */
.top-bar{position:relative;z-index:10;border-bottom:1px solid var(--line);background:var(--ground)}
body.has-hero .top-bar{position:absolute;inset:0 0 auto 0;border-bottom:0;background:transparent}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px}
.setup-brand{display:inline-flex;align-items:center;min-height:44px;font-family:var(--display);font-size:20px;font-weight:700;letter-spacing:-.02em;line-height:1;color:var(--ink);text-decoration:none;white-space:nowrap}
.setup-brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--mono);font-size:14px;font-weight:400}
.family-tabs a{display:flex;align-items:center;padding:0 12px;margin-bottom:-1px;color:var(--muted);border-bottom:2px solid transparent;white-space:nowrap;text-decoration:none;transition:color var(--dur) var(--ease),border-color var(--dur) var(--ease)}
.family-tabs a:hover{color:var(--ink);text-decoration:none}
.family-tabs a[data-product=va][aria-current=page]{color:var(--ink);border-bottom-color:var(--accent)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-family:var(--sans);font-size:16px;font-weight:400}
.family-nav a{display:inline-flex;align-items:center;min-height:44px;color:var(--muted);white-space:nowrap;text-decoration:none;transition:color var(--dur) var(--ease)}
.family-nav a:hover{color:var(--ink);text-decoration:none}
.family-nav a[aria-current=page]{color:var(--ink);text-decoration:underline;text-decoration-thickness:2px;text-decoration-color:var(--accent);text-underline-offset:8px}
body.has-hero .top-bar a:focus-visible,.site-footer a:focus-visible{outline-color:var(--accent)}

/* Hero: the canvas is the one animated background; the content is a left-aligned split from 1024px */
.hero.stage{position:relative;isolation:isolate;overflow:hidden;width:100%;padding:124px 0 var(--gap-end);color:var(--ink);background:var(--ground)}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0}
.hero-canvas.is-live{opacity:1}
.hero-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:56px;align-items:start;text-align:left}
.hero-main,.hero-aside{min-width:0;background:var(--ground)}
.hero-h1{text-wrap:balance;overflow-wrap:break-word;font-family:var(--display);font-size:clamp(36px,8vw,52px);line-height:1.04;font-weight:700;letter-spacing:-.03em;color:var(--ink);margin:0 0 20px}
.hero-sub{font-size:20px;line-height:1.5;color:var(--ink);max-width:56ch;margin:0 0 32px}

/* Connector tabs and the copyable link */
.workbench{max-width:640px;text-align:left}
.wb-radio{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;pointer-events:none}
.wb-tabs,.ex-tabs,.seg-tabs{display:inline-flex;max-width:100%;border:1px solid var(--line);border-radius:var(--radius-btn);overflow:hidden}
.wb-tabs{margin:0 0 12px}
.wb-tabs label,.ex-tabs label{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 16px;font-size:16px;font-weight:600;color:var(--muted);cursor:pointer;user-select:none;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.wb-tabs label+label,.ex-tabs label+label{border-left:1px solid var(--line)}
.wb-tabs label:hover,.ex-tabs label:hover{color:var(--ink);background:var(--surface)}
#wb-claude:checked ~ .wb-tabs label[for=wb-claude],#wb-chatgpt:checked ~ .wb-tabs label[for=wb-chatgpt],#wb-cli:checked ~ .wb-tabs label[for=wb-cli]{background:var(--accent);color:var(--on-accent)}
.wb-tabs label:focus-visible,.ex-tabs label:focus-visible{outline:2px solid var(--accent);outline-offset:-4px}
.wb-tabs label[aria-selected=true]:focus-visible,.ex-tabs label[aria-selected=true]:focus-visible{outline-color:var(--on-accent)}
#wb-claude:focus-visible ~ .wb-tabs label[for=wb-claude],#wb-chatgpt:focus-visible ~ .wb-tabs label[for=wb-chatgpt],#wb-cli:focus-visible ~ .wb-tabs label[for=wb-cli],#ex-csv:focus-visible ~ .ex-tabs-wrap label[for=ex-csv],#ex-cb:focus-visible ~ .ex-tabs-wrap label[for=ex-cb],#ex-list:focus-visible ~ .ex-tabs-wrap label[for=ex-list]{outline:2px solid var(--on-accent);outline-offset:-4px}
.wb-panels,.ex-panels{display:grid}
.wb-panel,.ex-panel{grid-area:1/1;visibility:hidden}
#wb-claude:checked ~ .wb-panels .wb-claude,#wb-chatgpt:checked ~ .wb-panels .wb-chatgpt,#wb-cli:checked ~ .wb-panels .wb-cli{visibility:visible}
.wb-row{display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface);text-align:left}
.wb-row code{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.copy-btn{flex-shrink:0;max-width:100%;min-height:40px;padding:6px 14px;border:1px solid var(--accent);border-radius:var(--radius-btn);background:var(--accent);color:var(--on-accent);font-family:var(--sans);font-size:16px;font-weight:600;cursor:pointer;transition:background-color var(--dur) var(--ease),border-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.copy-btn:hover{background:var(--accent-hover);border-color:var(--accent-hover)}
.copy-btn-line{border:1px solid var(--line);background:transparent;color:var(--accent)}
.copy-btn-line:hover{background:var(--surface);color:var(--accent);border-color:var(--accent)}
.copy-btn-line.is-copied{background:var(--accent);color:var(--on-accent);border-color:var(--accent)}
.copy-btn-text{min-height:44px;text-align:inherit;padding:6px 0 6px 8px;border:0;border-radius:0;background:transparent;color:var(--accent);font-weight:600;text-decoration:none}
.copy-btn-text:hover{background:transparent;color:var(--accent);text-decoration:underline;text-underline-offset:4px}
.copy-btn-text svg{width:14px;height:14px;margin-right:6px;vertical-align:-2px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.wb-note{font-size:14px;line-height:1.5;color:var(--muted);margin:10px 0 0;max-width:56ch}
.wb-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-start;gap:4px 24px;margin-top:4px;font-size:16px}
.wb-links a{display:inline-flex;align-items:center;min-height:44px;color:var(--accent);font-weight:600}

/* "See what the skills return", in the hero's right column: tabs, the pasted input in a well, then the returned points */
.aside-h{font-family:var(--display);font-size:20px;line-height:1.3;font-weight:650;letter-spacing:-.01em;margin:0 0 6px}
.aside-sub{font-size:16px;color:var(--muted);margin:0 0 20px}
.ex-box{min-width:0}
.ex-radio{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;pointer-events:none}
.ex-tabs-wrap{text-align:left}
.ex-tabs{margin:0 0 24px}
#ex-csv:checked ~ .ex-tabs-wrap label[for=ex-csv],#ex-cb:checked ~ .ex-tabs-wrap label[for=ex-cb],#ex-list:checked ~ .ex-tabs-wrap label[for=ex-list]{background:var(--accent);color:var(--on-accent)}
#ex-csv:checked ~ .ex-panels .ex-csv,#ex-cb:checked ~ .ex-panels .ex-cb,#ex-list:checked ~ .ex-panels .ex-list{visibility:visible}
.ex-label{display:block;font-size:16px;font-weight:600;color:var(--ink);margin:0 0 8px}
.ex-label span{font-weight:400;color:var(--muted)}
.ex-input{margin:0 0 24px;padding:12px 14px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface);font-family:var(--mono);font-size:14px;line-height:1.55;color:var(--ink)}
.ex-points{list-style:none;padding:0;margin:0;border-top:1px solid var(--line)}
.ex-points li{padding:10px 0;margin:0;border-bottom:1px solid var(--line);color:var(--ink)}

/* Bands: spacing varies by role. A major section opens with a big gap and a hairline; a related one follows closely. */
.band{width:100%;background:var(--ground)}
.band-major{padding:var(--gap-major) 0 var(--gap-related);border-top:1px solid var(--line)}
.band-related{padding:var(--gap-related) 0 var(--gap-related)}
.band-last{padding-bottom:var(--gap-end)}
.section-head{text-align:center;max-width:68ch;margin:0 auto 40px}
.section-head p{margin:0 auto;max-width:40em;font-size:20px;line-height:1.5;color:var(--muted)}
h1,h2,h3{color:var(--ink);margin-top:0;font-family:var(--display)}
h1,h2{text-wrap:balance}
h2{font-size:clamp(32px,3.6vw,44px);line-height:1.12;font-weight:650;letter-spacing:-.025em;margin:0 0 16px}
h3{font-size:20px;line-height:1.3;font-weight:600;letter-spacing:-.01em;margin:0 0 6px}
p,li,dd{font-size:16px;line-height:1.55;color:var(--ink)}
p{margin:0 0 14px;max-width:65ch;text-wrap:pretty}
.muted{font-size:14px;color:var(--muted)}

/* What comes first: the canvas strip, then a ruled list of the seven stages (real sequence numbers 01-07) */
.seq-strip{display:none;margin:0 0 20px}
.seq-strip.is-live{display:block}
.seq-canvas{display:block;width:100%;height:56px}
.seq-gates{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));margin-top:2px}
.seq-gates a{display:block;text-align:center;font-family:var(--mono);font-size:14px;font-weight:400;font-variant-numeric:tabular-nums;line-height:32px;color:var(--muted);text-decoration:none;transition:color var(--dur) var(--ease)}
.seq-gates a.is-passed{color:var(--accent)}
.seq-gates a.is-focus{color:var(--signal)}
.seq-gates a:hover{color:var(--ink);text-decoration:none}
.sequence-list{list-style:none;margin:0;padding:0;border-top:1px solid var(--line)}
.seq-item{display:grid;grid-template-columns:36px minmax(150px,200px) minmax(180px,250px) 1fr;gap:8px 24px;align-items:baseline;padding:18px 16px;scroll-margin-top:16px;border-bottom:1px solid var(--line);transition:background-color var(--dur) var(--ease)}
.seq-item.is-lit,.seq-item:target,.seq-item:hover{background:var(--surface)}
.seq-item.is-lit .seq-num,.seq-item:target .seq-num{color:var(--signal)}
.sequence-list:has(.is-lit) .seq-item:target:not(.is-lit){background:transparent}
.sequence-list:has(.is-lit) .seq-item:target:not(.is-lit) .seq-num{color:var(--muted)}
.seq-num{font-family:var(--mono);font-variant-numeric:tabular-nums;font-size:14px;font-weight:400;color:var(--muted);transition:color var(--dur) var(--ease)}
.seq-stage{font-family:var(--display);font-size:20px;line-height:1.3;font-weight:600;color:var(--ink)}
.seq-skills{font-size:14px;font-weight:600;color:var(--muted)}
.seq-gate{font-size:16px;line-height:1.5;color:var(--ink)}

/* Common store problems: a ruled table; a row changes background on hover or focus */
.table-wrap{width:100%;overflow-x:auto}
.bottleneck-table{width:100%;border-collapse:collapse;text-align:left}
.bottleneck-table th{padding:0 16px 10px;font-size:14px;font-weight:600;color:var(--muted);white-space:nowrap;border-bottom:1px solid var(--line)}
.bottleneck-table th:first-child,.bottleneck-table td:first-child{padding-left:16px}
.bottleneck-table th:last-child,.bottleneck-table td:last-child{padding-right:16px}
.bottleneck-table th:last-child{text-align:right}
.bottleneck-table tbody tr{border-bottom:1px solid var(--line);transition:background-color var(--dur) var(--ease)}
.bottleneck-table td{padding:14px 16px;font-size:16px;line-height:1.45;color:var(--ink);vertical-align:middle}
.bottleneck-table tbody tr:hover,.bottleneck-table tbody tr:focus-within{background:var(--surface)}
.bn-sub{display:none}
.bottleneck-table td.bn-problem{font-weight:600;color:var(--ink)}
.bottleneck-table td.bn-first{color:var(--ink);white-space:nowrap}
.bottleneck-table td.bn-next{font-size:14px;color:var(--muted)}
.bottleneck-table td.bn-action{text-align:right;white-space:nowrap}

/* All 19 skills: filter controls, then one ruled list. The GitHub link stretches over the row; Copy prompt sits above it. */
.catalog-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;margin-bottom:24px}
.seg-tabs{flex-wrap:wrap}
.seg-tab{min-height:40px;padding:6px 14px;border:0;background:transparent;color:var(--muted);font-family:var(--sans);font-size:16px;font-weight:600;cursor:pointer;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease)}
.seg-tab+.seg-tab{border-left:1px solid var(--line)}
.seg-tab:hover{color:var(--ink);background:var(--surface)}
.seg-tab[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}
.skill-filter{display:flex;align-items:center;gap:12px}
.skill-filter input{width:296px;max-width:100%;min-height:40px;padding:7px 12px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface);color:var(--ink);font-family:var(--sans);font-size:16px;transition:border-color var(--dur) var(--ease)}
.skill-filter input::placeholder{color:var(--muted)}
.skill-filter input:hover{border-color:var(--muted)}
.skill-filter input:focus{border-color:var(--accent);outline:2px solid var(--accent);outline-offset:1px}
.skill-filter input::-webkit-search-cancel-button{cursor:pointer}
.skill-filter span{font-family:var(--sans);font-variant-numeric:tabular-nums;font-size:14px;font-weight:600;color:var(--muted);white-space:nowrap}
.skill-index{border-top:1px solid var(--line)}
.skill-entry{position:relative;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px 32px;align-items:center;padding:18px 16px;border-bottom:1px solid var(--line);transition:background-color var(--dur) var(--ease)}
.skill-entry:hover,.skill-entry:focus-within{background:var(--surface)}
.skill-text{display:grid;grid-template-columns:minmax(180px,240px) minmax(0,1fr);gap:4px 32px;align-items:baseline}
.skill-link::after{content:'';position:absolute;inset:0}
.skill-entry .copy-btn{position:relative;z-index:1}
.skill-entry:hover .skill-link{text-decoration:underline}
.skill-entry h3{font-size:20px;margin:0;color:var(--ink)}
.skill-cat{display:block;font-size:14px;color:var(--muted);margin-top:2px}
.skill-entry p{font-size:16px;line-height:1.5;margin:0;color:var(--ink)}
.skill-empty{padding:40px 0;text-align:center}
.skill-empty p{margin:0 auto 16px;max-width:none}
.skill-empty-q{color:var(--ink)}
.skill-actions{display:flex;align-items:center;justify-content:flex-end;gap:20px}
.skill-actions a{display:inline-flex;align-items:center;min-height:40px;font-size:16px;font-weight:600;color:var(--accent);white-space:nowrap}
.skill-actions a:hover{text-decoration:underline}

/* Supported AI apps: two ruled columns of name and install mode */
.apps-matrix{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:32px;margin:24px 0 32px;border-top:1px solid var(--line)}
.app-cell{display:flex;align-items:baseline;justify-content:space-between;gap:16px;padding:12px 0;border-bottom:1px solid var(--line)}
.app-name{font-size:16px;font-weight:600;color:var(--ink)}
.app-mode{font-size:14px;color:var(--muted);text-align:right}

/* Ruled command rows */
.cmd-list{border-top:1px solid var(--line)}
.cmd-item{display:grid;grid-template-columns:minmax(150px,190px) 1fr auto;gap:10px 20px;align-items:center;padding:14px 0;border-bottom:1px solid var(--line)}
.cmd-label strong{display:block;font-size:16px;color:var(--ink);font-weight:600}
.cmd-label span{display:block;font-size:14px;color:var(--muted);margin-top:2px}
.cmd-code{font-family:var(--mono);font-size:14px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere;min-width:0}
.cmd-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 16px;padding:8px 8px 8px 16px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface)}
.cmd-row .cmd-code{flex:1}
.page-body .cmd-row .copy-btn{margin:0}
.cmd-row .copy-btn,.cmd-item .copy-btn{min-width:88px}
.quick-setup{list-style:none;counter-reset:qs;max-width:860px;margin:0 auto;padding:0;border-top:1px solid var(--line)}
.quick-setup>li{counter-increment:qs;position:relative;padding:28px 0 28px 36px;border-bottom:1px solid var(--line)}
.quick-setup>li::before{content:counter(qs) '.';position:absolute;left:0;top:28px;font-family:var(--display);font-size:20px;line-height:1.3;font-weight:600;font-variant-numeric:tabular-nums;color:var(--muted)}
.quick-setup h3{margin-bottom:8px}
.quick-setup .request{margin-bottom:8px}
.setup-drawer{max-width:860px;margin:40px auto 0;padding:0 24px;border:1px solid var(--line);border-radius:var(--radius-panel);background:var(--ground)}
.setup-drawer[open]{background:var(--surface);box-shadow:0 12px 32px rgba(0,0,0,.35)}
.setup-drawer summary:hover{color:var(--accent)}
.setup-drawer summary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:52px;padding:16px 0;font-size:16px;font-weight:600;color:var(--ink);cursor:pointer;list-style:none}
.setup-drawer summary::-webkit-details-marker{display:none}
.setup-drawer summary::after{content:'+';font-family:var(--mono);font-size:20px;font-weight:400;color:var(--accent);flex-shrink:0}
.setup-drawer[open] summary::after{content:'−'}
.setup-drawer-body{padding:4px 0 24px}
.setup-drawer .cmd-list,.setup-drawer .apps-matrix,.setup-drawer .cmd-item,.setup-drawer .app-cell{border-color:var(--line)}
.setup-intro{font-size:16px;line-height:1.55;text-align:left;margin:0;max-width:60ch}
.setup-foot{margin:24px auto 0;font-size:14px;color:var(--muted);text-align:center;text-wrap:balance}
.setup-drawer .setup-foot{text-align:left;margin-left:0}

/* FAQ: a ruled accordion */
.faq-list{border-top:1px solid var(--line);margin:24px auto 0;max-width:780px}
.faq-item{border-bottom:1px solid var(--line)}
.faq-item summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;font-family:var(--display);font-size:20px;line-height:1.35;font-weight:600;color:var(--ink);cursor:pointer;list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:'+';font-family:var(--mono);font-size:20px;font-weight:400;color:var(--accent);flex-shrink:0}
.faq-item[open] summary::after{content:'−'}
.faq-item summary:hover{color:var(--accent)}
.faq-item p{padding:0 0 18px;margin:0}

/* Document pages (/setup, /privacy) */
.page-body{padding-bottom:var(--gap-end)}
.page-body.shell{width:min(880px,calc(100% - 2*var(--gutter)))}
.doc-jump{display:flex;flex-wrap:wrap;gap:0 22px;margin-top:18px}
.doc-jump a{display:inline-flex;align-items:center;min-height:32px;font-size:16px;font-weight:600}
.doc-head{padding:64px 0 40px;border-bottom:1px solid var(--line)}
.crumbs{margin:0 0 14px;font-size:14px}.crumbs ol{display:flex;flex-wrap:wrap;gap:2px 0;list-style:none;margin:0;padding:0;color:var(--muted)}.crumbs li{display:inline-flex;align-items:center;min-height:32px}.crumbs li+li::before{content:"/";margin:0 8px;color:var(--muted)}.crumbs a{display:inline-flex;align-items:center;min-height:32px}
.doc-head>p{font-size:20px;line-height:1.5}
.doc-head>p.muted{font-size:14px}
.doc-head h1{font-size:clamp(36px,4.6vw,52px);line-height:1.08;font-weight:700;letter-spacing:-.03em;margin:0 0 16px}
.page-body section{padding:72px 0 56px;border-bottom:1px solid var(--line);scroll-margin-top:20px}
.page-body .doc-head+section{padding-top:40px}
.page-body section.related{padding:40px 0}
.page-body section:last-child{border-bottom:0}
.page-body section h3{margin-top:32px}
.page-body .copy-btn{margin-bottom:16px}
.command,.request{margin:12px 0 16px;padding:14px 16px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface);color:var(--ink);font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.steps,.file-list,.retention-list,.plain-list{padding-left:20px;margin:12px 0 16px}
.steps>li{margin-block:10px}
.file-list li,.retention-list li,.plain-list li{margin-block:8px}
dt{font-weight:600;font-size:16px;color:var(--ink);margin-top:24px}
dd{margin:6px 0 0}

/* Skill and reference pages (/shopify-va/skills/...): the setup page's reading column, with the skill file rendered as plain type */
/* Reference headings run up to 86 characters: they step down in size so they stay at 4 lines or fewer on a 320px phone */
.doc-head h1.h1-long{font-size:clamp(28px,3.8vw,44px)}
.doc-head h1.h1-longer{font-size:clamp(24px,3.4vw,40px)}
.md-body{overflow-wrap:break-word}
.md-body h2{font-size:clamp(28px,3vw,36px);margin:48px 0 14px}
.md-body h3{margin:36px 0 10px}
.md-body h4,.md-body h5,.md-body h6{font-family:var(--display);font-size:16px;line-height:1.4;font-weight:600;color:var(--ink);margin:28px 0 8px}
.md-body>:first-child{margin-top:0}
.md-body ul,.md-body ol{padding-left:22px;margin:10px 0 16px;max-width:65ch}
.md-body li{margin-block:6px}
.md-body li>ul,.md-body li>ol{margin:6px 0}
.md-body li>p{margin:0 0 8px}
.md-body strong{font-weight:600;color:var(--ink)}
.md-body blockquote{margin:16px 0;padding:0 0 0 20px;color:var(--muted)}
.md-body blockquote p{color:var(--muted)}
.md-body hr{border:0;border-top:1px solid var(--line);margin:32px 0}
.md-code{margin:12px 0 16px;padding:14px 16px;border:1px solid var(--line);border-radius:var(--radius-well);background:var(--surface);color:var(--ink);font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.md-code code{font-size:inherit}
.md-table{margin:12px 0 20px}
.md-table table{width:100%;border-collapse:collapse;text-align:left;font-size:14px;line-height:1.45}
.md-table th{padding:0 12px 8px 0;font-weight:600;color:var(--muted);border-bottom:1px solid var(--line);vertical-align:bottom}
.md-table td{padding:10px 12px 10px 0;border-bottom:1px solid var(--line);color:var(--ink);vertical-align:top;min-width:6ch}
/* Skill slugs in a table keep their words whole: on a phone the table scrolls inside its own box instead */
.md-table td code{overflow-wrap:normal;word-break:normal;white-space:nowrap}
.doc-links{list-style:none;margin:12px 0 0;padding:0}
.doc-links li{display:grid;gap:2px;padding:12px 0;border-bottom:1px solid var(--line)}
.doc-links a{font-weight:600;justify-self:start}
.doc-links span{font-size:14px;color:var(--muted)}
.doc-source{margin:32px 0 0;font-size:14px}

/* Footer */
.footer-band{width:100%;background:var(--ground);border-top:1px solid var(--line)}
.site-footer{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:32px 0 40px;font-size:14px;color:var(--muted)}
.site-footer p{margin:0 auto;font-size:14px;color:var(--muted)}
.site-footer p a{color:var(--ink)}
.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 24px}
.site-footer a{color:var(--muted);font-size:14px;transition:color var(--dur) var(--ease)}
.site-footer nav a{display:inline-flex;align-items:center;min-height:32px}
.site-footer a:hover{color:var(--accent)}

/* Embedded Shopify Admin (/app): keeps its own light Shopify Admin look and system fonts; re-declare the light role tokens so the dark public ladder never reaches it */
.app-home{color-scheme:light;--display:var(--sans);--sans:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;--mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;--ground:#ffffff;--surface:#f2f7f5;--line:#cde0d7;--ink:#091713;--muted:#4c645a;--accent:#007a5c;--accent-hover:#00634b;--on-accent:#ffffff;font-family:var(--sans)}
html:has(body.app-home){background:#f6f6f7;color-scheme:light}
.app-home{background:#f6f6f7;font-size:16px;color:#18181b}.app-home a{color:#00634b}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:16px;color:#18181b}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px;color:#18181b}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px;color:#18181b}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:14px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0;color:#18181b}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}

@media(min-width:1024px){
  .hero-grid{grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:64px}
  .hero-h1{font-size:clamp(52px,4.4vw,64px)}
}
@media(max-width:960px){
  .seq-item{grid-template-columns:32px minmax(160px,210px) 1fr}
  .seq-gate{grid-column:2 / -1}
  .skill-text{grid-template-columns:1fr}
  .cmd-item{grid-template-columns:1fr auto;gap:6px 14px}
  .cmd-label{grid-column:1 / -1}
}
@media(max-width:720px){
  .shell{--gutter:max(16px,env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))}
  :root{--gap-major:80px;--gap-related:40px;--gap-end:64px}
  .family-header{gap:12px}
  .family-nav{gap:14px}
  .hero.stage{padding-top:124px}
  .hero-sub{font-size:20px}
  .ex-tabs{display:flex;width:100%}
  .ex-tabs label{flex:1 1 auto;padding:8px 8px}
  .page-body section{padding:48px 0 40px}
  .md-table table{min-width:560px}
  .seq-item{grid-template-columns:28px 1fr;gap:4px 12px;padding:16px 12px}
  .seq-skills,.seq-gate{grid-column:2 / -1}
  .apps-matrix{grid-template-columns:1fr}
  .skill-entry{grid-template-columns:1fr;padding:16px 12px}
  .skill-actions{justify-content:space-between}
  .seg-tabs{width:100%}
  .seg-tab{flex:1 1 auto;min-height:44px;padding:8px 10px}
  .doc-jump a,.seq-gates a{min-height:44px;line-height:44px}
  .doc-jump a{line-height:1.5}
  .skill-filter{width:100%}
  .skill-filter input{flex:1;width:auto;min-width:0;min-height:44px}
  .copy-btn,.skill-actions a,.site-footer nav a{min-height:44px}
  .site-footer nav{gap:0 20px}
  .site-footer nav a{display:inline-flex;align-items:center}
  .wb-tabs{display:flex;width:100%}
  .wb-tabs label{flex:1 1 auto;text-align:center;padding:8px 8px}
  .bottleneck-table th:nth-child(2),.bottleneck-table td:nth-child(2),.bottleneck-table th:nth-child(3),.bottleneck-table td:nth-child(3){display:none}
  .bn-sub{display:block;margin-top:4px;font-size:14px;font-weight:400;line-height:1.45;color:var(--muted)}
  .seg-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
  .seg-tab:first-child{grid-column:1/-1}
  .seg-tab+.seg-tab{border-left:0}
  .seg-tab{border-top:1px solid var(--line)}
  .seg-tab:first-child{border-top:0}
  .seg-tab:nth-child(odd):not(:first-child){border-left:1px solid var(--line)}
  .setup-drawer{padding:0 16px}
  .app-home input{width:100%}
  .connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}
}
/* Two-row header (brand + site links, then product tabs) once one row of 16px links no longer fits */
@media(max-width:680px){
  .family-header{flex-wrap:wrap;height:auto;gap:0 12px;padding-top:8px}
  .setup-brand{font-size:16px}
  .family-nav{gap:12px}
  .family-tabs{order:3;width:100%;height:44px;margin-top:0}
  .family-tabs a{padding:0 10px}
  .family-tabs a:first-child{padding-left:0}
  .hero.stage{padding-top:140px}
}
@media(max-width:560px){
  .cmd-row{flex-direction:column;align-items:stretch;padding:10px}
  .cmd-row .copy-btn{width:100%}
}
@media(max-width:400px){
  .bottleneck-table thead{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%)}
  .bottleneck-table,.bottleneck-table tbody{display:block}
  .bottleneck-table tr{display:block;padding:14px 12px;border-bottom:1px solid var(--line)}
  .bottleneck-table tbody{border-top:1px solid var(--line)}
  .bottleneck-table td,.bottleneck-table td:first-child,.bottleneck-table td:last-child{display:block;padding:0}
  .bottleneck-table td.bn-action{text-align:left;margin-top:2px}
  .bottleneck-table td.bn-action .copy-btn-text{padding-left:0}
  .seq-item{grid-template-columns:28px 1fr}
  .seq-skills,.seq-gate{grid-column:1 / -1}
}

@media(max-width:480px){
  .wb-row{flex-direction:column;align-items:stretch;padding:10px}
  .wb-row .copy-btn{width:100%}
}
/* 16px nav links no longer share a row with the brand on narrow phones: brand, links, then product tabs */
@media(max-width:420px){
  .family-nav{order:2;width:100%;margin-left:0;justify-content:flex-start;gap:20px}
  .hero.stage{padding-top:172px}
}
@media(max-width:360px){
  .skill-filter{flex-wrap:wrap;gap:8px 12px}
  .skill-filter input{flex:1 1 100%}
  .shell{--gutter:max(12px,env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))}
  .cmd-item{grid-template-columns:1fr}
  .cmd-item .copy-btn{justify-self:start}
}
/* Landscape phones and 200% zoom: little height, so trim the vertical padding */
@media(max-height:520px) and (orientation:landscape){
  :root{--gap-major:56px;--gap-related:32px;--gap-end:40px}
  .hero.stage{padding:96px 0 var(--gap-end)}
  .doc-head{padding:36px 0 24px}
  .page-body section{padding:32px 0}
}
@media(max-height:520px) and (max-width:560px){
  .hero.stage{padding-top:124px}
}

/* Notched phones in landscape: keep content and the full-bleed header clear of the sensor housing */
@supports(padding:max(0px)){
  .skip-link{left:max(16px,env(safe-area-inset-left,0px))}
  .site-footer{padding-bottom:max(40px,calc(24px + env(safe-area-inset-bottom,0px)))}
}

/* Large screens: widen the layout instead of leaving a narrow column in the middle (the h1 stays at 64px) */
@media(min-width:1600px){
  .shell{width:min(1320px,calc(100% - 2*var(--gutter)))}
  .hero.stage{padding:156px 0 var(--gap-end)}
  .workbench{max-width:720px}
  .quick-setup,.setup-drawer{max-width:960px}
}
@media(min-width:2200px){
  .shell{width:min(1560px,calc(100% - 2*var(--gutter)))}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}
  .family-tabs a,.family-nav a,.wb-tabs label,.ex-tabs label,.seg-tab,.copy-btn,.site-footer a,.seq-item,.seq-num,.seq-gates a,.skill-entry,.bottleneck-table tbody tr,.skill-filter input{transition:none}
}
`;
