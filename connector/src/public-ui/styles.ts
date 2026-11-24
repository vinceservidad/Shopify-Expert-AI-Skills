/* Shopify VA Toolkit public design system (gemini-frontend-design):
   - Full-bleed emerald hero bleeding to y = 0 behind a borderless single-line header.
   - 2 font families (system sans + system mono), 3 body sizes below hero (14px, 16px, 28px), all >= 13px.
   - Subject-matched Shopify commerce emerald + cool slate/white palette (no beige, no purple).
   - Zero eyebrow kickers, zero pill badges, zero decorative numbering, zero nested cards. */
export const PUBLIC_STYLES = `
:root{color-scheme:light;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:var(--ground);font-size:16px;line-height:1.6;--mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
--ground:#f8faf9;--paper:#ffffff;--surface:#eef4f1;--ink:#0b1612;--ink-2:#33443d;--muted:#4d6159;--border:#d7e1dc;--hover:#e9f1ed;--accent:#008060;--on-accent:#ffffff;--accent-dark:#00634b;--stage:#002b22;--stage-2:#004235;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.2);--lime:#b9eb6a;--on-lime:#03221a;--mint:#8ee0b8;--syn-str:#0f766e;--syn-flag:#b45309;--syn-tag:#047857;--ease:cubic-bezier(0.22,1,0.36,1);}
:root.site.dark-mode{color-scheme:dark;--ground:#080d0b;--paper:#0f1714;--surface:#131f1a;--ink:#edf4f1;--ink-2:#c2d0ca;--muted:#8ca198;--border:#1e2d27;--hover:#16231d;--accent:#5fe3a1;--on-accent:#031c15;--accent-dark:#34d399;--stage:#031c16;--stage-2:#053026;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.18);--lime:#b9eb6a;--on-lime:#03221a;--mint:#8ee0b8;--syn-str:#6ee7b7;--syn-flag:#f59e0b;--syn-tag:#34d399;}
@media(prefers-color-scheme:dark){:root.site:not(.light-mode):not(.dark-mode){color-scheme:dark;--ground:#080d0b;--paper:#0f1714;--surface:#131f1a;--ink:#edf4f1;--ink-2:#c2d0ca;--muted:#8ca198;--border:#1e2d27;--hover:#16231d;--accent:#5fe3a1;--on-accent:#031c15;--accent-dark:#34d399;--stage:#031c16;--stage-2:#053026;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.18);--lime:#b9eb6a;--on-lime:#03221a;--mint:#8ee0b8;--syn-str:#6ee7b7;--syn-flag:#f59e0b;--syn-tag:#34d399;}}
*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}
a{color:var(--accent);text-underline-offset:4px}a:hover{text-decoration:underline}
a:focus-visible,button:focus-visible,input:focus-visible,label:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
code,pre{font-family:var(--mono)}code{overflow-wrap:anywhere;font-size:inherit}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--paper);color:var(--ink);font-size:14px;z-index:30}.skip-link:focus{top:12px}
.shell{width:min(1160px,calc(100% - 48px));margin-inline:auto}

/* Single-line navigation; borderless over hero, hairline on document pages */
.top-bar{position:relative;border-bottom:1px solid var(--border);background:var(--ground)}
body.has-hero .top-bar{position:absolute;inset:0 0 auto 0;z-index:10;border-bottom:0;background:transparent}
.family-header{display:flex;align-items:center;gap:24px;height:68px}
.brand{font-size:20px;line-height:1;font-weight:750;letter-spacing:-.03em;color:var(--ink);text-decoration:none;white-space:nowrap}.brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:4px;font-family:var(--mono);font-size:14px}
.family-tabs a{display:flex;align-items:center;padding:0 12px;color:var(--muted);text-decoration:none;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;transition:color .18s var(--ease),background-color .18s var(--ease)}
.family-tabs a:hover{color:var(--ink);background:var(--hover);text-decoration:none}
.family-tabs a[aria-current=page]{color:var(--ink);border-bottom-color:var(--accent)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-size:14px}
.family-nav a{color:var(--ink-2);text-decoration:none;white-space:nowrap;transition:color .18s var(--ease)}.family-nav a:hover{color:var(--ink);text-decoration:none}
body.has-hero .brand{color:var(--stage-ink)}
body.has-hero .family-tabs a{color:var(--stage-muted)}
body.has-hero .family-tabs a:hover{color:var(--stage-ink);background:rgba(255,255,255,.06)}
body.has-hero .family-tabs a[aria-current=page]{color:var(--stage-ink);border-bottom-color:var(--lime)}
body.has-hero .family-nav a{color:var(--stage-muted)}body.has-hero .family-nav a:hover{color:var(--stage-ink)}
.theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--muted);cursor:pointer;transition:color .18s var(--ease),background-color .18s var(--ease)}
.theme-toggle:hover{background:var(--hover);color:var(--ink)}.theme-toggle svg{width:18px;height:18px}
.theme-toggle .icon-sun{display:none}:root.dark-mode .theme-toggle .icon-sun{display:block}:root.dark-mode .theme-toggle .icon-moon{display:none}

/* Full-bleed monumental hero (bleeds to y = 0, centered display headline + wide workbench) */
.hero.stage{position:relative;isolation:isolate;overflow:hidden;width:100%;padding:128px 0 72px;color:var(--stage-ink);background:radial-gradient(120% 90% at 50% 0%,var(--stage-2) 0%,var(--stage) 58%,#001914 100%)}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0;transition:opacity .8s var(--ease)}.hero-canvas.is-live{opacity:1}
.hero-inner{text-align:center;max-width:960px;margin-inline:auto;animation:hero-rise 260ms var(--ease)}
.hero-h1{font-size:clamp(46px,6.8vw,88px);line-height:.98;font-weight:750;letter-spacing:-.045em;color:#f3fcf7;margin:0 0 22px}
.hero-h1 .mark{display:inline-block;vertical-align:-.11em;width:.78em;height:.78em;margin-right:.16em;color:var(--lime)}
.mark-hole{fill:var(--stage)}.mark-check{fill:none;stroke:var(--stage);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
.hero-sub{font-size:16px;line-height:1.55;color:var(--stage-muted);max-width:52ch;margin:0 auto 28px}
.hero-cta{display:inline-flex;align-items:center;gap:10px;min-height:46px;padding:10px 24px;border-radius:8px;background:var(--lime);color:var(--on-lime);font-size:16px;font-weight:650;text-decoration:none;transition:transform .18s var(--ease),filter .18s var(--ease)}
.hero-cta:hover{text-decoration:none;filter:brightness(1.06);transform:translateY(-1px)}
.hero-cta svg{width:18px;height:18px;flex-shrink:0;transition:transform .18s var(--ease)}.hero-cta:hover svg{transform:translateX(3px)}

/* Wide interactive 2-tab setup bar inside the hero (zero inline JS, strict-CSP safe) */
.workbench{max-width:760px;margin:36px auto 0;text-align:left}
.wb-radio{position:absolute;opacity:0;pointer-events:none}
.wb-tabs{display:inline-flex;gap:2px;padding:3px;border-radius:8px;background:rgba(255,255,255,.08);border:1px solid var(--stage-line);margin-bottom:16px}
.wb-tabs label{padding:8px 18px;border-radius:6px;font-size:14px;font-weight:600;color:var(--stage-muted);cursor:pointer;user-select:none;transition:background-color .16s var(--ease),color .16s var(--ease)}
.wb-tabs label:hover{color:var(--stage-ink)}
#wb-open:checked ~ .wb-tabs label[for=wb-open],#wb-cli:checked ~ .wb-tabs label[for=wb-cli]{background:var(--lime);color:var(--on-lime)}
.wb-panel{display:none}
#wb-open:checked ~ .wb-panels .wb-open,#wb-cli:checked ~ .wb-panels .wb-cli{display:block;animation:fade-in 180ms var(--ease)}
.wb-row{display:flex;align-items:center;gap:12px;padding:8px 8px 8px 16px;border-radius:10px;background:rgba(0,16,12,.78);border:1px solid var(--stage-line)}
.wb-row code{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--stage-ink);overflow-wrap:anywhere}
.copy-btn{flex-shrink:0;min-height:38px;padding:6px 16px;border:0;border-radius:6px;background:var(--lime);color:var(--on-lime);font-family:inherit;font-size:14px;font-weight:650;cursor:pointer;transition:filter .16s var(--ease)}
.copy-btn:hover{filter:brightness(1.06)}
.wb-note{font-size:14px;color:var(--stage-muted);margin:12px 0 0}
.wb-note a{color:var(--lime)}

/* Body bands: full-bleed alternating surfaces sustaining hero craft to the footer */
.band{width:100%;padding:72px 0}
.band-light{background:var(--ground)}
.band-tint{background:var(--surface);border-top:1px solid var(--border)}
.band-dark{color:var(--stage-ink);background:radial-gradient(110% 90% at 85% 0%,var(--stage-2) 0%,var(--stage) 58%,#001914 100%)}
.band-dark h2,.band-dark h3{color:#f3fcf7}
.band-dark p,.band-dark li,.band-dark dd{color:var(--stage-muted)}
.band-dark a{color:var(--lime)}
.will-reveal{opacity:0;transform:translateY(14px);transition:opacity .42s var(--ease),transform .42s var(--ease)}
.will-reveal.is-in{opacity:1;transform:none}
.page-body section{padding:56px 0;border-top:1px solid var(--border);scroll-margin-top:20px}
.page-body section:first-child{border-top:0}
h1,h2,h3{color:var(--ink)}
.doc-head{padding:56px 0 36px}
.doc-head h1{font-size:clamp(34px,4.5vw,52px);line-height:1.05;font-weight:750;letter-spacing:-.04em;margin:0 0 14px}
h2{font-size:28px;line-height:1.18;font-weight:700;letter-spacing:-.03em;margin:0 0 14px}
h3{font-size:16px;line-height:1.4;font-weight:650;margin:0 0 6px}
p,li,dd{font-size:16px;line-height:1.62;max-width:65ch;color:var(--ink-2)}
p{margin:0 0 16px}
.muted{font-size:14px;color:var(--muted)}
.button{display:inline-flex;align-items:center;gap:10px;min-height:44px;padding:10px 20px;border-radius:8px;background:var(--accent);color:var(--on-accent);font-size:16px;font-weight:600;text-decoration:none;transition:filter .18s var(--ease),transform .18s var(--ease)}
.button:hover{text-decoration:none;filter:brightness(1.08);transform:translateY(-1px)}
.button svg{width:18px;height:18px;flex-shrink:0}
.command,.request{margin:12px 0 16px;padding:14px 16px;border-radius:8px;background:var(--paper);border:1px solid var(--border);color:var(--ink);font-size:14px;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere;max-width:100%}
.cmd-row{display:flex;align-items:center;gap:12px;margin:10px 0 14px;padding:8px 8px 8px 14px;border-radius:8px;background:var(--paper);border:1px solid var(--border)}
.cmd-row code{flex:1;min-width:0;font-size:14px;line-height:1.5;color:var(--ink);overflow-wrap:anywhere}
.cmd-row .copy-btn{background:var(--accent);color:var(--on-accent)}

/* Expressive interactive VA jobs & setup accordion */
.section-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px 32px;margin-bottom:28px}
.section-head p{margin:0}
.job-list{margin-top:20px;border-top:1px solid var(--border)}
.job-option{border-bottom:1px solid var(--border);transition:background-color .18s var(--ease),padding-left .18s var(--ease)}
.job-option:hover{background:var(--hover)}
.job-option[open]{background:var(--paper);border-left:3px solid var(--accent);padding-left:20px;padding-right:16px}
.job-option summary{display:flex;align-items:center;gap:14px;padding:18px 0;cursor:pointer;list-style:none;transition:color .16s var(--ease)}
.job-option summary::-webkit-details-marker{display:none}
.job-option summary::before{content:'+';display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;font-family:var(--mono);font-size:16px;font-weight:700;color:var(--accent);flex-shrink:0;transition:transform .2s var(--ease)}
.job-option[open] summary::before{transform:rotate(45deg)}
.job-title{font-size:16px;font-weight:650;color:var(--ink)}
.job-option summary:hover .job-title{color:var(--accent)}
.job-file{margin-left:auto;font-family:var(--mono);font-size:14px;color:var(--muted)}
.job-body{padding:0 0 22px 38px;max-width:65ch;animation:fade-in 180ms var(--ease)}
.job-meta{margin:10px 0 14px;padding-left:14px;border-left:2px solid var(--accent);font-family:var(--mono);font-size:14px}
.job-meta div{display:flex;gap:8px}.job-meta div+div{margin-top:4px}
.job-meta dt{margin:0;font-weight:600;color:var(--accent);flex-shrink:0}.job-meta dt::after{content:':'}
.job-meta dd{margin:0;font-size:14px;color:var(--ink-2)}
.job-body a{font-size:14px;font-weight:600}

/* Live skill filter + expressive dark-emerald directory tree */
.skill-filter{display:flex;align-items:center;gap:12px}
.skill-filter input{width:260px;max-width:100%;min-height:42px;padding:8px 14px;border-radius:8px;border:1px solid var(--stage-line);background:rgba(0,16,12,.72);color:var(--stage-ink);font-family:inherit;font-size:14px;transition:border-color .18s var(--ease)}
.skill-filter input::placeholder{color:var(--stage-muted)}
.skill-filter input:focus{border-color:var(--lime);outline:none}
.skill-filter span{font-family:var(--mono);font-size:14px;font-variant-numeric:tabular-nums;color:var(--mint);white-space:nowrap}
.skill-tree{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px;margin-top:32px}
.skill-group{--tone:var(--lime)}.skill-group:nth-child(2){--tone:var(--mint)}.skill-group:nth-child(3){--tone:#6ee7b7}.skill-group:nth-child(4){--tone:#fbbf24}.skill-group:nth-child(5){--tone:#5fe3a1}
.skill-group h3{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:14px;font-weight:600;margin-bottom:12px;color:#f3fcf7}
.skill-folder{position:relative;width:16px;height:12px;flex-shrink:0;border-radius:2px;background:var(--tone)}
.skill-folder::before{content:'';position:absolute;left:0;top:-3px;width:7px;height:4px;border-radius:2px 2px 0 0;background:var(--tone)}
.skill-title{flex:1;min-width:0}
.skill-count{flex-shrink:0;font-family:var(--mono);font-size:14px;font-variant-numeric:tabular-nums;color:var(--stage-muted)}
.skill-group ul{list-style:none;margin:0 0 0 7px;padding:0;border-left:1px solid var(--stage-line)}
.skill-group li{font-family:var(--mono);font-size:14px;line-height:1.45}
.skill-group a{position:relative;display:block;padding:6px 8px 6px 18px;color:var(--stage-ink);text-decoration:none;overflow-wrap:anywhere;border-radius:0 6px 6px 0;transition:color .16s var(--ease),background-color .16s var(--ease),transform .16s var(--ease)}
.skill-group a::before{content:'';position:absolute;left:0;top:50%;width:10px;border-top:1px solid var(--stage-line)}
.skill-group a:hover{color:var(--tone);background:rgba(255,255,255,.06);transform:translateX(3px);text-decoration:none}

/* Lists, definitions & expressive dark footer */
.steps,.file-list,.retention-list,.plain-list{padding-left:20px;margin:12px 0 16px}
.steps>li{margin-block:12px}.file-list li,.retention-list li,.plain-list li{margin-block:8px}
dt{font-weight:650;font-size:16px;color:var(--ink);margin-top:20px}dd{margin:6px 0 0}
.footer-band{width:100%;background:#001d17;color:var(--stage-muted);border-top:1px solid var(--stage-line)}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;padding:32px 0 40px;font-size:14px;color:var(--stage-muted)}
.site-footer p{margin:0;font-size:14px;color:var(--stage-muted)}.site-footer p a{color:var(--stage-ink)}.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}.site-footer a{color:var(--stage-muted);transition:color .16s var(--ease)}.site-footer a:hover{color:var(--lime)}.site-footer .theme-toggle{color:var(--stage-muted)}.site-footer .theme-toggle:hover{background:rgba(255,255,255,.08);color:var(--lime)}

/* Embedded Shopify Admin (/app) */
.app-home{background:#f6f6f7;font-size:14px;color:#18181b}.app-home a{color:#00634b}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:14px}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:14px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}

@keyframes hero-rise{from{opacity:.5;transform:translateY(10px)}to{opacity:1;transform:none}}
@keyframes fade-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}
@media(max-width:1100px){.skill-tree{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:900px){.split{grid-template-columns:1fr;gap:32px}.hero.stage{padding:116px 0 56px}}
@media(max-width:720px){.shell{width:calc(100% - 32px)}.family-header{flex-wrap:wrap;height:auto;gap:0 16px;padding:14px 0 0}.family-nav{gap:16px}.family-tabs{order:3;width:100%;height:42px;margin-top:8px}.family-tabs a{padding:0 10px}.family-tabs a:first-child{padding-left:0}.hero.stage{padding:148px 0 48px}.hero-h1{font-size:clamp(36px,10vw,52px)}.skill-tree{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px}.job-option summary{flex-direction:column;gap:4px}.job-file{margin-left:0}.app-home input{width:100%}.connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}.connection-card dd{margin-bottom:8px}}
@media(max-width:400px){.skill-tree{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.hero-inner,.wb-panel{animation:none}.hero-canvas,.hero-cta,.hero-cta svg,.button,.family-tabs a,.family-nav a,.theme-toggle,.wb-tabs label,.job-option summary,.skill-group a{transition:none}}
`;
