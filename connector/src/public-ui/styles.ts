/* Public pages share the MKT Skills family shell with mktskills.com: the container, header, tabs,
   nav and breakpoints use the same numbers as marketing-skills apps/web/app/connect/setup.css, so
   switching products never moves the header. Change both together. Green is the VA accent. Dark
   tokens apply only to public pages (html.site), never to the embedded Shopify admin app. */
export const PUBLIC_STYLES = `
:root{color-scheme:light;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:var(--ground);font-size:16px;line-height:1.6;--mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;
--ground:#fbfbfa;--paper:#fff;--ink:#18181b;--ink-2:#3f3f46;--on-ink:#fff;--muted:#5d5d64;--border:#e4e4e0;--hair:#ececea;--hover:#ececea;--code:#f1f1ef;--accent:#2f5bd3;--on-accent:#fff;--accent-va:#205b3e;--on-accent-va:#fff;--danger:#b42318}
:root.site.dark-mode{color-scheme:dark;--ground:#0f0f10;--paper:#1b1b1e;--ink:#ededef;--ink-2:#d4d4d8;--on-ink:#111113;--muted:#a1a1a8;--border:#2b2b30;--hair:#242428;--hover:#222226;--code:#232327;--accent:#8fb0ff;--on-accent:#0f0f10;--accent-va:#7cc9a0;--on-accent-va:#0f0f10;--danger:#f2a3a3}
@media(prefers-color-scheme:dark){:root.site:not(.light-mode):not(.dark-mode){color-scheme:dark;--ground:#0f0f10;--paper:#1b1b1e;--ink:#ededef;--ink-2:#d4d4d8;--on-ink:#111113;--muted:#a1a1a8;--border:#2b2b30;--hair:#242428;--hover:#222226;--code:#232327;--accent:#8fb0ff;--on-accent:#0f0f10;--accent-va:#7cc9a0;--on-accent-va:#0f0f10;--danger:#f2a3a3}}
*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}a{color:var(--accent-va);text-underline-offset:4px}a:hover{text-decoration:underline}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent-va);outline-offset:4px}
code,pre{font-family:var(--mono)}code{overflow-wrap:anywhere;font-size:.92em}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--paper);color:var(--ink);z-index:20}.skip-link:focus{top:12px}
.shell{width:min(1200px,calc(100% - 48px));margin-inline:auto}
.family-header{display:flex;align-items:center;gap:20px;height:64px;line-height:20px;border-bottom:1px solid var(--border)}
.brand{font-size:17px;line-height:1;font-weight:650;letter-spacing:-.02em;color:var(--ink);text-decoration:none;white-space:nowrap}.brand:hover{text-decoration:none}
.family-tabs{display:flex;align-self:stretch;align-items:stretch;gap:2px;font-family:var(--mono);font-size:13px}
.family-tabs a{display:flex;align-items:center;padding:0 12px;color:var(--muted);text-decoration:none;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap}
.family-tabs a:hover{color:var(--accent);background:var(--hover);text-decoration:none}
.family-tabs a[aria-current=page]{color:var(--ink);border-bottom-color:var(--accent-va)}.family-tabs a[aria-current=page]:hover{color:var(--ink)}
.family-nav{display:flex;align-items:center;gap:24px;margin-left:auto;font-size:14px}
.family-nav a{color:var(--ink-2);text-decoration:none;white-space:nowrap}.family-nav a:hover{color:var(--ink)}
.theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--muted);cursor:pointer}
.theme-toggle:hover{background:var(--hover);color:var(--ink)}.theme-toggle svg{width:18px;height:18px}
.theme-toggle .icon-sun{display:none}:root.dark-mode .theme-toggle .icon-sun{display:block}:root.dark-mode .theme-toggle .icon-moon{display:none}
.site-main section{padding:48px 0 56px;border-top:1px solid var(--border);scroll-margin-top:16px}
.site-main section:first-child{border-top:0}
.site-main .hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:start;gap:56px;padding:56px 0 64px}
.hero-copy{min-width:0;animation:hero-entrance 240ms ease-out}
.eyebrow{font-family:var(--mono);font-size:12px;line-height:1.5;color:var(--muted);margin:0}
h1,h2,h3{color:var(--ink)}
h1{font-size:clamp(36px,4.6vw,56px);line-height:1.04;font-weight:700;letter-spacing:-.045em;margin:16px 0 18px}
h2{font-size:clamp(26px,3vw,36px);line-height:1.15;font-weight:650;letter-spacing:-.035em;margin:10px 0 12px}
h3{font-size:17px;line-height:1.3;font-weight:650;letter-spacing:-.015em;margin:0 0 8px}
p{max-width:800px;margin:0 0 16px}
.lead{font-size:18px;line-height:1.6;max-width:560px;color:var(--ink-2)}
.intro{font-size:17px;max-width:680px;color:var(--ink-2)}
.muted{color:var(--muted);font-size:14px}
.hero-files{margin-top:28px;border:1px solid var(--border);border-radius:8px;background:var(--paper);overflow:hidden}
.hero-files-label{display:flex;justify-content:space-between;gap:12px;margin:0;padding:8px 14px;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:12px;color:var(--muted)}
.hero-files pre{margin:0;padding:14px;font-size:13px;line-height:1.6;color:var(--ink-2);white-space:pre;overflow-x:auto}
.facts{margin:20px 0 0;font-family:var(--mono);font-size:12px;color:var(--muted)}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px;margin:24px 0 0}
.button{display:inline-flex;align-items:center;gap:10px;min-height:44px;text-decoration:none;border:0;border-radius:6px;padding:10px 18px;font-size:15px;font-weight:600;color:var(--ink);background:transparent}
.button:hover{text-decoration:none}
.button.primary{background:var(--ink);color:var(--on-ink)}.button.primary:hover{background:var(--ink-2)}
.button.text{padding-inline:0}
.button svg{width:18px;height:18px;flex-shrink:0}
.job-panel{border:1px solid var(--border);border-radius:8px;background:var(--paper);overflow:hidden}
.editor-bar{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border)}
.editor-bar h2{font-size:14px;font-weight:600;letter-spacing:0;margin:0}
.editor-bar p{margin:0;font-family:var(--mono);font-size:12px;color:var(--muted)}
.job-option+.job-option{border-top:1px solid var(--border)}
.job-option summary{display:flex;align-items:center;gap:12px;min-height:48px;padding:10px 16px;cursor:pointer;list-style:none}
.job-option summary::-webkit-details-marker{display:none}
.job-option summary:hover{background:var(--hover)}
.job-file{font-family:var(--mono);font-size:12px;color:var(--muted);min-width:0;overflow-wrap:anywhere}
.job-title{margin-left:auto;font-size:14px;font-weight:600;text-align:right}
.job-option[open] summary{background:var(--ground);box-shadow:inset 2px 0 0 var(--accent-va)}
.job-option[open] .job-file{color:var(--ink)}
.job-body{padding:4px 16px 16px}
.job-meta{margin:12px 0;padding:10px 12px;border-left:2px solid var(--border);background:var(--ground);font-family:var(--mono);font-size:12px}
.job-meta div{display:flex;gap:8px}.job-meta div+div{margin-top:4px}
.job-meta dt{margin:0;font-weight:400;color:var(--muted);flex-shrink:0}.job-meta dt::after{content:':'}
.job-meta dd{margin:0;color:var(--ink)}
.job-body p{font-size:14px;color:var(--ink-2)}
.job-body a{font-size:14px;font-weight:600}
.skill-tree{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:28px;margin-top:32px}
.skill-group h3{font-family:var(--mono);font-size:13px;font-weight:600;letter-spacing:0;margin-bottom:10px}
.skill-group h3 span{color:var(--muted)}
.skill-group ul{list-style:none;margin:0;padding:0;border-left:1px solid var(--border)}
.skill-group li{font-family:var(--mono);font-size:13px;line-height:1.4}
.skill-group a{display:block;padding:5px 0 5px 12px;color:var(--ink-2);text-decoration:none;overflow-wrap:anywhere}
.skill-group a:hover{color:var(--accent-va);background:var(--hover);text-decoration:none}
.three-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:28px}.three-columns article{max-width:380px}
.three-columns p{color:var(--ink-2);font-size:15px}
.step{display:block;font-family:var(--mono);font-size:13px;color:var(--accent-va);margin-bottom:10px}
.job-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-block:28px}
.job-card{display:flex;flex-direction:column;padding:20px;background:var(--paper);border:1px solid var(--border);border-radius:8px}
.job-card p{font-size:15px;color:var(--ink-2)}.job-card .muted{font-size:13px;color:var(--muted)}.job-card a{margin-top:auto;font-size:14px;font-weight:600}
.steps>li{margin-block:16px}.file-list{padding-left:20px;margin-top:12px}.file-list li{margin-block:8px}
.request{background:var(--ground);color:var(--ink);border:1px solid var(--border);border-radius:6px;padding:14px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65;max-width:100%}
.callout{padding:32px!important;margin-block:24px;border:1px solid var(--border)!important;border-radius:8px;background:var(--paper)}
.page-intro h1{font-size:clamp(32px,4vw,48px)}
dt{font-weight:650;margin-top:20px}dd{margin:6px 0 0;max-width:780px}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;padding:24px 0 36px;border-top:1px solid var(--border);font-size:13px;color:var(--muted)}
.site-footer p{margin:0}.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}.site-footer a{color:var(--ink-2)}
@keyframes hero-entrance{from{opacity:.5;transform:translateY(8px)}to{opacity:1;transform:none}}
.app-home{background:#f6f6f7;font-size:14px}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:.88rem;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}
.app-home{color:#18181b}.app-home a{color:#185e43}
@media(max-width:1100px){.skill-tree{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:900px){.site-main .hero{grid-template-columns:minmax(0,1fr);gap:40px;padding:40px 0 48px}.job-panel{max-width:640px}.three-columns,.job-grid{grid-template-columns:1fr}.three-columns article{max-width:none}}
@media(max-width:720px){.shell{width:calc(100% - 32px)}.family-header{flex-wrap:wrap;height:auto;gap:0 16px;padding-top:14px}.family-nav{gap:16px;font-size:13px}.family-tabs{order:3;width:100%;height:44px;margin-top:10px}.family-tabs a{padding:0 10px}.family-tabs a:first-child{padding-left:0}.skill-tree{grid-template-columns:repeat(2,minmax(0,1fr));gap:24px 16px}.lead{font-size:17px}.callout{padding:24px!important}.app-home input{width:100%}.connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}.connection-card dd{margin-bottom:8px}.job-title{text-align:left;margin-left:0}.job-option summary{flex-direction:column;align-items:flex-start;gap:2px}}
@media(max-width:400px){.skill-tree{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.hero-copy{animation:none}}
`;
