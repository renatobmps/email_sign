import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { launch } from 'puppeteer';

(async () => {
  const repoRoot = resolve(__dirname, '..');
  const indexPath = join(repoRoot, 'index.html');
  const outputPath = join(repoRoot, 'assets', 'demo-screenshot.png');

  if (!existsSync(indexPath)) {
    console.error('ERROR: index.html not found at', indexPath);
    process.exit(1);
  }

  const url = `file://${indexPath}`;

  const browser = await launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 900, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Give any JS a moment to settle (optional)
    await page.waitForTimeout(400);

    await page.screenshot({ path: outputPath, fullPage: true });

    console.log('Wrote screenshot to', outputPath);
  } finally {
    await browser.close();
  }
})();
