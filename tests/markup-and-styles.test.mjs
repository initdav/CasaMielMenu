import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('renders the house mark and text logo in the normal page header', async () => {
  const [html, css] = await Promise.all([
    readFile(join(root, 'index.html'), 'utf8'),
    readFile(join(root, 'styles.css'), 'utf8'),
  ]);

  assert.match(
    html,
    /<svg class="brand-mark"[^>]*>[\s\S]*?<use href="#brand-house-mark"><\/use>[\s\S]*?<svg class="brand-wordmark"[\s\S]*?<use href="#brand-wordmark"><\/use>/
  );
  assert.match(css, /\.brand-wordmark\s*\{[^}]*fill:\s*#EDD793;/s);
  assert.doesNotMatch(html, /class="brand-name"/);
});

test('defines local SVG symbols so file URLs can render the logos', async () => {
  const html = await readFile(join(root, 'index.html'), 'utf8');

  assert.match(html, /<symbol id="brand-house-mark" viewBox="0 0 237 264">/);
  assert.match(html, /<symbol id="brand-wordmark" viewBox="0 0 1364 816">/);
  assert.doesNotMatch(html, /<use href="assets\//);
});

test('uses the shared house mark for both favicon color schemes', async () => {
  const html = await readFile(join(root, 'index.html'), 'utf8');

  assert.equal((html.match(/href="assets\/house-mark\.svg"/g) || []).length, 2);
  assert.doesNotMatch(html, /house-mark-white\.svg/);
});

test('renders the screen footer mark with a direct cream fill', async () => {
  const [html, css] = await Promise.all([
    readFile(join(root, 'index.html'), 'utf8'),
    readFile(join(root, 'styles.css'), 'utf8'),
  ]);

  assert.match(
    html,
    /<svg class="footer-mark"[\s\S]*?<use href="#brand-house-mark"><\/use>/
  );
  assert.match(css, /\.footer-mark\s*\{[^}]*fill:\s*var\(--cream\);/s);
  assert.doesNotMatch(css, /^footer img\s*\{[^}]*filter:/ms);
});

test('does not keep a duplicate white house mark asset', async () => {
  await assert.rejects(readFile(join(root, 'assets/house-mark-white.svg')));
});

test('defines print page header with centered image layout', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-page-header\s*\{[^}]*padding:\s*15mm 15mm 4mm;/s);
  assert.match(css, /\.print-page-header\s*\{[^}]*justify-content:\s*center;/s);
  assert.match(css, /\.print-page-mark\s*\{[^}]*width:\s*48px;/s);
  assert.match(css, /\.print-page-wordmark\s*\{[^}]*width:\s*auto;[^}]*height:\s*48px;/s);
  assert.match(css, /\.print-page-mark\s*\{[^}]*fill:\s*#B9812A;/s);
  assert.match(css, /\.print-page-wordmark\s*\{[^}]*fill:\s*#311708;/s);
  assert.doesNotMatch(css, /\.print-page-wordmark\s*\{[^}]*font:/s);
});

test('defines zero-margin Letter pages with in-flow footers', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(css, /\.print-menu\s*\{\s*display:\s*none;\s*\}/);
  assert.match(css, /@page\s*\{[^}]*size:\s*Letter;[^}]*margin:\s*0;/s);
  assert.match(css, /\.print-page\s*\{[^}]*width:\s*8\.5in;[^}]*height:\s*11in;[^}]*grid-template-rows:\s*auto 1fr 14mm;/s);
  assert.match(css, /\.print-page-footer\s*\{[^}]*position:\s*static;/s);
  assert.doesNotMatch(css, /@media print[\s\S]*?footer\s*\{[^}]*position:\s*fixed;/);
});

test('renders the print footer logo with the exact cream fill', async () => {
  const css = await readFile(join(root, 'styles.css'), 'utf8');

  assert.match(
    css,
    /\.print-page-footer \.footer-mark\s*\{[^}]*background:\s*#E1D5BF;[^}]*mask:\s*url\("assets\/house-mark\.svg"\)/s
  );
  assert.doesNotMatch(css, /\.print-page-footer img\s*\{[^}]*filter:/s);
});
