/**
 * A small Markdown renderer for the subset the skill library uses: ATX headings, paragraphs, bullet, ordered and
 * nested lists, fenced code, block quotes, rules, GFM tables, inline code, bold, emphasis, links and autolinks.
 *
 * Safety: every piece of source text is HTML-escaped before it is placed in markup, and raw HTML is never passed
 * through (a "<div>" in a skill file renders as the text "<div>"). Link targets go through `resolveLink`; anything
 * it does not return, and anything that is not http(s), mailto, an on-site path or a fragment, is rendered as plain text.
 */
export type MarkdownOptions = {
  /** Map a link target from the source to the href to use, or undefined to render the link text only. */
  resolveLink?: (href: string) => string | undefined;
  /** Drop the first level-1 heading (the page supplies its own h1). */
  dropTitle?: boolean;
  /** The level the body's top headings render at (default 2, under the page h1). Levels never skip. */
  baseLevel?: number;
};

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));

const SAFE_HREF = /^(?:https?:\/\/[^\s"'<>`]+|mailto:[^\s"'<>`]+|\/(?!\/)[^\s"'<>`]*|#[^\s"'<>`]*)$/i;

function safeHref(href: string | undefined): string | undefined {
  return href && SAFE_HREF.test(href) ? href : undefined;
}

