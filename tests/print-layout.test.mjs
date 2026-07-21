import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import test, { after, before } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const chrome = process.env.CHROME_BIN ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const mimeTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

let server;
let pageHtml;

before(async () => {
  server = createServer(async (request, response) => {
    const requestPath = new URL(request.url, 'http://127.0.0.1').pathname;
    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const filePath = normalize(join(root, relativePath));

    if (!filePath.startsWith(root)) {
      response.writeHead(403).end();
      return;
    }

    try {
      const body = await readFile(filePath);
      response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] || 'application/octet-stream' });
      response.end(body);
    } catch {
      response.writeHead(404).end();
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  pageHtml = await new Promise((resolve, reject) => {
    const browser = spawn(chrome, [
      '--headless',
      '--disable-gpu',
      '--dump-dom',
      '--virtual-time-budget=3000',
      `http://127.0.0.1:${port}/index.html`,
    ]);
    let stdout = '';
    let stderr = '';

    browser.stdout.setEncoding('utf8');
    browser.stderr.setEncoding('utf8');
    browser.stdout.on('data', (chunk) => { stdout += chunk; });
    browser.stderr.on('data', (chunk) => { stderr += chunk; });
    browser.on('error', reject);
    browser.on('close', (code) => {
      try {
        assert.equal(code, 0, stderr);
        resolve(stdout);
      } catch (error) {
        reject(error);
      }
    });
  });
});

after(() => server?.close());

test('renders exactly two print pages with a footer on each page', () => {
  assert.equal((pageHtml.match(/class="print-page"/g) || []).length, 2);
  assert.equal((pageHtml.match(/class="print-page-footer"/g) || []).length, 2);
});

test('places every category in the intended print page and column', () => {
  const expectedPages = [
    [
      ['desayunos', 'frias-sin-cafe'],
      ['calientes-cafe', 'frias-cafe'],
    ],
    [
      ['filtrados', 'calientes-sin-cafe'],
      ['dulces', 'sodas'],
    ],
  ];

  expectedPages.forEach((columns, pageIndex) => {
    const pageStart = pageHtml.indexOf(
      `<section class="print-page" data-print-page="${pageIndex + 1}">`
    );
    const nextPageStart = pageHtml.indexOf(
      `<section class="print-page" data-print-page="${pageIndex + 2}">`,
      pageStart + 1
    );
    const printMenuEnd = pageHtml.indexOf('<a class="back-to-top"', pageStart);
    const pageEnd = nextPageStart === -1 ? printMenuEnd : nextPageStart;
    const pageMarkup = pageHtml.slice(pageStart, pageEnd);
    const renderedIds = [...pageMarkup.matchAll(/data-print-category="([^"]+)"/g)]
      .map((match) => match[1]);

    assert.deepEqual(renderedIds, columns.flat());
    assert.equal((pageMarkup.match(/class="print-column"/g) || []).length, 2);
  });
});

test('keeps unique IDs on the interactive menu sections', () => {
  const categoryIds = [
    'desayunos',
    'dulces',
    'calientes-cafe',
    'frias-cafe',
    'filtrados',
    'calientes-sin-cafe',
    'frias-sin-cafe',
    'sodas',
  ];

  categoryIds.forEach((id) => {
    assert.equal((pageHtml.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1);
  });
});

test('renders a centered header with house mark on each print page', () => {
  assert.equal((pageHtml.match(/class="print-page-header"/g) || []).length, 2);
  assert.equal((pageHtml.match(/class="print-page-header">\s*<img src="assets\/house-mark.svg"/g) || []).length, 2);
});

test('defines print page header with centered layout', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-page\s*\{[^}]*grid-template-rows:\s*auto 1fr 14mm;/s);
  assert.match(css, /\.print-page-header\s*\{[^}]*padding:\s*15mm 15mm 4mm;/s);
  assert.match(css, /\.print-page-header\s*\{[^}]*justify-content:\s*center;/s);
  assert.match(css, /\.print-page-header img\s*\{[^}]*width:\s*28px;/s);
});

test('defines zero-margin Letter pages with in-flow footers', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-menu\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /@page\s*\{[^}]*size:\s*Letter;[^}]*margin:\s*0;/s);
  assert.match(css, /\.print-page\s*\{[^}]*width:\s*8\.5in;[^}]*height:\s*11in;[^}]*grid-template-rows:\s*auto 1fr 14mm;/s);
  assert.match(css, /\.print-page-footer\s*\{[^}]*position:\s*static;/s);
  assert.doesNotMatch(css, /@media print[\s\S]*?footer\s*\{[^}]*position:\s*fixed;/);
});
