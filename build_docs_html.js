const fs = require('fs');
const path = require('path');

function parseMarkdown(md) {
  let html = md;

  // Code blocks first
  const codeBlocks = [];
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
    const placeholder = `___CODEBLOCK_${codeBlocks.length}___`;
    codeBlocks.push({ lang, code });
    return placeholder;
  });

  // Inline code
  const inlineCodes = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `___INLINECODE_${inlineCodes.length}___`;
    inlineCodes.push(code);
    return placeholder;
  });

  // GitHub callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!CAUTION]
  html = html.replace(/^>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*\n((?:>.*\n?)*)/gim, (match, type, body) => {
    const cleanBody = body.replace(/^>\s?/gm, '').trim();
    return `<div class="piano-alert"><strong>${type.toUpperCase()}:</strong> ${cleanBody}</div>\n`;
  });

  // Standard blockquotes: > ...
  html = html.replace(/^>\s?(.*)$/gm, '<blockquote>$1</blockquote>');
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr>');

  // Bold & Italic
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin:1rem 0;">');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    let targetUrl = url;
    if (targetUrl.endsWith('.md') && !targetUrl.startsWith('http')) {
      targetUrl = targetUrl.replace(/\.md$/, '.html');
    }
    return `<a href="${targetUrl}" rel="noopener noreferrer">${text}</a>`;
  });

  // Tables
  html = html.replace(/((?:\|[^\n]+\|\r?\n)+)/g, (match) => {
    const lines = match.trim().split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return match;
    const headerCols = lines[0].split('|').slice(1, -1).map(c => c.trim());
    const isSep = /^\|(?:\s*:?-+:?\s*\|)+$/.test(lines[1]);
    if (!isSep) return match;

    let tableHtml = '<div class="table-container"><table><thead><tr>';
    headerCols.forEach(col => {
      tableHtml += `<th>${col}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    for (let i = 2; i < lines.length; i++) {
      const rowCols = lines[i].split('|').slice(1, -1).map(c => c.trim());
      tableHtml += '<tr>';
      rowCols.forEach(col => {
        tableHtml += `<td>${col}</td>`;
      });
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  });

  // Unordered lists
  html = html.replace(/(?:^|\n)(?:[-*+]\s+[^\n]+(?:\n|$))+/g, (match) => {
    const items = match.trim().split('\n').map(line => {
      return line.replace(/^[-*+]\s+/, '').trim();
    });
    return '\n<ul>\n' + items.map(item => `  <li>${item}</li>`).join('\n') + '\n</ul>\n';
  });

  // Ordered lists
  html = html.replace(/(?:^|\n)(?:\d+\.\s+[^\n]+(?:\n|$))+/g, (match) => {
    const items = match.trim().split('\n').map(line => {
      return line.replace(/^\d+\.\s+/, '').trim();
    });
    return '\n<ol>\n' + items.map(item => `  <li>${item}</li>`).join('\n') + '\n</ol>\n';
  });

  // Paragraphs
  const paragraphs = html.split(/\n{2,}/);
  html = paragraphs.map(para => {
    const p = para.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<ul') || p.startsWith('<ol') || p.startsWith('<div') || p.startsWith('<blockquote') || p.startsWith('<table') || p.startsWith('<hr') || p.startsWith('___CODEBLOCK_')) {
      return p;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('\n\n');

  // Restore inline codes
  html = html.replace(/___INLINECODE_(\d+)___/g, (match, idx) => {
    const code = inlineCodes[idx];
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<code>${escaped}</code>`;
  });

  // Restore code blocks
  html = html.replace(/___CODEBLOCK_(\d+)___/g, (match, idx) => {
    const { lang, code } = codeBlocks[idx];
    const escaped = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="language-${lang || 'text'}">${escaped}</code></pre>`;
  });

  return html;
}

const chapters = [
  { file: '01_philosophy_and_agency.md', title: '01. Philosophy & Agency', icon: '🎹' },
  { file: '02_tool_ecosystem_guide.md', title: '02. Tool Ecosystem Guide', icon: '🛠️' },
  { file: '03_deliberate_practice_framework.md', title: '03. Deliberate Practice Framework', icon: '🧠' },
  { file: '04_adult_repertoire_ladder.md', title: '04. Adult Repertoire Ladder', icon: '🎼' }
];

const docsDir = path.join(__dirname, 'docs');

chapters.forEach((ch, idx) => {
  const prevCh = idx > 0 ? chapters[idx - 1] : null;
  const nextCh = idx < chapters.length - 1 ? chapters[idx + 1] : null;
  const srcPath = path.join(docsDir, ch.file);
  const outFilename = ch.file.replace(/\.md$/, '.html');
  const outPath = path.join(docsDir, outFilename);

  if (!fs.existsSync(srcPath)) {
    console.warn(`File not found: ${srcPath}`);
    return;
  }

  const rawMd = fs.readFileSync(srcPath, 'utf8');
  const parsedContent = parseMarkdown(rawMd);

  const optionsHtml = chapters.map(c => `
    <option value="${c.file.replace(/\.md$/, '.html')}" ${c.file === ch.file ? 'selected' : ''}>
      ${c.icon} ${c.title}
    </option>
  `).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${ch.title} | The Adult Piano Companion</title>
  <link rel="stylesheet" href="../styles.css">
  <style>
    body {
      background-color: var(--bg);
      color: var(--ink-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }
    .doc-sticky-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(17, 20, 28, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .doc-nav-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .doc-btn-back {
      color: #fff;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 0.4rem 0.85rem;
      background: rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }
    .doc-btn-back:hover {
      background: var(--accent-bronze);
      color: #fff;
      transform: translateX(-2px);
    }
    .doc-select {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      padding: 0.4rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      cursor: pointer;
      outline: none;
      max-width: 320px;
    }
    .doc-select option {
      background: #11141c;
      color: #fff;
    }
    .doc-main-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1.25rem 4rem;
      flex: 1;
      width: 100%;
    }
    .doc-card {
      background: var(--surface);
      border-radius: var(--radius-md);
      padding: 2.5rem 3rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid var(--border);
    }
    .doc-content-area {
      line-height: 1.8;
      font-size: 1.05rem;
      color: var(--ink-secondary);
    }
    .doc-content-area h1 {
      font-size: 2.1rem;
      color: var(--ink-primary);
      margin-top: 0.5rem;
      margin-bottom: 1.2rem;
      line-height: 1.25;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.6rem;
    }
    .doc-content-area h2 {
      font-size: 1.5rem;
      color: var(--ink-primary);
      margin-top: 2.2rem;
      margin-bottom: 0.8rem;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 0.4rem;
    }
    .doc-content-area h3 {
      font-size: 1.2rem;
      color: var(--ink-primary);
      margin-top: 1.6rem;
      margin-bottom: 0.6rem;
    }
    .doc-content-area p {
      margin-bottom: 1.2rem;
    }
    .doc-content-area ul, .doc-content-area ol {
      margin-bottom: 1.3rem;
      padding-left: 1.75rem;
    }
    .doc-content-area li {
      margin-bottom: 0.45rem;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      text-align: left;
    }
    th {
      background: var(--bg-subtle);
      font-weight: 700;
      color: var(--ink-primary);
    }
    tr:nth-child(even) td {
      background: #fdfdfb;
    }
    .piano-alert {
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      margin: 1.5rem 0;
      font-size: 0.95rem;
      line-height: 1.55;
      background-color: var(--accent-bronze-light);
      border-left: 4px solid var(--accent-bronze);
      color: var(--accent-bronze-dark);
    }
    pre {
      background: var(--piano-ebony);
      color: var(--piano-ivory);
      padding: 1rem 1.25rem;
      border-radius: var(--radius-sm);
      overflow-x: auto;
      font-size: 0.88rem;
      margin: 1.25rem 0;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: rgba(0,0,0,0.05);
      padding: 0.15rem 0.35rem;
      border-radius: 4px;
      font-size: 0.88em;
    }
    blockquote {
      border-left: 4px solid var(--accent-bronze);
      padding-left: 1.1rem;
      margin: 1.4rem 0;
      color: var(--ink-muted);
      font-style: italic;
    }
    hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2.2rem 0;
    }
    .doc-footer-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .doc-nav-btn {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-sm);
      font-weight: 600;
      font-size: 0.88rem;
      text-decoration: none;
      background: var(--bg-subtle);
      border: 1px solid var(--border);
      color: var(--ink-primary);
      transition: all 0.2s ease;
    }
    .doc-nav-btn:hover {
      background: var(--accent-bronze);
      color: #fff;
    }
    .doc-nav-btn.primary {
      background: var(--piano-black);
      color: #fff;
    }
    .doc-nav-btn.primary:hover {
      background: var(--accent-bronze);
    }
    @media (max-width: 768px) {
      .doc-card {
        padding: 1.5rem;
      }
      .doc-content-area h1 {
        font-size: 1.6rem;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Header Bar -->
  <header class="doc-sticky-header">
    <div class="doc-nav-left">
      <a href="../index.html" class="doc-btn-back">🎹 Piano Companion</a>
      <a href="https://powerpig99.github.io/not-a-toe/" class="doc-btn-back" target="_blank" rel="noopener" title="Author Blog (Not a ToE)">🌌 Blog</a>
      <a href="https://powerpig99.github.io/hunting-in-finland/" class="doc-btn-back" target="_blank" rel="noopener" title="Companion Guide: Hunting in Finland">🌲 Hunting Guide</a>
      <a href="https://powerpig99.github.io/helsinki-mushroom-guide/" class="doc-btn-back" target="_blank" rel="noopener" title="Companion Guide: Helsinki Mushroom Guide">🍄 Mushroom Guide</a>
      <select class="doc-select" onchange="if(this.value) window.location.href=this.value" aria-label="Jump to Chapter">
        ${optionsHtml}
      </select>
    </div>
    <div>
      <a href="${ch.file}" class="doc-btn-back" target="_blank" style="background:rgba(255,255,255,0.08); font-weight:normal; font-size:0.8rem;">📄 Raw .md Source</a>
    </div>
  </header>

  <!-- Main Content -->
  <main class="doc-main-container">
    <article class="doc-card">
      <div class="doc-content-area">
        ${parsedContent}
      </div>

      <!-- Navigation Footer -->
      <footer class="doc-footer-nav">
        <div>
          ${prevCh ? `<a href="${prevCh.file.replace(/\.md$/, '.html')}" class="doc-nav-btn">← ${prevCh.icon} Prev Chapter</a>` : `<a href="../index.html" class="doc-nav-btn">← Main Portal</a>`}
        </div>
        <div>
          <button onclick="window.scrollTo({top:0, behavior:'smooth'})" class="doc-nav-btn" style="cursor:pointer;">↑ Top</button>
        </div>
        <div>
          ${nextCh ? `<a href="${nextCh.file.replace(/\.md$/, '.html')}" class="doc-nav-btn primary">${nextCh.icon} Next Chapter →</a>` : `<a href="../index.html" class="doc-nav-btn primary">Complete Guide ✓</a>`}
        </div>
      </footer>
    </article>
  </main>

  <footer style="background:var(--piano-black); color:rgba(255,255,255,0.7); text-align:center; padding:2rem 1rem; font-size:0.88rem;">
    <p>🎹 <strong>The Adult Piano Companion: A Definitive Guide & Tool Matrix</strong></p>
    <p style="margin-top:0.5rem;">
      <a href="../index.html" style="color:var(--accent-gold);">Home Portal</a> • 
      <a href="https://powerpig99.github.io/not-a-toe/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Not a ToE Blog</a> • 
      <a href="https://powerpig99.github.io/hunting-in-finland/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Hunting in Finland</a> • 
      <a href="https://powerpig99.github.io/helsinki-mushroom-guide/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Helsinki Mushroom Guide</a>
    </p>
  </footer>

</body>
</html>`;

  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Generated docs/${outFilename}`);
});

// Generate overview.html from README.md
const readmePath = path.join(__dirname, 'README.md');
if (fs.existsSync(readmePath)) {
  const readmeMd = fs.readFileSync(readmePath, 'utf8');
  const parsedReadme = parseMarkdown(readmeMd);

  const overviewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Overview & Complete Guide | The Adult Piano Companion (成人钢琴研习指南)</title>
  <link rel="stylesheet" href="styles.css">
  <style>
    body {
      background-color: var(--bg);
      color: var(--ink-primary);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    }
    .doc-sticky-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(17, 20, 28, 0.96);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .doc-nav-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .doc-btn-back {
      color: #fff;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-weight: 600;
      font-size: 0.88rem;
      padding: 0.4rem 0.85rem;
      background: rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }
    .doc-btn-back:hover {
      background: var(--accent-bronze);
      color: #fff;
      transform: translateX(-2px);
    }
    .doc-main-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1.25rem 4rem;
      flex: 1;
      width: 100%;
    }
    .doc-card {
      background: var(--surface);
      border-radius: var(--radius-md);
      padding: 2.5rem 3rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      border: 1px solid var(--border);
    }
    .doc-content-area {
      line-height: 1.8;
      font-size: 1.05rem;
      color: var(--ink-secondary);
    }
    .doc-content-area h1 {
      font-size: 2.1rem;
      color: var(--ink-primary);
      margin-top: 0.5rem;
      margin-bottom: 1.2rem;
      line-height: 1.25;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.6rem;
    }
    .doc-content-area h2 {
      font-size: 1.5rem;
      color: var(--ink-primary);
      margin-top: 2.2rem;
      margin-bottom: 0.8rem;
      font-family: Georgia, Cambria, "Times New Roman", Times, serif;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 0.4rem;
    }
    .doc-content-area h3 {
      font-size: 1.2rem;
      color: var(--ink-primary);
      margin-top: 1.6rem;
      margin-bottom: 0.6rem;
    }
    .doc-content-area p {
      margin-bottom: 1.2rem;
    }
    .doc-content-area ul, .doc-content-area ol {
      margin-bottom: 1.3rem;
      padding-left: 1.75rem;
    }
    .doc-content-area li {
      margin-bottom: 0.45rem;
    }
    .table-container {
      width: 100%;
      overflow-x: auto;
      margin: 1.5rem 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.92rem;
    }
    th, td {
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      text-align: left;
    }
    th {
      background: var(--bg-subtle);
      font-weight: 700;
      color: var(--ink-primary);
    }
    tr:nth-child(even) td {
      background: #fdfdfb;
    }
    hr {
      border: 0;
      border-top: 1px solid var(--border);
      margin: 2.2rem 0;
    }
  </style>
</head>
<body>

  <header class="doc-sticky-header">
    <div class="doc-nav-left">
      <a href="index.html" class="doc-btn-back">🎹 Piano Companion</a>
      <a href="https://powerpig99.github.io/not-a-toe/" class="doc-btn-back" target="_blank" rel="noopener" title="Author Blog (Not a ToE)">🌌 Blog</a>
      <a href="https://powerpig99.github.io/hunting-in-finland/" class="doc-btn-back" target="_blank" rel="noopener" title="Companion Guide: Hunting in Finland">🌲 Hunting Guide</a>
      <a href="https://powerpig99.github.io/helsinki-mushroom-guide/" class="doc-btn-back" target="_blank" rel="noopener" title="Companion Guide: Helsinki Mushroom Guide">🍄 Mushroom Guide</a>
    </div>
    <div>
      <a href="README.md" class="doc-btn-back" target="_blank" style="background:rgba(255,255,255,0.08); font-weight:normal; font-size:0.8rem;">📄 Raw README.md</a>
    </div>
  </header>

  <main class="doc-main-container">
    <article class="doc-card">
      <div class="doc-content-area">
        ${parsedReadme}
      </div>
    </article>
  </main>

  <footer style="background:var(--piano-black); color:rgba(255,255,255,0.7); text-align:center; padding:2rem 1rem; font-size:0.88rem;">
    <p>🎹 <strong>The Adult Piano Companion: A Definitive Guide & Tool Matrix</strong></p>
    <p style="margin-top:0.5rem;">
      <a href="index.html" style="color:var(--accent-gold);">Home Portal</a> • 
      <a href="https://powerpig99.github.io/not-a-toe/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Not a ToE Blog</a> • 
      <a href="https://powerpig99.github.io/hunting-in-finland/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Hunting in Finland</a> • 
      <a href="https://powerpig99.github.io/helsinki-mushroom-guide/" style="color:var(--accent-gold);" target="_blank" rel="noopener">Helsinki Mushroom Guide</a>
    </p>
  </footer>

</body>
</html>`;

  fs.writeFileSync(path.join(__dirname, 'overview.html'), overviewHtml, 'utf8');
  console.log('Generated overview.html in root');
}

console.log('Done compiling all piano guide markdown files to HTML.');
