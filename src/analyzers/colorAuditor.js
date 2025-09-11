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
  const browser = await chromium.launch({ headless: false }); // run with visible browser
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US'
  });
  const page = await context.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(10000); // Wait 10 seconds for manual checks

  const title = await page.title(); // <-- Add this line

  // Extract all unique computed colors and fonts
  const { fonts, colors } = await page.evaluate(() => {
    const fontSet = new Set();
    const colorSet = new Set();
    document.querySelectorAll('*').forEach(el => {
      fontSet.add(getComputedStyle(el).fontFamily);
      colorSet.add(getComputedStyle(el).color);
    });
    return {
      fonts: Array.from(fontSet),
      colors: Array.from(colorSet)
    };
  });

  const snapFile = `snap-${Date.now()}.png`;
  const snapPath = `reports/${snapFile}`;
  await page.screenshot({ path: snapPath, fullPage: true });

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
    hasSearchBar // <-- add this
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