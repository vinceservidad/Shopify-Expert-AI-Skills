import report from "./report.js";

const escape = (value) => String(value).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export default {
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/report.json") {
      return Response.json(report, { headers: { "cache-control": "no-store" } });
    }
    const rows = report.stages
      .map((s) => `<tr><td>${escape(s.stage)}</td><td>${escape(s.status)}</td><td>${escape(s.detail)}</td></tr>`)
      .join("");
    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>ShopifySkills CI</title>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:2rem auto;max-width:44rem;padding:0 1rem}
table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid #ddd;padding:.4rem;text-align:left}</style></head>
<body><h1>ShopifySkills CI: ${report.passed ? "passed" : "failed"}</h1>
<p>Commit <code>${escape(report.commit)}</code> on <code>${escape(report.branch)}</code>, finished ${escape(report.finished_at)}.</p>
<table><thead><tr><th>Stage</th><th>Status</th><th>Detail</th></tr></thead><tbody>${rows}</tbody></table>
<p><a href="/report.json">report.json</a></p></body></html>`;
    return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
  },
};
