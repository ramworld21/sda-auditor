import fs from "fs";
import { chromium } from "playwright";
import path from "path";
import { generateHTMLReport } from "../utils/reporter.js";

// Load brand colors
const tokens = JSON.parse(fs.readFileSync('./src/config/sda.tokens.json', 'utf-8'));
const brandColors = Object.values(tokens.colors)
  .flatMap(palette => typeof palette === 'string' ? [palette] : Object.values(palette));

// Helper: Convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
}

// Helper: Parse rgb/rgba string to array
function parseRgb(str) {
  const match = str.match(/rgba?\((\d+), (\d+), (\d+)/);
  return match ? [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])] : null;
}

// Helper: Color distance
function colorDistance(a, b) {
  return Math.sqrt(
    Math.pow(a[0] - b[0], 2) +
    Math.pow(a[1] - b[1], 2) +
    Math.pow(a[2] - b[2], 2)
  );
}

// Main function
export async function auditColors(url) {
  const browser = await chromium.launch({ headless: true }); // run in headless mode for automation
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US'
  });
  const page = await context.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout, less strict
  } catch (err) {
    await browser.close();
    throw new Error('Navigation failed: ' + err.message);
  }

  const title = await page.title(); // <-- Add this line

  // Extract all unique computed colors, fonts, and spacings
  const { fonts, colors, spacings } = await page.evaluate(() => {
    const fontSet = new Set();
    const colorSet = new Set();
    const spacingSet = new Set();
    document.querySelectorAll('*').forEach(el => {
      const style = getComputedStyle(el);
      fontSet.add(style.fontFamily);
      colorSet.add(style.color);
      // Collect all margin and padding values
      ['marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft'].forEach(prop => {
        spacingSet.add(style[prop]);
      });
    });
    return {
      fonts: Array.from(fontSet),
      colors: Array.from(colorSet),
      spacings: Array.from(spacingSet)
    };
  });

  // Wait 5 seconds to ensure all dynamic content is visible before screenshot
  await new Promise(resolve => setTimeout(resolve, 5000));

  const snapFile = `snap-${Date.now()}.png`;
  const snapPath = `reports/${snapFile}`;
  await page.screenshot({ path: snapPath, fullPage: true });

  // Responsive screenshots
  const screenshotMobileFile = `snap-${Date.now()}-mobile.png`;
  const screenshotTabletFile = `snap-${Date.now()}-tablet.png`;
  const screenshotDesktopFile = `snap-${Date.now()}-desktop.png`;

  // Mobile
  await page.setViewportSize({ width: 375, height: 812 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: path.join('reports', screenshotMobileFile) });
  // Tablet
  await page.setViewportSize({ width: 768, height: 1024 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: path.join('reports', screenshotTabletFile) });
  // Desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await new Promise(resolve => setTimeout(resolve, 2000));
  await page.screenshot({ path: path.join('reports', screenshotDesktopFile) });

  // Check for search bar BEFORE closing the browser!
  const hasSearchBar = await page.evaluate(() => {
    return !!(
      document.querySelector('input[type="search"]') ||
      document.querySelector('input[type="text"][name*="search" i]') ||
      document.querySelector('input[type="text"][id*="search" i]') ||
      document.querySelector('input[type="text"][placeholder*="search" i]') ||
      document.querySelector('form[role="search"]') ||
      document.querySelector('input[aria-label*="search" i]')
    );
  });

  await browser.close();

  // Load brand colors (flattened)
  const tokens = JSON.parse(fs.readFileSync('./src/config/sda.tokens.json', 'utf-8'));
  const brandColors = Object.values(tokens.colors)
    .flatMap(palette => typeof palette === 'string' ? [palette] : Object.values(palette));
  const brandRgb = brandColors.map(hexToRgb);

  // Spacing tokens (from design system)
  const spacingTokens = tokens.spacing ? Object.values(tokens.spacing) : [];
  // Normalize spacing values to px
  function normalizePx(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.endsWith('px')) return parseFloat(val);
    return null;
  }
  const spacingPxTokens = spacingTokens.map(normalizePx).filter(v => v !== null);

  // Filter out 0, auto, negative, and duplicate spacing values
  const validSpacings = spacings
    .map(normalizePx)
    .filter(v => v !== null && v > 0);
  const uniqueSpacings = Array.from(new Set(validSpacings));

  // Check if unique page spacings match any design system spacing
  const spacingMatches = uniqueSpacings.filter(sp => spacingPxTokens.includes(sp));
  const spacingAccuracy = uniqueSpacings.length > 0 ? (spacingMatches.length / uniqueSpacings.length) * 100 : null;

  // Compare website colors to brand colors
  const results = colors.map(colorStr => {
    const rgb = parseRgb(colorStr);
    if (!rgb) return { colorStr, match: false, closest: null, distance: null };
    let minDist = Infinity, closest = null;
    for (const b of brandRgb) {
      const dist = colorDistance(rgb, b);
      if (dist < minDist) {
        minDist = dist;
        closest = b;
      }
    }
    return {
      colorStr,
      match: minDist < 30, // threshold for "close enough"
      closest: closest ? `rgb(${closest.join(',')})` : null,
      distance: minDist
    };
  });

  const matches = results.filter(r => r.match).length;
  const accuracy = (matches / results.length) * 100;

  // Prepare result object
  const colorAudit = results.map(r => ({
    color: r.colorStr,
    closest: r.closest,
    distance: r.distance,
    match: r.match
  }));

  // Font matching logic
  const brandFontPatterns = [/ibm\s?plex/i]; // matches "IBM Plex" or "IBMPlex" (case-insensitive)
  const fontMatch = (fonts || []).some(f =>
    brandFontPatterns.some(pattern => pattern.test(f))
  );
  if (fontMatch) {
    console.log(`The font "${brandFontPatterns}" is used on the page.`);
  } else {
    console.log(`The font "${brandFontPatterns}" is NOT used on the page.`);
  }

  const result = {
    url,
    title,
    snapPath: snapFile,
    timestamp: new Date().toISOString(),
    fonts,
    fontMatch,
    colorAudit,
    hasSearchBar,
    spacings,
    spacingMatches,
    spacingAccuracy,
    screenshotMobile: screenshotMobileFile,
    screenshotTablet: screenshotTabletFile,
    screenshotDesktop: screenshotDesktopFile
  };

  // Ensure reports directory exists
  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  // Save JSON report
  fs.writeFileSync(path.join(reportsDir, "color-audit.json"), JSON.stringify(result, null, 2));

  // Generate HTML report
  generateHTMLReport(result);

  console.log("Color audit done. JSON + HTML reports generated.");
}