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

  const pageChunks = pageHtml.split('<section class="print-page"').slice(1);
  assert.equal(pageChunks.length, 2);

  pageChunks.forEach((chunk, pageIndex) => {
    assert.ok(chunk.startsWith(` data-print-page="${pageIndex + 1}">`));
    const renderedIds = [...chunk.matchAll(/data-print-category="([^"]+)"/g)]
      .map((match) => match[1]);

    assert.deepEqual(renderedIds, expectedPages[pageIndex].flat());
    assert.equal((chunk.match(/class="print-column"/g) || []).length, 2);
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

test('renders the house mark and text logo on each print page', () => {
  assert.equal((pageHtml.match(/class="print-page-header"/g) || []).length, 2);
  assert.equal(
    (pageHtml.match(/<svg class="print-page-mark"[^>]*>[\s\S]*?<use href="#brand-house-mark"><\/use>[\s\S]*?<svg class="print-page-wordmark"[^>]*>[\s\S]*?<use href="#brand-wordmark"><\/use>/g) || []).length,
    2
  );
});

test('renders every menu section with priced items', () => {
  const sections = pageHtml.split('<section class="menu-section"').slice(1);
  assert.equal(sections.length, 8);
  sections.forEach((section) => {
    assert.ok(section.includes('<h4>'), 'section has item names');
    assert.ok(section.includes('class="price"'), 'section has prices');
  });
  assert.match(pageHtml, /Desayuno Casa Miel[\s\S]*?\$20\.000/);
});

test('renders one category pill per section, first one active', () => {
  const pills = [...pageHtml.matchAll(/<a class="category-pill([^"]*)" href="#([^"]+)"([^>]*)>/g)];
  assert.equal(pills.length, 8);
  pills.forEach(([, , id]) => {
    assert.ok(pageHtml.includes(`<section class="menu-section" id="${id}">`));
  });
  assert.equal(pills[0][1], ' active');
  assert.equal(pills[0][3], ' aria-current="location"');
  pills.slice(1).forEach((pill) => {
    assert.ok(!pill[1].includes('active'));
    assert.ok(!pill[3].includes('aria-current'));
  });
});

test('renders every menu item with a price in the print menu', () => {
  const printStart = pageHtml.indexOf('<div class="print-menu"');
  const screenMarkup = pageHtml.slice(0, printStart);
  const printMarkup = pageHtml.slice(printStart);
  const countItems = (markup) =>
    (markup.match(/<article class="menu-item"/g) || []).length;
  assert.ok(countItems(screenMarkup) > 0);
  assert.equal(countItems(printMarkup), countItems(screenMarkup));
  const priceCount = (printMarkup.match(/class="price"/g) || []).length;
  assert.equal(priceCount, countItems(printMarkup));
});

test('keeps title connectors attached with non-breaking spaces', () => {
  assert.ok(pageHtml.includes('con&nbsp;café'), 'category heading uses NBSP after connector');
  assert.ok(pageHtml.includes('te&nbsp;espera'), 'hero title uses NBSP after connector');
});

test('renders a house mark in each print page footer', () => {
  assert.equal((pageHtml.match(/<span class="footer-mark"/g) || []).length, 2);
});
