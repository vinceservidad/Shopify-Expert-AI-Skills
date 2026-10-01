/* Public pages share the MKT Skills family palette (https://mktskills.com/brand/family.css,
   source: vinceservidad/marketing-skills apps/web/app/globals.css). The values are copied rather
   than linked so the connector's own host still renders correctly. Green is the VA Toolkit accent;
   ground, ink, borders, type and dark mode match the parent site. Dark tokens apply only to
   public pages (html.site), never to the embedded Shopify admin app. */
export const PUBLIC_STYLES = `
:root{color-scheme:light;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:var(--ink);background:var(--ground);font-size:16px;line-height:1.6;
--ground:#fbfbfa;--paper:#fff;--ink:#18181b;--ink-2:#3f3f46;--muted:#5d5d64;--border:#e4e4e0;--hair:#ececea;--hover:#ececea;--code:#f1f1ef;--accent:#2f5bd3;--on-accent:#fff;--accent-va:#205b3e;--on-accent-va:#fff;--danger:#b42318}
:root.site.dark-mode{color-scheme:dark;--ground:#0f0f10;--paper:#1b1b1e;--ink:#ededef;--ink-2:#d4d4d8;--muted:#a1a1a8;--border:#2b2b30;--hair:#242428;--hover:#222226;--code:#232327;--accent:#8fb0ff;--on-accent:#0f0f10;--accent-va:#7cc9a0;--on-accent-va:#0f0f10;--danger:#f2a3a3}
@media(prefers-color-scheme:dark){:root.site:not(.light-mode):not(.dark-mode){color-scheme:dark;--ground:#0f0f10;--paper:#1b1b1e;--ink:#ededef;--ink-2:#d4d4d8;--muted:#a1a1a8;--border:#2b2b30;--hair:#242428;--hover:#222226;--code:#232327;--accent:#8fb0ff;--on-accent:#0f0f10;--accent-va:#7cc9a0;--on-accent-va:#0f0f10;--danger:#f2a3a3}}
*{box-sizing:border-box}body{margin:0;-webkit-font-smoothing:antialiased}a{color:var(--accent-va);text-underline-offset:4px}a:hover{text-decoration:underline}a:focus-visible,button:focus-visible,input:focus-visible,summary:focus-visible,pre:focus-visible{outline:2px solid var(--accent-va);outline-offset:3px}
.skip-link{position:absolute;left:16px;top:-80px;padding:8px 16px;background:var(--paper);color:var(--ink);z-index:20}.skip-link:focus{top:12px}
.site-header,.site-footer,.site-main{width:min(1328px,calc(100% - 80px));margin-inline:auto}
.site-header{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px 24px;min-height:70px;padding-block:12px;border-bottom:1px solid var(--border)}
.site-start{display:flex;align-items:center;flex-wrap:wrap;gap:12px 20px}
.brand{font-weight:700;color:var(--ink);text-decoration:none;font-size:26px;line-height:1.1;letter-spacing:-.045em;white-space:nowrap}.brand:hover{text-decoration:none}
.family-switch{display:inline-flex;padding:3px;border:1px solid var(--border);border-radius:8px;background:var(--paper);font-size:13px;font-weight:600}
.family-switch a{display:inline-flex;align-items:center;min-height:32px;padding:4px 12px;border-radius:5px;color:var(--muted);text-decoration:none;white-space:nowrap}
.family-switch a:hover{background:var(--hover);color:var(--accent);text-decoration:none}
.family-switch a[aria-current=page]{background:var(--accent-va);color:var(--on-accent-va)}
.site-nav{display:flex;flex-wrap:wrap;align-items:center;gap:8px 32px;font-size:14px}
.site-nav a{color:var(--ink-2);text-decoration:none}.site-nav a:hover{color:var(--ink)}
.theme-toggle{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;padding:0;border:0;border-radius:8px;background:transparent;color:var(--muted);cursor:pointer}
.theme-toggle:hover{background:var(--hover);color:var(--ink)}.theme-toggle svg{width:18px;height:18px}
.theme-toggle .icon-sun{display:none}:root.dark-mode .theme-toggle .icon-sun{display:block}:root.dark-mode .theme-toggle .icon-moon{display:none}
.site-main section{padding-block:40px 48px;border-bottom:1px solid var(--border);scroll-margin-top:24px}
.site-main .hero{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);align-items:start;gap:48px;padding-block:40px 48px}
.hero-copy{padding-top:12px}
.eyebrow{font-size:12px;line-height:1.5;font-weight:600;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin:0}
h1,h2,h3{color:var(--ink)}
h1{font-size:clamp(38px,4.3vw,56px);line-height:1.06;font-weight:700;letter-spacing:-.06em;max-width:900px;margin:26px 0 22px}
h1 span{color:var(--accent-va)}
h2{font-size:clamp(28px,3.1vw,42px);line-height:1.15;font-weight:650;letter-spacing:-.045em;margin:0 0 16px}
h3{font-size:18px;line-height:1.3;font-weight:650;letter-spacing:-.02em;margin:0 0 10px}
p{max-width:800px;margin:0 0 18px}
.lead{font-size:20px;line-height:1.55;max-width:620px;color:var(--ink-2)}
.muted{color:var(--muted);font-size:14px}
.facts{display:flex;flex-wrap:wrap;gap:8px 20px;padding:0;margin:24px 0 0;list-style:none;color:var(--muted);font-size:14px}
.facts li::before{content:"";display:inline-block;width:6px;height:6px;margin-right:8px;border-radius:50%;background:var(--accent-va);vertical-align:middle}
.actions{display:flex;flex-wrap:wrap;align-items:center;gap:16px 28px;margin:32px 0 0}
.button{display:inline-flex;align-items:center;gap:10px;min-height:52px;text-decoration:none;border:0;border-radius:7px;padding:14px 22px;font-weight:600;color:var(--accent-va);background:transparent}
.button:hover{text-decoration:none;filter:brightness(.95)}
.button.primary{background:var(--accent-va);color:var(--on-accent-va)}
.button.text{padding-inline:0}
.button svg{width:20px;height:20px;flex-shrink:0}
.job-panel{padding:22px;border:1px solid var(--border);border-radius:8px;background:var(--paper)}
.job-panel h2{font-size:22px;line-height:1.3;letter-spacing:-.025em;margin:0}
.job-panel>p{font-size:13px;color:var(--muted);margin:8px 0 16px}
.job-option{border-top:1px solid var(--border)}
.job-option summary{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:48px;padding:10px 0;font-weight:600;cursor:pointer;list-style:none}
.job-option summary::-webkit-details-marker{display:none}
.job-option summary::after{content:"+";color:var(--muted);font-weight:500;font-size:18px}
.job-option[open] summary{color:var(--accent-va)}.job-option[open] summary::after{content:"−";color:var(--accent-va)}
.job-option dl{margin:0 0 16px;padding:12px 14px;border-left:3px solid var(--accent-va);background:var(--ground);font-size:14px}
.job-option dt{font-weight:600;margin-top:10px}.job-option dt:first-child{margin-top:0}
.job-option dd{margin:2px 0 0;color:var(--ink-2)}
.job-option a{display:inline-block;margin-bottom:16px;font-size:14px;font-weight:600}
.three-columns{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:28px}.three-columns article{max-width:380px}
.three-columns p{color:var(--ink-2);font-size:15px}
.step{display:block;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:14px;font-weight:600;color:var(--accent-va);margin-bottom:12px}
.job-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-block:28px}
.job-card{display:flex;flex-direction:column;padding:24px;background:var(--paper);border:1px solid var(--border);border-radius:8px}
.job-card p{font-size:15px;color:var(--ink-2)}.job-card .muted{font-size:14px;color:var(--muted)}.job-card a{margin-top:auto;font-size:14px;font-weight:600}
.steps>li{margin-block:16px}.file-list{padding-left:20px;margin-top:12px}.file-list li{margin-block:8px}
.request{background:var(--ground);color:var(--ink);border:1px solid var(--border);border-radius:6px;padding:16px;white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.65;max-width:100%}
.callout{padding:32px!important;margin-block:24px;border:1px solid var(--border)!important;border-radius:8px;background:var(--paper)}
.page-intro h1{font-size:clamp(34px,4.6vw,52px)}
dt{font-weight:650;margin-top:20px}dd{margin:6px 0 0;max-width:780px}
.site-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:16px 24px;padding-block:24px 36px;font-size:13px;color:var(--muted)}
.site-footer p{margin:0}.site-footer nav{display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px}
code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;overflow-wrap:anywhere}
.app-home{background:#f6f6f7;font-size:14px}.app-home main{margin:0 auto;max-width:1100px}.app-home p{margin-block:8px}.app-home label{display:block;font-weight:600;margin-top:16px}.app-home input{display:block;max-width:100%;width:420px;font:inherit;line-height:1.5;padding:10px 12px;background:#fff;border:1px solid #8a8a8a;border-radius:8px}.app-home .actions{margin-block:16px}.workflow{border-bottom:1px solid #ddd;padding-block:14px}.workflow summary{cursor:pointer;font-weight:650}.workflow[open] summary{margin-bottom:12px}.workflow li{margin-block:8px}.evidence-result{overflow-x:auto}.evidence-result table{width:100%;border-collapse:collapse;background:#fff;margin:16px 0}.evidence-result th,.evidence-result td{text-align:left;vertical-align:top;padding:12px;border-bottom:1px solid #ddd;overflow-wrap:anywhere}.evidence-result th{font-weight:650;background:#f1f2f1}.evidence-result td s-button{display:inline-block;margin:4px}.evidence-meta{font-size:.88rem;color:#4b5650}.connection-card{padding-block:16px;border-bottom:1px solid #ddd}.connection-card dl,.app-home #pairing-facts{display:grid;grid-template-columns:minmax(110px,180px) 1fr;gap:8px 16px}.connection-card dt,.connection-card dd,.app-home #pairing-facts dt,.app-home #pairing-facts dd{margin:0}.connection-card dd{overflow-wrap:anywhere}.error-text{color:#a82121;font-weight:550}.success-text{color:#216546;font-weight:550}[hidden]{display:none!important}
.app-home{color:#18181b}.app-home a{color:#185e43}
@media(max-width:900px){.site-header,.site-footer,.site-main{width:calc(100% - 56px)}.site-main .hero{grid-template-columns:1fr;gap:36px}.job-panel{max-width:620px}.three-columns,.job-grid{grid-template-columns:1fr}.three-columns article{max-width:none}}
@media(max-width:700px){.site-main section{padding-block:32px}.request{padding:16px}.callout{padding:24px!important}.app-home input{width:100%}.connection-card dl,.app-home #pairing-facts{grid-template-columns:1fr;gap:4px}.connection-card dd{margin-bottom:8px}}
@media(max-width:480px){.site-header,.site-footer,.site-main{width:calc(100% - 40px)}.brand{font-size:24px}.family-switch a{padding:4px 10px}.site-nav{gap:8px 18px;font-size:13px}h1{font-size:clamp(30px,8.6vw,40px);letter-spacing:-.045em;line-height:1.12;margin-top:20px}.lead{font-size:17px}.actions{gap:16px}.button{font-size:14px}.job-panel{padding:20px}h2{font-size:30px}}
`;
