import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

test('renders the print footer logo with the exact cream fill', async () => {
  const [script, css] = await Promise.all([
    readFile(join(root, 'script.js'), 'utf8'),
    readFile(join(root, 'styles.css'), 'utf8'),
  ]);

  assert.match(
    script,
    /function createPrintFooter\(\)[\s\S]*?createElement\('span'\)[\s\S]*?className = 'footer-mark'/
  );
  assert.match(
    css,
    /\.print-page-footer \.footer-mark\s*\{[^}]*background:\s*#E1D5BF;[^}]*mask:\s*url\("assets\/house-mark\.svg"\)/s
  );
  assert.doesNotMatch(css, /\.print-page-footer img\s*\{[^}]*filter:/s);
});
