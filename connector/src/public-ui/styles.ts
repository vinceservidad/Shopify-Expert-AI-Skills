/* Marketing Skills — Shopify VA public design system:
   - One all-dark tonal ladder for every public band: one ground (plus one very small "alt" step), one raised surface, one border, one hover border, three text colours; soft mint accent (#6cc9a0) only on actions, active states and card hover.
   - Two surface types: raised (ring + top highlight) and recessed wells (inner shadow + ring). 6px buttons, 8px boxes.
   - Live cards (skills, example columns, sequence rows, problem rows): raised surface; on hover/focus-within the ring turns mint, the card lifts 2px and casts a soft mint glow; they fade up in a stagger as they scroll in. Reduced motion drops the lift and the reveal.
   - Native system fonts only (0 @font-face), readable type scale: 14px small, 16px body, 18-20px lead, 16px minimum form fields, 150ms cubic-bezier(.2,0,0,1) motion on paint properties only.
   - Anti-slop: 0 pill badges, 0 eyebrow kickers, 0 nested cards, 0 gradient headings, 0 overflow at 320px/390px. */
export const PUBLIC_STYLES = `
:root{
  color-scheme:dark;
  --sans:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
  /* One dark ladder: ground, alt ground step, raised, border, hover border, three text colours, accent */
  --ground:#070807;
  --ground-alt:#0b0c0b;
  --raised:#121412;
  --border:rgba(255,255,255,.12);
  --border-hover:rgba(108,201,160,.5);
  --ink:#f2f4f1;
  --ink-2:#c8cec6;
  --muted:#9ba398;
  --accent:#6cc9a0;
  --accent-glow:rgba(108,201,160,.16);
  --on-accent:#070807;
  --hl:rgba(255,255,255,.05);
  --card:inset 0 1px 0 var(--hl),0 0 0 1px var(--border);
  --card-hot:inset 0 1px 0 var(--hl),0 0 0 1px var(--border-hover),0 16px 32px -18px rgba(108,201,160,.5),0 0 28px -10px var(--accent-glow);
  --well:inset 0 2px 5px rgba(0,0,0,.45);
  --btn-shadow:0 1px 2px rgba(0,0,0,.75),inset 0 1px 0 rgba(255,255,255,.18);
  --btn-press:inset 0 0 0 100px rgba(0,0,0,.1);
  --radius-btn:6px;
  --radius-box:8px;
  --section-y:96px;
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
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--ground);color:var(--ink);font-size:14px;border-radius:var(--radius-btn);box-shadow:0 0 0 1px var(--border);z-index:30}
.skip-link:focus{top:12px}
.shell{--gutter:max(24px,env(safe-area-inset-left,0px),env(safe-area-inset-right,0px));width:min(1120px,calc(100% - 2*var(--gutter)));margin-inline:auto}

/* Single-line 64px header: borderless over hero bleeding to y = 0, clean hairline on doc pages */
.top-bar{position:relative;z-index:10;border-bottom:1px solid var(--border);background:var(--ground)}
body.has-hero .top-bar{position:absolute;inset:0 0 auto 0;border-bottom:0;background:transparent}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px}
.setup-brand{display:inline-flex;align-items:center;min-height:44px;font-family:var(--sans);font-size:18px;font-weight:750;letter-spacing:-.025em;line-height:1;color:var(--ink);text-decoration:none;white-space:nowrap}
.setup-brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--sans);font-size:16px;font-weight:500}
.family-tabs a{display:flex;align-items:center;padding:0 12px;margin-bottom:-1px;color:var(--muted);border-bottom:2px solid transparent;white-space:nowrap;text-decoration:none;transition:color var(--dur) var(--ease),border-color var(--dur) var(--ease)}
.family-tabs a:hover{color:var(--ink);text-decoration:none}
.family-tabs a[data-product=va][aria-current=page]{color:var(--ink);border-bottom-color:var(--accent)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-family:var(--sans);font-size:16px;font-weight:500}
.family-nav a{display:inline-flex;align-items:center;min-height:44px;color:var(--ink-2);white-space:nowrap;text-decoration:none;transition:color var(--dur) var(--ease)}
.family-nav a:hover{color:var(--ink);text-decoration:none}
.family-nav a[aria-current=page]{color:var(--ink);text-decoration:underline;text-decoration-thickness:2px;text-decoration-color:var(--accent);text-underline-offset:8px}
body.has-hero .top-bar a:focus-visible,.site-footer a:focus-visible{outline-color:var(--accent)}

/* Full-bleed Shopify emerald-forest hero bleeding to y = 0, centered monumental layout */
.hero.stage{position:relative;isolation:isolate;overflow:hidden;width:100%;padding:124px 0 var(--section-y);color:var(--ink);background:radial-gradient(90% 80% at 50% 0%,rgba(108,201,160,.08) 0%,var(--ground) 60%)}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0;transition:opacity .4s var(--ease)}
.hero-canvas.is-live{opacity:1}
.hero-inner{max-width:860px;margin-inline:auto;text-align:center;animation:hero-rise 260ms var(--ease)}
.hero-h1{text-wrap:balance;overflow-wrap:break-word;font-size:clamp(42px,6.8vw,80px);line-height:.98;font-weight:800;letter-spacing:-.045em;color:var(--ink);margin:0 0 20px}
.hero-sub{font-size:20px;line-height:1.5;color:var(--ink-2);max-width:36em;margin:0 auto 32px}

/* Wide interactive 3-tab setup workbench centered inside the hero */
.workbench{max-width:740px;margin:0 auto;text-align:center}
.wb-radio{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;pointer-events:none}
.wb-tabs{display:inline-flex;border-radius:var(--radius-box);background:var(--raised);box-shadow:inset 0 1px 0 var(--hl),0 0 0 1px var(--border);overflow:hidden;margin:0 auto 16px}
.wb-tabs label{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 18px;font-size:16px;font-weight:600;color:var(--ink-2);cursor:pointer;user-select:none;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease),transform var(--dur) var(--ease)}
.wb-tabs label+label{border-left:1px solid var(--border)}
.wb-tabs label:hover{color:var(--ink)}
#wb-claude:checked ~ .wb-tabs label[for=wb-claude],#wb-chatgpt:checked ~ .wb-tabs label[for=wb-chatgpt],#wb-cli:checked ~ .wb-tabs label[for=wb-cli]{background:var(--accent);color:var(--on-accent)}
.wb-tabs label:active,.ex-tabs label:active{transform:translateY(1px)}
.wb-tabs label:focus-visible,.ex-tabs label:focus-visible{outline:2px solid var(--accent);outline-offset:-4px}
.wb-tabs label[aria-selected=true]:focus-visible,.ex-tabs label[aria-selected=true]:focus-visible{outline-color:var(--on-accent)}
#wb-claude:focus-visible ~ .wb-tabs label[for=wb-claude],#wb-chatgpt:focus-visible ~ .wb-tabs label[for=wb-chatgpt],#wb-cli:focus-visible ~ .wb-tabs label[for=wb-cli],#ex-csv:focus-visible ~ .ex-tabs-wrap label[for=ex-csv],#ex-cb:focus-visible ~ .ex-tabs-wrap label[for=ex-cb],#ex-list:focus-visible ~ .ex-tabs-wrap label[for=ex-list]{outline:2px solid var(--on-accent);outline-offset:-4px}
.wb-panels,.ex-panels{display:grid}
.wb-panel,.ex-panel{grid-area:1/1;visibility:hidden}
#wb-claude:checked ~ .wb-panels .wb-claude,#wb-chatgpt:checked ~ .wb-panels .wb-chatgpt,#wb-cli:checked ~ .wb-panels .wb-cli{visibility:visible;animation:fade-in 150ms var(--ease)}
.wb-row{display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:var(--radius-box);background:var(--ground);box-shadow:var(--well),0 0 0 1px var(--border);text-align:left;transition:box-shadow var(--dur) var(--ease)}
.wb-row:hover{box-shadow:var(--well),0 0 0 1px var(--border-hover)}
.wb-row code{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.copy-btn{flex-shrink:0;max-width:100%;min-height:40px;padding:6px 14px;border:0;border-radius:var(--radius-btn);background:var(--accent);color:var(--on-accent);box-shadow:var(--btn-shadow);font-family:var(--sans);font-size:16px;font-weight:650;cursor:pointer;transition:background-color var(--dur) var(--ease),box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease)}
.copy-btn:hover{box-shadow:var(--btn-press),var(--btn-shadow)}
.copy-btn:active{transform:translateY(1px)}
.copy-btn-line{border:1px solid var(--border);background:transparent;color:var(--accent);box-shadow:none}
.copy-btn-line:hover{background:var(--accent);color:var(--on-accent);border-color:var(--accent);box-shadow:none}
.copy-btn-line.is-copied{background:var(--accent);color:var(--on-accent);border-color:var(--accent);box-shadow:none}
.copy-btn-text{min-height:44px;text-align:inherit;padding:6px 0 6px 8px;border:0;border-radius:0;background:transparent;color:var(--accent);box-shadow:none;font-weight:600;text-decoration:none}
.copy-btn-text:hover{background:transparent;color:var(--accent);box-shadow:none;text-decoration:underline;text-underline-offset:4px}
.copy-btn-text svg{width:14px;height:14px;margin-right:6px;vertical-align:-2px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.wb-note{font-size:14px;line-height:1.45;color:var(--ink-2);margin:10px auto 0;text-align:center}
.wb-links{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px 20px;margin-top:4px;font-size:16px}
.wb-links a{display:inline-flex;align-items:center;min-height:44px;padding:0 4px;color:var(--accent);font-weight:500}

/* Bands: all dark. Adjacent sections are separated by the 1px hairline and spacing; .band-alt is one very small ground step. */
.band{width:100%;padding:var(--section-y) 0;background:var(--ground);border-bottom:1px solid var(--border)}
.band-alt{background:var(--ground-alt)}
.will-reveal{opacity:0;transform:translateY(12px);transition:opacity .3s var(--ease),transform .3s var(--ease)}
.will-reveal.is-in{opacity:1;transform:none}
/* Staggered card reveal: theme.js marks each child of [data-stagger] and sets a short per-card delay as a batch scrolls in */
.will-rise{opacity:0;translate:0 16px;transition:opacity .45s var(--ease),translate .45s var(--ease)}
.will-rise.is-in{opacity:1;translate:none}
.section-head{text-align:center;max-width:68ch;margin:0 auto 40px}
.section-head p{margin:0 auto;max-width:36em;font-size:18px;line-height:1.55}
h1,h2,h3{color:var(--ink);margin-top:0}
h1,h2{text-wrap:balance}
h2{font-size:clamp(30px,3.8vw,40px);line-height:1.15;font-weight:750;letter-spacing:-.04em;margin:0 0 16px}
h3{font-size:20px;line-height:1.3;font-weight:650;margin:0 0 6px}
p,li,dd{font-size:16px;line-height:1.55;color:var(--ink-2)}
p{margin:0 0 14px;max-width:65ch;text-wrap:pretty}
.muted{font-size:14px;color:var(--muted)}

/* Hairline-ruled architectural tables & sequence/example sections */
.ex-box{max-width:920px;margin:0 auto}
.ex-radio{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);clip-path:inset(50%);white-space:nowrap;border:0;pointer-events:none}
.ex-tabs-wrap{text-align:center}
.ex-tabs{display:inline-flex;border-radius:var(--radius-box);background:var(--raised);box-shadow:inset 0 1px 0 var(--hl),0 0 0 1px var(--border);overflow:hidden;margin:0 auto 32px}
.ex-tabs label{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:8px 18px;font-size:16px;font-weight:600;color:var(--ink-2);cursor:pointer;user-select:none;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease),transform var(--dur) var(--ease)}
.ex-tabs label+label{border-left:1px solid var(--border)}
.ex-tabs label:hover{color:var(--ink)}
#ex-csv:checked ~ .ex-tabs-wrap label[for=ex-csv],#ex-cb:checked ~ .ex-tabs-wrap label[for=ex-cb],#ex-list:checked ~ .ex-tabs-wrap label[for=ex-list]{background:var(--accent);color:var(--on-accent)}
#ex-csv:checked ~ .ex-panels .ex-csv,#ex-cb:checked ~ .ex-panels .ex-cb,#ex-list:checked ~ .ex-panels .ex-list{visibility:visible;animation:fade-in 150ms var(--ease)}
.ex-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:16px;padding:4px 0;text-align:left}
.ex-col{min-width:0;padding:24px 28px;border-radius:var(--radius-box);background:var(--raised);box-shadow:var(--card);transition:box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease),opacity .45s var(--ease),translate .45s var(--ease)}
.ex-col:hover{box-shadow:var(--card-hot);transform:translateY(-2px)}
.ex-col p{margin:0}
.ex-label{display:block;font-size:14px;font-weight:650;color:var(--accent);margin-bottom:8px}
.ex-points{padding-left:18px;margin:0}
.ex-points li{margin-bottom:8px}
.ex-points li:last-child{margin-bottom:0}

.seq-strip{display:none;margin:0 0 20px}
.seq-strip.is-live{display:block}
.seq-canvas{display:block;width:100%;height:56px}
.seq-gates{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));margin-top:2px}
.seq-gates a{display:block;text-align:center;font-family:var(--mono);font-size:14px;font-weight:600;font-variant-numeric:tabular-nums;line-height:32px;color:var(--muted);text-decoration:none;transition:color var(--dur) var(--ease)}
.seq-gates a.is-passed,.seq-gates a.is-focus{color:var(--accent)}
.seq-gates a.is-focus{font-weight:800}
.seq-gates a:hover{color:var(--ink);text-decoration:none}
.sequence-list{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.seq-item{display:grid;grid-template-columns:36px minmax(150px,190px) minmax(180px,240px) 1fr;gap:8px 20px;align-items:baseline;padding:16px 20px;scroll-margin-top:16px;border-radius:var(--radius-box);background:var(--raised);box-shadow:var(--card);transition:box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease),opacity .45s var(--ease),translate .45s var(--ease)}
.seq-item.is-lit,.seq-item:target,.seq-item:hover{box-shadow:inset 3px 0 0 var(--accent),var(--card-hot);transform:translateY(-2px)}
.sequence-list:has(.is-lit) .seq-item:target:not(.is-lit){box-shadow:var(--card);transform:none}
.seq-num{font-family:var(--sans);font-variant-numeric:tabular-nums;font-size:14px;font-weight:700;color:var(--accent)}
.seq-stage{font-size:16px;font-weight:650;color:var(--ink)}
.seq-skills{font-size:14px;font-weight:600;color:var(--accent)}
.seq-gate{font-size:16px;line-height:1.5;color:var(--ink-2)}

/* Problem rows are separated raised cards: the table keeps its semantics, each cell paints its slice of the ring */
.table-wrap{width:100%;overflow-x:auto}
.bottleneck-table{width:100%;border-collapse:separate;border-spacing:0 8px;text-align:left}
.bottleneck-table th{padding:4px 16px 0;font-size:14px;font-weight:650;color:var(--muted);white-space:nowrap}
.bottleneck-table th:first-child,.bottleneck-table td:first-child{padding-left:20px}
.bottleneck-table th:last-child,.bottleneck-table td:last-child{padding-right:16px}
.bottleneck-table th:last-child{text-align:right}
.bottleneck-table tbody tr{--ring:var(--border);--bar:transparent;transition:transform var(--dur) var(--ease),opacity .45s var(--ease),translate .45s var(--ease)}
.bottleneck-table td{padding:14px 16px;font-size:16px;line-height:1.45;color:var(--ink-2);vertical-align:middle;background:var(--raised);box-shadow:inset 0 1px 0 var(--hl),inset 0 1px 0 var(--ring),inset 0 -1px 0 var(--ring);transition:box-shadow var(--dur) var(--ease)}
.bottleneck-table td:first-child{border-top-left-radius:var(--radius-box);border-bottom-left-radius:var(--radius-box);box-shadow:inset 3px 0 0 var(--bar),inset 1px 0 0 var(--ring),inset 0 1px 0 var(--hl),inset 0 1px 0 var(--ring),inset 0 -1px 0 var(--ring)}
.bottleneck-table td:last-child{border-top-right-radius:var(--radius-box);border-bottom-right-radius:var(--radius-box);box-shadow:inset -1px 0 0 var(--ring),inset 0 1px 0 var(--hl),inset 0 1px 0 var(--ring),inset 0 -1px 0 var(--ring)}
.bottleneck-table tbody tr:hover,.bottleneck-table tbody tr:focus-within{--ring:var(--border-hover);--bar:var(--accent);transform:translateY(-2px)}
.bn-sub{display:none}
.bottleneck-table td.bn-problem{font-weight:600;color:var(--ink)}
.bottleneck-table td.bn-first{color:var(--accent);font-weight:650;white-space:nowrap}
.bottleneck-table td.bn-next{font-size:14px;color:var(--muted)}
.bottleneck-table td.bn-action{text-align:right;white-space:nowrap}


/* Connected segmented tabs + search + hairline-ruled 19-playbook index (no boxed cards!) */
.catalog-controls{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;margin-bottom:32px}
.seg-tabs{display:inline-flex;flex-wrap:wrap;max-width:100%;border-radius:var(--radius-box);overflow:hidden;background:var(--raised);box-shadow:inset 0 1px 0 var(--hl),0 0 0 1px var(--border)}
.seg-tab{min-height:40px;padding:6px 14px;border:0;background:transparent;color:var(--ink-2);font-family:var(--sans);font-size:16px;font-weight:600;cursor:pointer;transition:background-color var(--dur) var(--ease),color var(--dur) var(--ease),transform var(--dur) var(--ease)}
.seg-tab+.seg-tab{border-left:1px solid var(--border)}
.seg-tab:hover{color:var(--ink);background:var(--ground)}
.seg-tab[aria-pressed=true]{background:var(--accent);color:var(--on-accent)}
.skill-filter{display:flex;align-items:center;gap:12px}
.skill-filter input{width:296px;max-width:100%;min-height:40px;padding:7px 12px;border:0;border-radius:var(--radius-box);background:var(--ground);box-shadow:var(--well),0 0 0 1px var(--border);color:var(--ink);font-family:var(--sans);font-size:16px;transition:box-shadow var(--dur) var(--ease)}
.skill-filter input::placeholder{color:var(--muted)}
.skill-filter input:hover{box-shadow:var(--well),0 0 0 1px var(--border-hover)}
.skill-filter input:focus{box-shadow:var(--well),0 0 0 1px var(--accent);outline:none}
.skill-filter input::-webkit-search-cancel-button{cursor:pointer}
.skill-filter span{font-family:var(--sans);font-variant-numeric:tabular-nums;font-size:14px;font-weight:600;color:var(--accent);white-space:nowrap}

/* Skill cards: raised surface with a 2px group-coloured top bar; the GitHub link stretches over the card, Copy prompt stays on top */
.skill-index{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.skill-entry{--cat:var(--accent);position:relative;display:flex;flex-direction:column;justify-content:space-between;gap:16px;padding:24px 24px 16px;border-radius:var(--radius-box);background:var(--raised);box-shadow:inset 0 1px 0 var(--hl),0 0 0 1px var(--border),inset 0 2px 0 var(--cat);transition:box-shadow var(--dur) var(--ease),transform var(--dur) var(--ease),opacity .45s var(--ease),translate .45s var(--ease)}
.skill-entry[data-cat="Orders & Support"]{--cat:#7fa9cc}
.skill-entry[data-cat="Growth & Ads"]{--cat:#cfae7a}
.skill-entry[data-cat="Store & Theme"]{--cat:#a59ad2}
.skill-entry:hover,.skill-entry:focus-within{box-shadow:inset 0 1px 0 var(--hl),0 0 0 1px var(--border-hover),inset 0 2px 0 var(--cat),0 16px 32px -18px rgba(108,201,160,.5),0 0 28px -10px var(--accent-glow);transform:translateY(-2px)}
.skill-gh::after{content:'';position:absolute;inset:0;border-radius:var(--radius-box)}
.skill-entry .copy-btn{position:relative;z-index:1}
.skill-entry:hover .skill-gh{text-decoration:underline}
.skill-entry h3{font-size:20px;margin:0 0 6px;color:var(--ink)}
.skill-entry p{font-size:16px;line-height:1.5;margin:0;color:var(--ink-2)}
.skill-empty{padding:40px 0;text-align:center}
.skill-empty p{margin:0 auto 16px;max-width:none}
.skill-empty-q{color:var(--ink)}
.seg-tab:active{transform:translateY(1px)}
.skill-actions{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:12px;border-top:1px solid var(--border)}
.skill-actions a{display:inline-flex;align-items:center;min-height:40px;font-size:16px;font-weight:600;color:var(--accent);white-space:nowrap}
.skill-actions a:hover{text-decoration:underline}

/* Unified 1px hairline matrix for the 4x2 (desktop) / 2x4 (mobile) supported AI apps */
.apps-matrix{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1px;background:var(--border);border-radius:var(--radius-box);overflow:hidden;box-shadow:0 0 0 1px var(--border);margin:24px 0 32px}
.app-cell{padding:16px 18px;background:var(--ground);transition:background-color var(--dur) var(--ease)}
.app-cell:hover{background:var(--raised)}
.app-name{display:block;font-size:16px;font-weight:650;color:var(--ink);margin-bottom:4px}
.app-mode{display:block;font-size:14px;color:var(--muted)}

/* Clean hairline command rows (zero nested box cages) */
.cmd-list{border-top:1px solid var(--border)}
.cmd-item{display:grid;grid-template-columns:minmax(150px,190px) 1fr auto;gap:10px 20px;align-items:center;padding:14px 0;border-bottom:1px solid var(--border)}
.cmd-label strong{display:block;font-size:16px;color:var(--ink);font-weight:650}
.cmd-label span{display:block;font-size:14px;color:var(--muted);margin-top:2px}
.cmd-code{font-family:var(--mono);font-size:14px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere;min-width:0}
.cmd-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:12px 0 16px;padding:8px 8px 8px 16px;border-radius:var(--radius-box);background:var(--raised);box-shadow:var(--well),0 0 0 1px var(--border);transition:box-shadow var(--dur) var(--ease)}
.cmd-row:hover{box-shadow:var(--well),0 0 0 1px var(--border-hover)}
.cmd-row .cmd-code{flex:1}
.page-body .cmd-row .copy-btn{margin:0}
.cmd-row .copy-btn,.cmd-item .copy-btn{min-width:88px}
.quick-setup{list-style:none;counter-reset:qs;max-width:860px;margin:0 auto;padding:0;border-top:1px solid var(--border)}
.quick-setup>li{counter-increment:qs;position:relative;padding:24px 0 24px 44px;border-bottom:1px solid var(--border)}
.quick-setup>li::before{content:'0' counter(qs);position:absolute;left:0;top:27px;font-family:var(--sans);font-size:14px;line-height:1.3;font-weight:700;font-variant-numeric:tabular-nums;color:var(--accent)}
.quick-setup h3{margin-bottom:8px}
.quick-setup .request{margin-bottom:8px}
.setup-drawer{max-width:860px;margin:0 auto;border-bottom:1px solid var(--border)}
.setup-drawer summary:hover{color:var(--accent)}
.setup-drawer summary{display:flex;align-items:center;justify-content:space-between;gap:16px;min-height:52px;padding:16px 0;font-size:18px;font-weight:600;color:var(--ink);cursor:pointer;list-style:none}
.setup-drawer summary::-webkit-details-marker{display:none}
.setup-drawer summary::after{content:'+';font-family:var(--mono);font-size:18px;font-weight:600;color:var(--accent);flex-shrink:0}
.setup-drawer[open] summary::after{content:'−'}
.setup-drawer-body{padding:4px 0 24px}
.setup-intro{font-size:18px;line-height:1.55;text-align:center;margin:0 auto 0;max-width:36em}
.setup-foot{margin:24px auto 0;font-size:14px;color:var(--muted);text-align:center;text-wrap:balance}

/* FAQ hairline accordion */
.faq-list{border-top:1px solid var(--border);margin:24px auto 0;max-width:780px}
.faq-item{border-bottom:1px solid var(--border)}
.faq-item summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;font-size:18px;font-weight:600;color:var(--ink);cursor:pointer;list-style:none}
.faq-item summary::-webkit-details-marker{display:none}
.faq-item summary::after{content:'+';font-family:var(--mono);font-size:18px;font-weight:600;color:var(--accent);flex-shrink:0}
.faq-item[open] summary::after{content:'−'}
.faq-item summary:hover{color:var(--accent)}
.faq-item p{padding:0 0 18px;margin:0}

/* Document pages (/help, /privacy) */
.page-body{padding-bottom:56px}
.page-body.shell{width:min(880px,calc(100% - 2*var(--gutter)))}
.doc-jump{display:flex;flex-wrap:wrap;gap:0 22px;margin-top:18px}
.doc-jump a{display:inline-flex;align-items:center;min-height:32px;font-size:16px;font-weight:600}
.doc-head{padding:56px 0 40px;border-bottom:1px solid var(--border)}
.crumbs{margin:0 0 14px;font-size:14px}.crumbs ol{display:flex;flex-wrap:wrap;gap:2px 0;list-style:none;margin:0;padding:0;color:var(--ink-2)}.crumbs li{display:inline-flex;align-items:center;min-height:32px}.crumbs li+li::before{content:"/";margin:0 8px;color:var(--ink-2)}.crumbs a{display:inline-flex;align-items:center;min-height:32px}
.doc-head>p{font-size:18px;line-height:1.55}
.doc-head h1{font-size:clamp(34px,4.6vw,48px);line-height:1.1;font-weight:750;letter-spacing:-.04em;margin:0 0 16px}
.page-body section{padding:56px 0;border-bottom:1px solid var(--border);scroll-margin-top:20px}
.page-body section:last-child{border-bottom:0}
.page-body .copy-btn{margin-bottom:16px}
.command,.request{margin:12px 0 16px;padding:14px 16px;border-radius:var(--radius-box);background:var(--raised);box-shadow:var(--well),0 0 0 1px var(--border);color:var(--ink);font-size:14px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.steps,.file-list,.retention-list,.plain-list{padding-left:20px;margin:12px 0 16px}
.steps>li{margin-block:10px}
.file-list li,.retention-list li,.plain-list li{margin-block:8px}
dt{font-weight:650;font-size:16px;color:var(--ink);margin-top:18px}
dd{margin:6px 0 0}

/* Footer */
.footer-band{width:100%;background:var(--ground);border-top:1px solid var(--border)}
.site-footer{display:flex;flex-direction:column;align-items:center;text-align:center;gap:16px;padding:32px 0 40px;font-size:14px;color:var(--muted)}
.site-footer p{margin:0 auto;font-size:14px;color:var(--muted)}
.site-footer p a{color:var(--ink)}
.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 24px}
.site-footer a{color:var(--muted);font-size:14px;transition:color var(--dur) var(--ease)}
.site-footer nav a{display:inline-flex;align-items:center;min-height:32px}
.site-footer a:hover{color:var(--accent)}

/* Embedded Shopify Admin (/app): keeps its own light Shopify Admin look; re-declare the light role tokens so the dark public ladder never reaches it */
.app-home{color-scheme:light;--ground:#ffffff;--raised:#f2f7f5;--border:#cde0d7;--border-hover:#a9c7b9;--ink:#091713;--ink-2:#2c4239;--muted:#4c645a;--accent:#007a5c;--on-accent:#ffffff;--hl:rgba(255,255,255,.7);--well:inset 0 2px 4px rgba(0,0,0,.08);--btn-shadow:0 1px 2px rgba(0,0,0,.35),inset 0 1px 0 rgba(255,255,255,.25)}
html:has(body.app-home){background:#f6f6f7;color-scheme:light}
.app-home{background:#f6f6f7;font-size:16px;color:#18181b}.app-home a{color:#00634b}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:16px;color:#18181b}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px;color:#18181b}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px;color:#18181b}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:14px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0;color:#18181b}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}

@keyframes hero-rise{from{opacity:.5;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}

@media(max-width:960px){
  .skill-index{grid-template-columns:repeat(2,minmax(0,1fr))}
  .seq-item{grid-template-columns:32px minmax(160px,210px) 1fr}
  .seq-gate{grid-column:2 / -1}
  .cmd-item{grid-template-columns:1fr auto;gap:6px 14px}
  .cmd-label{grid-column:1 / -1}
}
@media(max-width:720px){
  .shell{--gutter:max(16px,env(safe-area-inset-left,0px),env(safe-area-inset-right,0px))}
  :root{--section-y:56px}
  .family-header{gap:12px}
  .family-nav{gap:14px}
  .hero.stage{padding-top:124px}
  .hero-h1{font-size:clamp(34px,9.5vw,52px)}
  .hero-sub{font-size:18px}
  .ex-tabs{display:flex;width:100%}
  .ex-tabs label{flex:1 1 auto;padding:8px 8px}
  .ex-grid{grid-template-columns:1fr;gap:12px}
  .ex-col{padding:20px}
  .page-body section{padding:40px 0}
  .seq-item{grid-template-columns:28px 1fr;gap:4px 12px}
  .seq-skills,.seq-gate{grid-column:2 / -1}
  .apps-matrix{grid-template-columns:repeat(2,minmax(0,1fr))}
  .skill-index{grid-template-columns:1fr}
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
  .seg-tabs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;background:var(--border)}
  .seg-tab{background:var(--raised)}
  .seg-tab:first-child{grid-column:1/-1}
  .seg-tab+.seg-tab{border-left:0}
  .seg-tab:hover{background:var(--ground)}
  .seg-tab[aria-pressed=true]{background:var(--accent)}
  .seq-item{padding:14px 16px}
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
  .bottleneck-table tr{display:block;margin-bottom:8px;padding:14px 16px;border-radius:var(--radius-box);background:var(--raised);box-shadow:inset 3px 0 0 var(--bar),inset 0 1px 0 var(--hl),0 0 0 1px var(--ring)}
  .bottleneck-table td,.bottleneck-table td:first-child,.bottleneck-table td:last-child{display:block;padding:0;border:0;border-radius:0;background:transparent;box-shadow:none}
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
  :root{--section-y:40px}
  .hero.stage{padding:96px 0 var(--section-y)}
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

/* Large screens: scale the layout up instead of leaving a narrow column in the middle */
@media(min-width:1600px){
  .shell{width:min(1320px,calc(100% - 2*var(--gutter)))}
  .hero.stage{padding:156px 0 var(--section-y)}
  .hero-inner{max-width:1040px}
  .hero-h1{font-size:clamp(80px,4.4vw,112px)}
  .hero-sub{font-size:20px}
  .workbench{max-width:820px}
  .skill-index{grid-template-columns:repeat(4,minmax(0,1fr))}
  .ex-box{max-width:1040px}
  .quick-setup,.setup-drawer{max-width:960px}
}
@media(min-width:2200px){
  .shell{width:min(1560px,calc(100% - 2*var(--gutter)))}
  .hero-h1{font-size:clamp(104px,4.2vw,144px)}
  .hero-inner{max-width:1240px}
}
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{transition-duration:.01ms!important;animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}
  .hero-inner,.wb-panel,.ex-panel,.will-reveal{animation:none;transition:none;opacity:1;transform:none}
  .will-rise{opacity:1;translate:none}
  .skill-entry:hover,.skill-entry:focus-within,.ex-col:hover,.seq-item.is-lit,.seq-item:target,.seq-item:hover,.bottleneck-table tbody tr:hover,.bottleneck-table tbody tr:focus-within{transform:none}
  .seq-gates span,.hero-canvas,.family-tabs a,.family-nav a,.wb-tabs label,.ex-tabs label,.seg-tab,.copy-btn,.site-footer a,.seq-item,.seq-gates a,.skill-entry,.ex-col,.bottleneck-table tbody tr,.bottleneck-table td,.app-cell{transition:none}
}
`;
