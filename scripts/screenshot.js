const fs = require('node:fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const indexPath = path.join(repoRoot, 'index.html');
  const outputPath = path.join(repoRoot, 'assets', 'demo-screenshot.png');

  if (!fs.existsSync(indexPath)) {
    console.error('ERROR: index.html not found at', indexPath);
    process.exit(1);
  }

  const url = `file://${indexPath}`;

  const browser = await puppeteer.launch({
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
