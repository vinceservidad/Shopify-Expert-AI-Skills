/* Public pages share the MKT Skills family header dimensions with mktskills.com so switching
   products never shifts navigation. Strict design rules:
   - Fonts: 2 families (system sans + system mono), 3 body sizes (14px, 16px, 18px), all >= 13px.
   - Palette: Shopify commerce emerald + cool slate/white (no beige, no purple).
   - Anti-slop: no pill badges, no eyebrow kickers, no nested cards. */
export const PUBLIC_STYLES = `
:root{color-scheme:light;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:var(--ground);font-size:16px;line-height:1.6;--mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
--ground:#f7f9f8;--paper:#ffffff;--ink:#0f1714;--ink-2:#33413b;--on-ink:#ffffff;--muted:#52635c;--border:#dbe3df;--hair:#e6ece9;--hover:#edf3f0;--code:#eef3f1;--accent:#006e52;--on-accent:#ffffff;--accent-va:#008060;--on-accent-va:#ffffff;--danger:#b42318;--syn-key:#008060;--syn-str:#0f766e;--syn-flag:#b45309;--syn-tag:#047857;--stage:#002e25;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.2);--lime:#b9eb6a;--on-lime:#04241c;--mint:#8ee0b8;}
:root.site.dark-mode{color-scheme:dark;--ground:#090e0c;--paper:#101815;--ink:#eef4f1;--ink-2:#c6d3cd;--on-ink:#090e0c;--muted:#8fa39a;--border:#203029;--hair:#182520;--hover:#16221d;--code:#15201b;--accent:#34d399;--on-accent:#041a13;--accent-va:#5fe3a1;--on-accent-va:#041a13;--danger:#f2a3a3;--syn-key:#5fe3a1;--syn-str:#6ee7b7;--syn-flag:#f59e0b;--syn-tag:#34d399;--stage:#041a15;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.18);--lime:#b9eb6a;--on-lime:#04241c;--mint:#8ee0b8;}
@media(prefers-color-scheme:dark){:root.site:not(.light-mode):not(.dark-mode){color-scheme:dark;--ground:#090e0c;--paper:#101815;--ink:#eef4f1;--ink-2:#c6d3cd;--on-ink:#090e0c;--muted:#8fa39a;--border:#203029;--hair:#182520;--hover:#16221d;--code:#15201b;--accent:#34d399;--on-accent:#041a13;--accent-va:#5fe3a1;--on-accent-va:#041a13;--danger:#f2a3a3;--syn-key:#5fe3a1;--syn-str:#6ee7b7;--syn-flag:#f59e0b;--syn-tag:#34d399;--stage:#041a15;--stage-ink:#edf7f2;--stage-muted:rgba(237,247,242,.78);--stage-line:rgba(142,224,184,.18);--lime:#b9eb6a;--on-lime:#04241c;--mint:#8ee0b8;}}
*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}a{color:var(--accent-va);text-underline-offset:4px}a:hover{text-decoration:underline}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent-va);outline-offset:4px}
code,pre{font-family:var(--mono)}code{overflow-wrap:anywhere;font-size:inherit}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--paper);color:var(--ink);font-size:14px;z-index:20}.skip-link:focus{top:12px}
.shell{width:min(1200px,calc(100% - 48px));margin-inline:auto}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px;border-bottom:1px solid var(--border)}
.brand{font-size:16px;line-height:1;font-weight:700;letter-spacing:-.02em;color:var(--ink);text-decoration:none;white-space:nowrap}.brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--mono);font-size:14px}
.family-tabs a{display:flex;align-items:center;padding:0 12px;color:var(--muted);text-decoration:none;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.family-tabs a:hover{color:var(--accent-va);background:var(--hover);text-decoration:none}
.family-tabs a[aria-current=page]{color:var(--ink);border-bottom-color:var(--accent-va)}.family-tabs a[aria-current=page]:hover{color:var(--ink)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-size:14px}
.family-nav a{color:var(--ink-2);text-decoration:none;white-space:nowrap}.family-nav a:hover{color:var(--ink)}
.theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--muted);cursor:pointer}
.theme-toggle:hover{background:var(--hover);color:var(--ink)}.theme-toggle svg{width:18px;height:18px}
.theme-toggle .icon-sun{display:none}:root.dark-mode .theme-toggle .icon-sun{display:block}:root.dark-mode .theme-toggle .icon-moon{display:none}
.site-main section{padding:48px 0 56px;border-top:1px solid var(--border);scroll-margin-top:16px}
.site-main section:first-child{border-top:0}
.site-main .hero.stage{position:relative;isolation:isolate;overflow:hidden;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:48px;margin-top:24px;padding:52px 48px 56px;border-radius:16px;color:var(--stage-ink);background:radial-gradient(110% 90% at 10% 8%,#00523e 0%,var(--stage) 56%,#001d17 100%);border:1px solid var(--stage-line)}
.hero-canvas{position:absolute;inset:0;z-index:-1;width:100%;height:100%;display:block;opacity:0;transition:opacity .9s ease}.hero-canvas.is-live{opacity:1}
.hero-copy{min-width:0;animation:hero-entrance 240ms ease-out}
.hero-title{display:flex;align-items:center;gap:14px;margin:0 0 16px}
.mark{width:34px;height:34px;flex-shrink:0;color:var(--lime)}.mark-hole{fill:var(--stage)}.mark-check{fill:none;stroke:var(--stage);stroke-width:2.6;stroke-linecap:round;stroke-linejoin:round}
h1,h2,h3{color:var(--ink)}
h1{font-size:clamp(34px,4.4vw,52px);line-height:1.06;font-weight:700;letter-spacing:-.04em;margin:0}
h2{font-size:clamp(26px,2.8vw,34px);line-height:1.15;font-weight:650;letter-spacing:-.03em;margin:0 0 12px}
h3{font-size:18px;line-height:1.3;font-weight:650;letter-spacing:-.015em;margin:0 0 8px}
p{max-width:780px;margin:0 0 16px;font-size:16px}
.lead,.intro{font-size:18px;line-height:1.58;max-width:640px;color:var(--ink-2)}
.muted{color:var(--muted);font-size:14px}
.stage h1{color:#f2fbf6}.stage .h1-accent{color:var(--lime)}.stage .lead{color:var(--stage-muted)}.stage .facts{color:var(--stage-muted)}
.hero-commands{margin-top:24px;padding:16px 0 0;border-top:1px solid var(--stage-line)}
.hero-commands pre{margin:0;padding:0;font-size:14px;line-height:1.7;color:var(--stage-ink);white-space:pre-wrap;overflow-wrap:anywhere}
.hero-commands .t-dir{color:var(--lime)}.hero-commands .t-file{color:var(--stage-ink)}.hero-commands .t-glyph{color:var(--mint)}
.hero-commands .t-line{display:block;animation:term-show .2s both}
.hero-commands .t-line:nth-child(2){animation-delay:.12s}.hero-commands .t-line:nth-child(3){animation-delay:.24s}.hero-commands .t-line:nth-child(4){animation-delay:.36s}.hero-commands .t-line:nth-child(5){animation-delay:.48s}.hero-commands .t-line:nth-child(6){animation-delay:.6s}
@keyframes term-show{from{opacity:0}to{opacity:1}}
.facts{margin:20px 0 0;font-family:var(--mono);font-size:14px;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px;margin:24px 0 0}
.button{display:inline-flex;align-items:center;gap:10px;min-height:44px;text-decoration:none;border:0;border-radius:8px;padding:10px 18px;font-size:16px;font-weight:600;color:var(--ink);background:transparent}
.button:hover{text-decoration:none}
.button.primary{background:var(--accent-va);color:var(--on-accent-va)}.button.primary:hover{filter:brightness(1.08)}
.stage .button.primary{background:var(--lime);color:var(--on-lime)}.stage .button.primary:hover{filter:brightness(1.05)}
.stage .button.text{color:var(--stage-ink)}
.button svg{width:18px;height:18px;flex-shrink:0;transition:transform .15s ease}.button:hover svg{transform:translateX(3px)}
.button.text{padding-inline:0}
.job-panel{min-width:0;border-top:1px solid var(--stage-line)}
.editor-bar{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:12px 0;border-bottom:1px solid var(--stage-line)}
.editor-bar h2{font-size:16px;font-weight:650;letter-spacing:0;margin:0;color:var(--stage-ink)}
.editor-bar p{margin:0;font-family:var(--mono);font-size:14px;color:var(--stage-muted)}
.job-option{border-bottom:1px solid var(--stage-line)}
.job-option summary{display:flex;align-items:center;gap:12px;min-height:48px;padding:10px 0;cursor:pointer;list-style:none}
.job-option summary::-webkit-details-marker{display:none}
.job-option summary:hover{color:var(--lime)}
.job-file{font-family:var(--mono);font-size:14px;color:var(--mint);min-width:0;overflow-wrap:anywhere}
.job-title{margin-left:auto;font-size:16px;font-weight:600;text-align:right;color:var(--stage-ink)}
.job-body{padding:4px 0 16px}
.job-meta{margin:8px 0 12px;padding:0 0 0 12px;border-left:2px solid var(--mint);font-family:var(--mono);font-size:14px}
.job-meta div{display:flex;gap:8px}.job-meta div+div{margin-top:4px}
.job-meta dt{margin:0;font-weight:600;color:var(--mint);flex-shrink:0}.job-meta dt::after{content:':'}
.job-meta dd{margin:0;color:var(--stage-ink)}
.job-body p{font-size:14px;color:var(--stage-muted);margin-bottom:10px}
.job-body a{font-size:14px;font-weight:600;color:var(--lime)}
.skill-tree{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px;margin-top:28px}
.skill-group{--tone:var(--accent-va)}.skill-group:nth-child(2){--tone:var(--syn-str)}.skill-group:nth-child(3){--tone:var(--syn-tag)}.skill-group:nth-child(4){--tone:var(--syn-flag)}.skill-group:nth-child(5){--tone:var(--accent)}
.skill-group h3{display:flex;align-items:center;gap:8px;font-family:var(--mono);font-size:14px;font-weight:600;letter-spacing:0;margin-bottom:10px}
.skill-folder{position:relative;width:16px;height:12px;flex-shrink:0;border-radius:2px;background:var(--tone)}
.skill-folder::before{content:'';position:absolute;left:0;top:-3px;width:7px;height:4px;border-radius:2px 2px 0 0;background:var(--tone)}
.skill-title{flex:1;min-width:0}
.skill-count{flex-shrink:0;font-family:var(--mono);font-size:14px;font-weight:500;color:var(--muted)}
.skill-group ul{list-style:none;margin:0 0 0 7px;padding:0;border-left:1px solid color-mix(in srgb,var(--tone) 45%,var(--border))}
.skill-group li{font-family:var(--mono);font-size:14px;line-height:1.45}
.skill-group a{position:relative;display:block;padding:5px 8px 5px 18px;color:var(--ink-2);text-decoration:none;overflow-wrap:anywhere;transition:color .12s,background-color .12s}
.skill-group a::before{content:'';position:absolute;left:0;top:50%;width:10px;border-top:1px solid color-mix(in srgb,var(--tone) 45%,var(--border))}
.skill-group a:hover{color:var(--tone);background:var(--hover);text-decoration:none}
.three-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:24px}.three-columns article{max-width:380px}
.three-columns p{color:var(--ink-2);font-size:16px}
.step{display:block;font-family:var(--mono);font-size:14px;color:var(--accent-va);margin-bottom:8px}
.install-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px 36px;margin-block:28px}
.install-item{display:flex;flex-direction:column;gap:12px;padding-top:20px;border-top:1px solid var(--border);min-width:0}
.install-item h3{margin:0}
.install-item p{margin:0;font-size:16px;color:var(--ink-2)}
.install-item .muted{font-size:14px;color:var(--muted)}
.install-item .actions{margin-top:auto;padding-top:4px;gap:12px 16px}
.command{margin:0;background:var(--paper);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:12px 14px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.55;max-width:100%}
.mcp-url{margin:12px 0 16px;max-width:680px}
.mcp-band{border-left:3px solid var(--accent-va);padding-left:24px}
.card-steps{margin:0;padding-left:20px;font-size:16px;color:var(--ink-2)}
.card-steps li+li{margin-top:8px}
.job-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 36px;margin-block:28px}
.job-item{display:flex;flex-direction:column;padding-top:18px;border-top:1px solid var(--border)}
.job-item p{font-size:16px;color:var(--ink-2);margin-bottom:10px}.job-item .muted{font-size:14px;color:var(--muted)}.job-item a{margin-top:auto;font-size:14px;font-weight:600}
.steps>li{margin-block:14px;font-size:16px}.file-list{padding-left:20px;margin-top:10px}.file-list li{margin-block:6px;font-size:16px}
.retention-list{padding-left:20px;margin:12px 0 16px}.retention-list li+li{margin-top:6px;font-size:16px}
.request{background:var(--paper);color:var(--ink);border:1px solid var(--border);border-radius:8px;padding:14px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:14px;line-height:1.6;max-width:100%}
.page-intro h1{font-size:clamp(32px,4vw,46px);margin-bottom:12px}
dt{font-weight:650;font-size:16px;margin-top:20px}dd{margin:6px 0 0;max-width:780px;font-size:16px}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;padding:24px 0 36px;border-top:1px solid var(--border);font-size:14px;color:var(--muted)}
.site-footer p{margin:0;font-size:14px}.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}.site-footer a{color:var(--ink-2)}
@keyframes hero-entrance{from{opacity:.5;transform:translateY(8px)}to{opacity:1;transform:none}}
.app-home{background:#f6f6f7;font-size:14px}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px;font-size:14px}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:14px;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}
.app-home{color:#18181b}.app-home a{color:#006e52}
@media(max-width:1100px){.skill-tree{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:900px){.site-main .hero.stage{grid-template-columns:minmax(0,1fr);gap:36px;padding:36px 28px 44px}.three-columns,.job-grid,.install-grid{grid-template-columns:1fr}.three-columns article{max-width:none}}
@media(max-width:720px){.shell{width:calc(100% - 32px)}.family-header{flex-wrap:wrap;height:auto;gap:0 16px;padding-top:14px}.family-nav{gap:16px;font-size:14px}.family-tabs{order:3;width:100%;height:44px;margin-top:10px}.family-tabs a{padding:0 10px}.family-tabs a:first-child{padding-left:0}.site-main .hero.stage{margin-top:16px;padding:28px 20px 32px;border-radius:12px}.skill-tree{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px}.mcp-band{padding-left:16px}.app-home input{width:100%}.connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}.connection-card dd{margin-bottom:8px}.job-title{text-align:left;margin-left:0}.job-option summary{flex-direction:column;align-items:flex-start;gap:2px}}
@media(max-width:400px){.skill-tree{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.hero-copy,.hero-commands .t-line{animation:none}.hero-canvas,.button svg,.skill-group a{transition:none}}
`;