/** Plain text of an inline Markdown run (for ids, titles and meta descriptions). */
export function inlineText(source: string): string {
  return source
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<(https?:\/\/[^\s<>]+)>/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, '$1$2')
    .replace(/\\([\\`*_{}[\]()#+\-.!|>])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function findClosingBracket(text: string, open: number): number {
  let depth = 0;
  for (let i = open; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\\') { i++; continue; }
    if (ch === '`') { const end = text.indexOf('`', i + 1); if (end > 0) { i = end; continue; } }
    if (ch === '[') depth++;
    else if (ch === ']' && --depth === 0) return i;
  }
  return -1;
}

function renderInline(text: string, options: MarkdownOptions): string {
  let out = '';
  for (let i = 0; i < text.length;) {
    const ch = text[i]!, rest = text.slice(i);
    if (ch === '\\' && i + 1 < text.length && /[\\`*_{}[\]()#+\-.!|>]/.test(text[i + 1]!)) { out += escapeHtml(text[i + 1]!); i += 2; continue; }
    if (ch === '`') {
      const run = /^`+/.exec(rest)![0], end = text.indexOf(run, i + run.length);
      if (end > 0) { out += `<code>${escapeHtml(text.slice(i + run.length, end).replace(/\n/g, ' ').trim())}</code>`; i = end + run.length; continue; }
      out += escapeHtml(run); i += run.length; continue;
    }
    if (ch === '[') {
      const close = findClosingBracket(text, i);
      const target = close > 0 ? /^\(\s*<?([^\s)<>]*)>?(?:\s+"[^"]*")?\s*\)/.exec(text.slice(close + 1)) : null;
      if (close > 0 && target) {
        const label = renderInline(text.slice(i + 1, close), options);
        const href = safeHref(options.resolveLink ? options.resolveLink(target[1]!) : target[1]);
        out += href ? `<a href="${escapeHtml(href)}">${label}</a>` : label;
        i = close + 1 + target[0].length; continue;
      }
    }
    if (ch === '<') {
      const auto = /^<((?:https?:\/\/|mailto:)[^\s<>]+)>/.exec(rest);
      if (auto) {
        const href = safeHref(options.resolveLink ? options.resolveLink(auto[1]!) : auto[1]);
        out += href ? `<a href="${escapeHtml(href)}">${escapeHtml(auto[1]!)}</a>` : escapeHtml(auto[1]!);
        i += auto[0].length; continue;
      }
    }
    if (ch === 'h' && (i === 0 || /[\s(]/.test(text[i - 1]!))) {
      const bare = /^https?:\/\/[^\s<>]+/.exec(rest);
      if (bare) {
        const url = bare[0].replace(/[.,;:!?)\]*]+$/, '');
        const href = safeHref(url);
        out += href ? `<a href="${escapeHtml(href)}">${escapeHtml(url)}</a>` : escapeHtml(url);
        i += url.length; continue;
      }
    }
    if (rest.startsWith('**')) {
      const end = text.indexOf('**', i + 2);
      if (end > i + 2) { out += `<strong>${renderInline(text.slice(i + 2, end), options)}</strong>`; i = end + 2; continue; }
    }
    if (ch === '*' && /^\*[^*\s]/.test(rest) && (i === 0 || !/\w/.test(text[i - 1]!))) {
      const end = /^\*([^*]*?[^*\s])\*(?![\w*])/.exec(rest);
      if (end) { out += `<em>${renderInline(end[1]!, options)}</em>`; i += end[0].length; continue; }
    }
    out += escapeHtml(ch); i++;
  }
  return out;
}

const FENCE = /^(\s*)(`{3,}|~{3,})\s*([\w+-]*)/;
const HEADING = /^(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^\s{0,3}(?:-\s*){3,}$|^\s{0,3}(?:\*\s*){3,}$|^\s{0,3}(?:_\s*){3,}$/;
const LIST_ITEM = /^(\s*)([-*+]|\d{1,9}[.)])\s+(.*)$/;
const TABLE_RULE = /^\s*\|?\s*:?-{1,}:?\s*(?:\|\s*:?-{1,}:?\s*)+\|?\s*$/;

const indentOf = (line: string) => /^\s*/.exec(line)![0].replace(/\t/g, '    ').length;
const isBlank = (line: string) => line.trim() === '';

function splitRow(line: string): string[] {
  let row = line.trim();
  if (row.startsWith('|')) row = row.slice(1);
  if (row.endsWith('|') && !row.endsWith('\\|')) row = row.slice(0, -1);
  const cells: string[] = [];
  let cell = '', code = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i]!;
    if (ch === '\\' && row[i + 1] === '|') { cell += '|'; i++; continue; }
    if (ch === '`') code = !code;
    if (ch === '|' && !code) { cells.push(cell.trim()); cell = ''; continue; }
    cell += ch;
  }
  cells.push(cell.trim());
  return cells;
}

type Context = { options: MarkdownOptions; ids: Map<string, number>; lastLevel: number; base: number; titleDropped: boolean };

function headingId(text: string, context: Context): string {
  const base = inlineText(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'section';
  const seen = context.ids.get(base) ?? 0;
  context.ids.set(base, seen + 1);
  return seen ? `${base}-${seen + 1}` : base;
}

function startsBlock(line: string): boolean {
  return FENCE.test(line) || HEADING.test(line) || RULE.test(line) || LIST_ITEM.test(line) || /^\s*>/.test(line);
}

function renderBlocks(lines: string[], context: Context): string {
  const out: string[] = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i]!;
    if (isBlank(line)) { i++; continue; }

    const fence = FENCE.exec(line);
    if (fence) {
      const indent = fence[1]!.length, marker = fence[2]!, body: string[] = [];
      let j = i + 1;
      for (; j < lines.length; j++) {
        const close = lines[j]!.trim();
        if (close.startsWith(marker[0]!.repeat(marker.length)) && /^[`~]+$/.test(close)) break;
        body.push(lines[j]!.slice(Math.min(indent, indentOf(lines[j]!))));
      }
      const language = fence[3] ? ` data-lang="${escapeHtml(fence[3])}"` : '';
      out.push(`<pre class="md-code" tabindex="0"${language}><code>${escapeHtml(body.join('\n'))}</code></pre>`);
      i = j + 1; continue;
    }

    const heading = HEADING.exec(line);
    if (heading) {
      const source = heading[1]!.length;
      i++;
      if (source === 1 && context.options.dropTitle && !context.titleDropped) { context.titleDropped = true; continue; }
      // The page supplies the h1, so a source "##" renders at the base level and levels below it shift with it,
      // never skipping one (a "####" straight after a "##" becomes the next level down).
      const level = Math.min(6, Math.max(context.base, Math.min(source + context.base - 2, context.lastLevel + 1)));
      context.lastLevel = level;
      out.push(`<h${level} id="${headingId(heading[2]!, context)}">${renderInline(heading[2]!, context.options)}</h${level}>`);
      continue;
    }

    if (RULE.test(line)) { out.push('<hr>'); i++; continue; }

    if (/^\s*>/.test(line)) {
      const quote: string[] = [];
      for (; i < lines.length && !isBlank(lines[i]!) && (/^\s*>/.test(lines[i]!) || !startsBlock(lines[i]!)); i++) quote.push(lines[i]!.replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${renderBlocks(quote, context)}</blockquote>`);
      continue;
    }

    if (line.includes('|') && i + 1 < lines.length && TABLE_RULE.test(lines[i + 1]!)) {
      const head = splitRow(line), rows: string[][] = [];
      let j = i + 2;
      for (; j < lines.length && !isBlank(lines[j]!) && lines[j]!.includes('|'); j++) rows.push(splitRow(lines[j]!));
      const cells = (row: string[], tag: 'th' | 'td') => head.map((_, k) => `<${tag}${tag === 'th' ? ' scope="col"' : ''}>${renderInline(row[k] ?? '', context.options)}</${tag}>`).join('');
      out.push(`<div class="table-wrap md-table"><table><thead><tr>${cells(head, 'th')}</tr></thead><tbody>${rows.map(row => `<tr>${cells(row, 'td')}</tr>`).join('')}</tbody></table></div>`);
      i = j; continue;
    }

    const item = LIST_ITEM.exec(line);
    if (item) {
      const baseIndent = indentOf(line), ordered = /\d/.test(item[2]!);
      const items: string[][] = [];
      let start = ordered ? parseInt(item[2]!, 10) : 1, loose = false;
      while (i < lines.length) {
        const current = LIST_ITEM.exec(lines[i]!);
        if (!current || indentOf(lines[i]!) !== baseIndent || /\d/.test(current[2]!) !== ordered) break;
        const contentIndent = baseIndent + current[2]!.length + 1 + (/^\s*/.exec(lines[i]!.slice(baseIndent + current[2]!.length + 1))![0].length);
        const body = [current[3]!];
        i++;
        while (i < lines.length) {
          const next = lines[i]!;
          if (isBlank(next)) {
            let k = i; while (k < lines.length && isBlank(lines[k]!)) k++;
            if (k < lines.length && indentOf(lines[k]!) >= Math.min(contentIndent, baseIndent + 2)) { loose = loose || !LIST_ITEM.exec(lines[k]!) || indentOf(lines[k]!) > baseIndent; body.push(''); i++; continue; }
            if (k < lines.length && indentOf(lines[k]!) === baseIndent && LIST_ITEM.test(lines[k]!)) loose = true;
            break;
          }
          if (indentOf(next) > baseIndent) { body.push(next.slice(Math.min(contentIndent, indentOf(next)))); i++; continue; }
          if (!startsBlock(next) && !(next.includes('|') && TABLE_RULE.test(lines[i + 1] ?? '')) && body[body.length - 1] !== '') { body.push(next.trim()); i++; continue; }
          break;
        }
        items.push(body);
        while (i < lines.length && isBlank(lines[i]!)) {
          let k = i; while (k < lines.length && isBlank(lines[k]!)) k++;
          if (k < lines.length && indentOf(lines[k]!) === baseIndent && LIST_ITEM.test(lines[k]!)) { i = k; } else break;
        }
      }
      const rendered = items.map(body => {
        const html = renderBlocks(body, context);
        // A tight item holds one paragraph: unwrap it so the list keeps its line spacing.
        return `<li>${!loose ? html.replace(/^<p>([\s\S]*?)<\/p>/, '$1') : html}</li>`;
      }).join('');
      out.push(ordered ? `<ol${start !== 1 ? ` start="${start}"` : ''}>${rendered}</ol>` : `<ul>${rendered}</ul>`);
      continue;
    }

    const paragraph: string[] = [];
    for (; i < lines.length && !isBlank(lines[i]!) && (paragraph.length === 0 || !startsBlock(lines[i]!)); i++) {
      if (paragraph.length && lines[i]!.includes('|') && TABLE_RULE.test(lines[i + 1] ?? '')) break;
      paragraph.push(lines[i]!.trim());
    }
    out.push(`<p>${renderInline(paragraph.join('\n'), context.options).replace(/\n/g, ' ')}</p>`);
  }
  return out.join('\n');
}

export function renderMarkdown(source: string, options: MarkdownOptions = {}): string {
  const base = Math.min(6, Math.max(2, options.baseLevel ?? 2));
  // Ids the page around the body already uses, so a body heading such as "References" gets "references-2".
  const ids = new Map(['main', 'starter-prompt', 'instructions', 'references', 'related', 'reference'].map(id => [id, 1]));
  const context: Context = { options, ids, lastLevel: base - 1, base, titleDropped: false };
  return renderBlocks(source.replace(/\r\n?/g, '\n').split('\n'), context);
}

/** The text of the first level-1 heading, or undefined. */
export function markdownTitle(source: string): string | undefined {
  const line = source.split('\n').find(entry => /^#\s+/.test(entry));
  return line ? inlineText(line.replace(/^#\s+/, '').replace(/\s*#*\s*$/, '')) : undefined;
}

/** The plain text of the first paragraph after the title (skips headings, lists, code and tables). */
export function firstParagraph(source: string): string | undefined {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  let fence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!;
    if (FENCE.test(line)) { fence = !fence; continue; }
    if (fence || isBlank(line) || startsBlock(line) || line.trim().startsWith('|')) continue;
    const paragraph: string[] = [];
    for (; i < lines.length && !isBlank(lines[i]!) && !startsBlock(lines[i]!); i++) paragraph.push(lines[i]!.trim());
    return inlineText(paragraph.join(' '));
  }
  return undefined;
}
