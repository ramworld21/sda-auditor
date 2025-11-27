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
  if (!str || typeof str !== 'string') return null;
  str = str.trim().toLowerCase();
  if (str === 'transparent' || str === 'rgba(0, 0, 0, 0)') return null;
  // Hex (#fff, #ffffff)
  const hexMatch = str.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) return hexToRgb(hexMatch[0]);
  // rgb(...) or rgba(...)
  const match = str.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
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
export async function auditColors(url, fastMode = false) {
  const browser = await chromium.launch({ headless: true }); // run in headless mode for automation
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    locale: 'en-US'
  });
  const page = await context.newPage();
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'en-US,en;q=0.9'
  });

  // In fast mode, block heavy resources (images/fonts/media) to speed up page load
  if (fastMode) {
    try {
      await page.route('**/*', (route) => {
        const req = route.request();
        const type = req.resourceType();
        if (type === 'image' || type === 'media' || type === 'font') {
          return route.abort();
        }
        return route.continue();
      });
    } catch (e) {
      // ignore route errors
    }
  }

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 }); // 60s timeout, less strict
  } catch (err) {
    await browser.close();
    throw new Error('Navigation failed: ' + err.message);
  }

  const title = await page.title(); // page title for report

  // Extract all unique computed colors, fonts, and spacings.
  // Wrap evaluation in try/catch and validate the result to avoid destructuring undefined.
  let evalData = null;
  // Optionally wait for webfonts in normal mode; skip or shorten in fast mode
  try {
    if (!fastMode) {
      await page.evaluate(() => {
        return new Promise(res => {
          try {
            if (document.fonts && document.fonts.ready) {
              document.fonts.ready.then(() => res(true)).catch(() => res(true));
              return;
            }
          } catch (e) {
            // ignore
          }
          // No Font Loading API - resolve immediately
          res(true);
        });
      });
    } else {
      // small grace period in fast mode so critical inlined fonts/rendering can settle
      await page.waitForTimeout(250);
    }
  } catch (e) {
    // ignore font waiting failures
  }

  try {
    // Limit DOM scanning work when in fast mode by passing the flag into the page context
    evalData = await page.evaluate((fast) => {
      const fontSet = new Set();
      const colorSet = new Set();
      const spacingSet = new Set();

      // Collect fonts from computed styles and from the Font Loading API if available
      try {
        // Build a list of elements but limit how many we inspect in fast mode
        const all = Array.from(document.querySelectorAll('*'));
        const limit = fast ? 600 : all.length;
        const slice = all.slice(0, limit);
        slice.forEach(el => {
          try {
            const style = getComputedStyle(el);
            if (style && style.fontFamily) fontSet.add(style.fontFamily);
            // Collect a broader set of color-related properties
            if (style && style.color) colorSet.add(style.color);
            if (style && style.backgroundColor) colorSet.add(style.backgroundColor);
            if (style && style.borderTopColor) colorSet.add(style.borderTopColor);
            if (style && style.borderRightColor) colorSet.add(style.borderRightColor);
            if (style && style.borderBottomColor) colorSet.add(style.borderBottomColor);
            if (style && style.borderLeftColor) colorSet.add(style.borderLeftColor);
            if (style && style.outlineColor) colorSet.add(style.outlineColor);
            // Collect margin/padding
            ['marginTop','marginRight','marginBottom','marginLeft','paddingTop','paddingRight','paddingBottom','paddingLeft'].forEach(prop => {
              spacingSet.add(style[prop]);
            });
          } catch (e) {
            // ignore elements that throw
          }
        });
      } catch (e) {
        // ignore high-level failures in collection
      }

      // Font faces available via document.fonts (if supported)
      try {
        if (document.fonts && typeof document.fonts.forEach === 'function' && !fast) {
          document.fonts.forEach(f => {
            try { if (f && f.family) fontSet.add(String(f.family)); } catch (e) {}
          });
        }
        // Also use FontFaceSet.check to assert availability of common IBM Plex variants
        try {
          const checks = [
            'IBM Plex Sans Arabic',
            'IBM Plex Arabic',
            'IBM Plex Sans',
            'IBMPlexSans',
            'IBMPlexSansArabic'
          ];
          checks.forEach(name => {
            try {
              if (document.fonts.check && document.fonts.check(`12px "${name}"`)) {
                fontSet.add(name);
              }
            } catch (e) {}
          });
        } catch (e) {}
      } catch (e) { /* ignore */ }

      // Normalize and filter collected colors (skip transparent/empty)
      const normalize = (c) => { try { return (c || '').trim(); } catch(e){ return null } };
      const colors = Array.from(colorSet).map(normalize).filter(c => c && c !== 'transparent' && c !== 'rgba(0, 0, 0, 0)');

      return {
        fonts: Array.from(fontSet),
        colors,
        spacings: Array.from(spacingSet)
      };
    }, fastMode);
  } catch (e) {
    await browser.close();
    throw new Error('page.evaluate failed while collecting styles: ' + (e && e.message ? e.message : String(e)));
  }

  let fonts = [];
  let colors = [];
  let spacings = [];
  if (!evalData || typeof evalData !== 'object') {
    // Don't hard-fail — continue with empty defaults so scanner still produces screenshots/reports.
    console.warn('Warning: page.evaluate returned no data when collecting styles — continuing with empty defaults');
  } else {
    ({ fonts = [], colors = [], spacings = [] } = evalData);
  }

  // Normalize font-family strings into individual family names and collect FontFace families
  const normalizeFamily = (s) => {
    if (!s || typeof s !== 'string') return [];
    return s.split(',').map(f => f.replace(/['"]/g, '').trim()).filter(Boolean);
  };
  const fontFamilies = new Set();
  fonts.forEach(f => normalizeFamily(f).forEach(n => fontFamilies.add(n)));
  const fontFaces = Array.from(fontFamilies);
  // Also add lowercased tokens for easier matching
  const fontFacesLower = fontFaces.map(f => f.toLowerCase());

  // Stronger detection for IBM Plex Arabic / IBM Plex Sans variants
  const fontMatch = fontFacesLower.some(f => {
    if (f.includes('ibm plex')) return true;
    if (f.includes('ibm-plex')) return true;
    if (f.includes('plex') && (f.includes('arabic') || f.includes('sans'))) return true;
    // match compact names like 'ibmplexsansarabic' or 'ibmplexarabic'
    if (/ibm\W*plex/.test(f)) return true;
    return false;
  });

  // Wait a short time to ensure dynamic content stabilizes before screenshot (shorter in fast mode)
  await page.waitForTimeout(fastMode ? 600 : 3000);
  if (!fastMode) {
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });
  }
  const snapFile = `snap-${Date.now()}.png`;
  const snapPath = `reports/${snapFile}`;
  // Take at least one full-page screenshot; in fast mode keep it single and quicker
  await page.screenshot({ path: snapPath, fullPage: true, timeout: fastMode ? 30000 : 60000 });

  // Responsive screenshots
  const screenshotMobileFile = `snap-${Date.now()}-mobile.png`;
  const screenshotTabletFile = `snap-${Date.now()}-tablet.png`;
  const screenshotDesktopFile = `snap-${Date.now()}-desktop.png`;

  if (!fastMode) {
    // Mobile
    await page.setViewportSize({ width: 375, height: 812 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.screenshot({ path: path.join('reports', screenshotMobileFile) });
    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.screenshot({ path: path.join('reports', screenshotTabletFile) });
    // Desktop
    await page.setViewportSize({ width: 1440, height: 900 });
    await new Promise(resolve => setTimeout(resolve, 1500));
    await page.screenshot({ path: path.join('reports', screenshotDesktopFile) });
  } else {
    // In fast mode only capture a single desktop screenshot (already captured fullPage)
    // but still populate the variables so reporter doesn't break
    // Use the same base name for mobile/tablet/desktop in fast runs to keep report stable
    // leave mobile/tablet/desktop empty to avoid extra files
  }

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

  // Detect DGA-style digital stamp / authenticated bar structures
  // Valid stamp must have: Saudi flag + number + official text
  let digitalStamp = { present: false, reason: null, selectors: [], images: [], svg: null, qrCount: 0 };
  try {
    digitalStamp = await page.evaluate(() => {
      const result = { present: false, reason: null, selectors: [], images: [], svg: null, qrCount: 0 };
      try {
        // Required text for official Saudi government stamp
        const requiredText = 'موقع حكومي رسمي تابع لحكومة المملكة العربية السعودية';
        let hasRequiredText = false;
        let hasNumber = false;
        let hasSaudiFlag = false;

        // Search for the exact required text
        document.querySelectorAll('body *').forEach(el => {
          try {
            const text = el.innerText || '';
            if (text.includes(requiredText)) {
              hasRequiredText = true;
              result.selectors.push({ selector: el.tagName.toLowerCase(), text: text.slice(0,150) });
            }
          } catch(e){}
        });

        // Look for numbers in close proximity to stamp text
        if (hasRequiredText) {
          document.querySelectorAll('body *').forEach(el => {
            try {
              const text = el.innerText || '';
              // Look for numbers (digits)
              if (/\d+/.test(text) && text.length < 50) {
                hasNumber = true;
              }
            } catch(e){}
          });
        }

        // Look for Saudi flag (common patterns: saudi flag images, svg with green/white colors)
        document.querySelectorAll('img').forEach(img => {
          try {
            const src = img.getAttribute('src') || '';
            const alt = img.getAttribute('alt') || '';
            // Saudi flag patterns
            if (/flag|علم|saudi|السعود/i.test(src) || /flag|علم|saudi|السعود/i.test(alt)) {
              hasSaudiFlag = true;
              result.images.push(new URL(src, location.href).href);
            }
          } catch(e){}
        });

        // Check SVG elements for Saudi flag (green fill, specific patterns)
        document.querySelectorAll('svg').forEach(svg => {
          try {
            const svgStr = (new XMLSerializer()).serializeToString(svg);
            // Look for green color typical of Saudi flag
            if (/fill.*#0.*5.*5/i.test(svgStr) || /fill.*green/i.test(svgStr)) {
              hasSaudiFlag = true;
              result.svg = svgStr.slice(0, 500);
            }
          } catch(e){}
        });

        // Stamp is only verified if ALL three conditions are met
        if (hasRequiredText && hasNumber && hasSaudiFlag) {
          result.present = true;
          result.reason = 'موقع حكومي موثق: يحتوي على النص الرسمي + رقم + علم المملكة';
        } else {
          result.present = false;
          const missing = [];
          if (!hasRequiredText) missing.push('النص الرسمي');
          if (!hasNumber) missing.push('رقم');
          if (!hasSaudiFlag) missing.push('علم السعودية');
          result.reason = `غير موثق - ناقص: ${missing.join(', ')}`;
        }
      } catch (e) {
        // ignore
      }
      return result;
    });
  } catch (e) {
    // ignore digital stamp detection errors
  }

  // Capture element screenshots for each discovered page color (help locate failing colors)
  const colorFailures = [];
  try {
    if (!fastMode) {
    // Only capture colors that don't match (from colorAudit results)
    const failingColors = (colorAudit || []).filter(r => !r.match).map(r => r.color);
    const uniqueColors = Array.from(new Set(failingColors)).filter(Boolean);
    let idx = 0;
    for (const c of uniqueColors) {
      try {
        // Find an element whose computed style matches this color string
        const handle = await page.evaluateHandle((col) => {
          try {
            const els = document.querySelectorAll('*');
            for (const el of els) {
              try {
                const s = getComputedStyle(el);
                if (!s) continue;
                const props = [s.color, s.backgroundColor, s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor, s.outlineColor];
                for (const p of props) {
                  if (!p) continue;
                  if (p.trim() === col.trim()) {
                    el.scrollIntoView({ block: 'center', inline: 'center' });
                    return el;
                  }
                }
              } catch (e) {}
            }
          } catch (e) {}
          return null;
        }, c);
        const el = handle && handle.asElement ? handle.asElement() : null;
        if (el) {
          idx += 1;
          const safeName = `color-fail-${Date.now()}-${idx}.png`;
          const reportsDir = path.join(process.cwd(), 'reports');
          if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
          const outPath = path.join(reportsDir, safeName);
          try {
            // collect selector and bounding rect from page context
            const info = await page.evaluate((node) => {
              function cssPath(el) {
                if (!(el instanceof Element)) return '';
                const path = [];
                while (el && el.nodeType === Node.ELEMENT_NODE) {
                  let selector = el.nodeName.toLowerCase();
                  if (el.id) {
                    selector += '#' + el.id;
                    path.unshift(selector);
                    break;
                  } else {
                    let sib = el, nth = 1;
                    while (sib = sib.previousElementSibling) {
                      if (sib.nodeName.toLowerCase() === selector) nth++;
                    }
                    selector += `:nth-of-type(${nth})`;
                  }
                  path.unshift(selector);
                  el = el.parentElement;
                }
                return path.join(' > ');
              }
              const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
              return { selector: cssPath(node), outerHTML: node.outerHTML, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null };
            }, el).catch(()=>({ selector: null, outerHTML: null, rect: null }));

            await el.screenshot({ path: outPath });
            // capture a short snippet/description of the element (prefer info.outerHTML)
            const snippet = info && info.outerHTML ? String(info.outerHTML).slice(0,400) : await (await el.getProperty('outerHTML')).jsonValue().catch(()=>null);
            colorFailures.push({ color: c, screenshot: safeName, snippet: snippet ? String(snippet).slice(0,400) : null, selector: info.selector, rect: info.rect });
          } catch (e) {
            // ignore screenshot failures
          }
          try { await handle.dispose(); } catch(e){}
        } else {
          try { await handle.dispose(); } catch(e){}
        }
      } catch (e) {
        // continue to next color
      }
    }
    }
  } catch (e) {
    // ignore overall failures
  }

  // Attempt to discover a site logo (favicon, og:image, twitter:image, images with logo-like attributes)
  let discoveredLogo = null;
  let discoveredFavicon = null;
  try {
    const logoCandidates = await page.evaluate(() => {
      try {
        const items = [];
        const seen = new Set();
        function pushObj(obj) {
          if (!obj || !obj.url) return;
          if (seen.has(obj.url)) return; seen.add(obj.url);
          items.push(obj);
        }
        // meta og / twitter images (high priority)
        try {
          ['og:image', 'twitter:image'].forEach(k => {
            try {
              const m = document.querySelector(`meta[property="${k}"]`) || document.querySelector(`meta[name="${k}"]`);
              if (m && m.getAttribute('content')) {
                const u = new URL(m.getAttribute('content'), location.href).href;
                pushObj({ url: u, source: 'meta', score: 120 });
              }
            } catch (e) {}
          });
        } catch (e) {}

        // images that look like logos (check natural sizes when available)
        try {
          document.querySelectorAll('img').forEach(img => {
            try {
              const src = img.getAttribute('src');
              if (!src) return;
              const alt = (img.getAttribute('alt') || '').toLowerCase();
              const id = (img.id || '').toLowerCase();
              const cls = (img.getAttribute('class') || '').toLowerCase();
              const naturalW = img.naturalWidth || 0;
              const naturalH = img.naturalHeight || 0;
              let score = 60;
              if (/(logo|brand|mark|emblem|شعار)/i.test(alt + ' ' + id + ' ' + cls)) score += 20;
              if (naturalW * naturalH > 4000) score += 20;
              // prefer svg/jpg/png
              if (/\.svg(\?|$)/i.test(src)) score += 15;
              const u = new URL(src, location.href).href;
              pushObj({ url: u, source: 'img', score });
            } catch (e) {}
          });
        } catch (e) {}

        // link rel icons (lower priority)
        try {
          document.querySelectorAll('link[rel]').forEach(l => {
            try {
              const rel = (l.getAttribute('rel') || '').toLowerCase();
              const href = l.getAttribute('href');
              if (!href) return;
              if (/icon|shortcut icon|apple-touch-icon/i.test(rel)) {
                const u = new URL(href, location.href).href;
                pushObj({ url: u, source: 'link', score: 30 });
              }
            } catch (e) {}
          });
        } catch (e) {}

        return items;
      } catch (e) { return []; }
    });

    // If we have structured candidates, sort by score (descending) and prefer non-ICO images
    if (logoCandidates && logoCandidates.length) {
      // Normalize candidates if they are simple strings (older runs)
      const normalized = logoCandidates.map(c => (typeof c === 'string') ? { url: c, source: 'unknown', score: 30 } : c);
      // mark discoveredFavicon when we see a favicon-like path
      for (const obj of normalized) {
        try {
          const p = (new URL(obj.url)).pathname.toLowerCase();
          if (!discoveredFavicon && /favicon\.(ico|png|svg)$/.test(p)) discoveredFavicon = obj.url;
        } catch (e) {}
      }
      // prefer higher score and prefer svg/png/jpg over ico
      normalized.sort((a, b) => (b.score || 0) - (a.score || 0));
      // If top candidate is an .ico and there exists a png/jpg/svg candidate, move ico down
      const hasBetter = normalized.find(n => /\.(png|jpg|jpeg|svg)(\?|$)/i.test(n.url));
      if (hasBetter) {
        normalized.sort((a, b) => {
          const aPref = /\.(png|jpg|jpeg|svg)(\?|$)/i.test(a.url) ? 1 : 0;
          const bPref = /\.(png|jpg|jpeg|svg)(\?|$)/i.test(b.url) ? 1 : 0;
          return (bPref - aPref) || ((b.score||0)-(a.score||0));
        });
      }
      for (const obj of normalized) {
        const u = obj.url;
        try {
          const res = await fetch(u, { method: 'GET' });
          if (!res || !res.ok) continue;
          const buf = Buffer.from(await res.arrayBuffer());
          const urlObj = new URL(u);
          let ext = (path.extname(urlObj.pathname) || '').split('?')[0];
          if (!ext) ext = '.png';
          const logoName = `logo${ext}`;
          const reportsDir = path.join(process.cwd(), 'reports');
          if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
          const outPath = path.join(reportsDir, logoName);
          fs.writeFileSync(outPath, buf);
          discoveredLogo = logoName; // relative to reports/
          if (!discoveredFavicon) discoveredFavicon = u;
          break;
        } catch (e) {
          // try next candidate
        }
      }
    }
    // If we didn't find or download any candidate yet, try the site's /favicon.ico as a fallback
    if (!discoveredLogo) {
      try {
        const purl = await page.url();
        const origin = (new URL(purl)).origin;
        const favUrl = `${origin}/favicon.ico`;
        const r = await fetch(favUrl, { method: 'GET' });
        if (r && r.ok) {
          const buf = Buffer.from(await r.arrayBuffer());
          const ext = '.ico';
          const logoName = `logo${ext}`;
          const reportsDir = path.join(process.cwd(), 'reports');
          if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
          const outPath = path.join(reportsDir, logoName);
          fs.writeFileSync(outPath, buf);
          discoveredLogo = logoName;
          if (!discoveredFavicon) discoveredFavicon = favUrl;
        }
      } catch (e) {
        // ignore fallback errors
      }
    }
  } catch (e) {
    // ignore logo discovery errors
  }

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

  // Use the stronger detection result (computed above). Log an informative message.
  if (fontMatch) {
    console.log('IBM Plex variant detected among page font families:', fontFaces.join(', '));
  } else {
    console.log('IBM Plex variant NOT detected among page font families. Collected:', fontFaces.join(', '));
  }

  // Capture element screenshots for failing colors (now that colorAudit is available)
  try {
    if (!fastMode) {
      const failingColors = colorAudit.filter(r => !r.match).map(r => r.color);
      const uniqueColors = Array.from(new Set(failingColors)).filter(Boolean).slice(0, 5); // Limit to first 5 to avoid timeouts
      let idx = 0;
      for (const c of uniqueColors) {
        try {
          const handle = await page.evaluateHandle((col) => {
            try {
              const els = document.querySelectorAll('*');
              for (const el of els) {
                try {
                  const s = getComputedStyle(el);
                  if (!s) continue;
                  const props = [s.color, s.backgroundColor, s.borderTopColor, s.borderRightColor, s.borderBottomColor, s.borderLeftColor, s.outlineColor];
                  for (const p of props) {
                    if (!p) continue;
                    if (p.trim() === col.trim()) {
                      el.scrollIntoView({ block: 'center', inline: 'center' });
                      return el;
                    }
                  }
                } catch (e) {}
              }
            } catch (e) {}
            return null;
          }, c);
          const el = handle && handle.asElement ? handle.asElement() : null;
          if (el) {
            idx += 1;
            const safeName = `color-fail-${Date.now()}-${idx}.png`;
            const reportsDir = path.join(process.cwd(), 'reports');
            if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
            const outPath = path.join(reportsDir, safeName);
            try {
              const info = await page.evaluate((node) => {
                function cssPath(el) {
                  if (!(el instanceof Element)) return '';
                  const path = [];
                  while (el && el.nodeType === Node.ELEMENT_NODE) {
                    let selector = el.nodeName.toLowerCase();
                    if (el.id) {
                      selector += '#' + el.id;
                      path.unshift(selector);
                      break;
                    }
                    if (el.className && typeof el.className === 'string') {
                      selector += '.' + el.className.split(' ').filter(Boolean).join('.');
                    }
                    let sib = el;
                    let nth = 1;
                    while (sib = sib.previousElementSibling) {
                      if (sib.nodeName.toLowerCase() === selector) nth++;
                    }
                    selector += `:nth-of-type(${nth})`;
                    path.unshift(selector);
                    el = el.parentElement;
                  }
                  return path.join(' > ');
                }
                const rect = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
                return { selector: cssPath(node), outerHTML: node.outerHTML, rect: rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null };
              }, el).catch(()=>({ selector: null, outerHTML: null, rect: null }));
              await el.screenshot({ path: outPath, timeout: 10000 }); // 10 second timeout
              const snippet = info && info.outerHTML ? String(info.outerHTML).slice(0,400) : await (await el.getProperty('outerHTML')).jsonValue().catch(()=>null);
              colorFailures.push({ color: c, screenshot: safeName, snippet: snippet ? String(snippet).slice(0,400) : null, selector: info.selector, rect: info.rect });
            } catch (e) {
              // Screenshot failed, skip this color
            }
            try { await handle.dispose(); } catch(e){}
          } else {
            try { await handle.dispose(); } catch(e){}
          }
        } catch (e) {
          // Error processing color, continue
        }
      }
    }
  } catch (e) {
    // Overall capture error, continue with empty colorFailures
  }

  // Close browser after all screenshots are captured
  await browser.close();

  const result = {
    url,
    title,
    snapPath: snapFile,
    timestamp: new Date().toISOString(),
    fonts,
    fontFaces,
    fontMatch,
    colorAudit,
    // attach discovered favicon/logo names (populated if discovered before browser close)
    logo: discoveredLogo || null,
    favicon: discoveredFavicon || null,
    digitalStamp,
    colorFailures,
    hasSearchBar,
    spacings,
    spacingMatches,
    spacingAccuracy,
    screenshotMobile: fastMode ? '' : screenshotMobileFile,
    screenshotTablet: fastMode ? '' : screenshotTabletFile,
    screenshotDesktop: fastMode ? '' : screenshotDesktopFile
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