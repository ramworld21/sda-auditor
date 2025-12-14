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
    locale: 'en-US',
    ignoreHTTPSErrors: true
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

  // Robust navigation with retry/backoff. If navigation repeatedly fails we'll
  // generate a minimal error report instead of throwing so the CLI can show
  // a helpful report to the user.
  let navError = null;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const timeout = attempt === 1 ? 60000 : 120000; // first attempt 60s, subsequent 120s
      const waitUntil = attempt === 1 ? 'domcontentloaded' : 'networkidle';
      await page.goto(url, { waitUntil, timeout });
      navError = null;
      break;
    } catch (err) {
      navError = err;
      console.warn(`Navigation attempt ${attempt} failed: ${err && err.message ? err.message : String(err)}`);
      // brief backoff before retrying
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1500 * attempt));
    }
  }

  if (navError) {
    try {
      await browser.close();
    } catch (e) {}

    // Construct a minimal result object describing the navigation failure so we
    // can still generate a user-facing HTML report explaining the issue.
    const result = {
      url,
      timestamp: new Date().toISOString(),
      error: 'Navigation failed: ' + (navError && navError.message ? navError.message : String(navError)),
      title: null,
      snapPath: null,
      fonts: [],
      fontFaces: [],
      fontMatch: false,
      fontMatchConfidence: 0,
      fontDetection: null,
      colorAudit: [],
      logo: null,
      favicon: null,
      digitalStamp: null,
      colorFailures: [],
      hasSearchBar: false,
      spacings: [],
      spacingMatches: [],
      spacingAccuracy: 0,
      screenshotMobile: '',
      screenshotTablet: '',
      screenshotDesktop: ''
    };

    // Ensure reports directory exists
    try {
      const reportsDir = path.join(process.cwd(), 'reports');
      if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
      fs.writeFileSync(path.join(reportsDir, "color-audit.json"), JSON.stringify(result, null, 2));
    } catch (e) {
      // ignore file write errors
    }

    // Generate an HTML report with the error message so the user can see what happened
    try {
      generateHTMLReport(result);
    } catch (e) {
      // if report generation fails, rethrow the nav error to surface a clear failure
      throw new Error('Navigation failed and report generation failed: ' + (e && e.message ? e.message : String(e)));
    }

    console.log('Navigation failed after retries — an error report was generated.');
    return; // early exit from auditColors
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

  // Initial simple name match for IBM Plex variants
  const simpleNameMatch = fontFacesLower.some(f => {
    if (f.includes('ibm plex')) return true;
    if (f.includes('ibm-plex')) return true;
    if (f.includes('plex') && (f.includes('arabic') || f.includes('sans'))) return true;
    if (/ibm\W*plex/.test(f)) return true;
    return false;
  });

  // Enhanced font detection: sample visible text nodes, check @font-face rules and FontFaceSet availability
  let fontDetection = null;
  try {
    fontDetection = await page.evaluate(() => {
      function isVisible(el) {
        if (!el) return false;
        const s = window.getComputedStyle(el);
        if (!s) return false;
        if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity || '1') === 0) return false;
        if (!el.offsetParent && s.position !== 'fixed') return false;
        return true;
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (!node.parentElement) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          // skip script/style/noscript
          if (parent.closest && parent.closest('script, style, noscript')) return NodeFilter.FILTER_REJECT;
          const style = window.getComputedStyle(parent);
          if (!style) return NodeFilter.FILTER_REJECT;
          if (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity || '1') === 0) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);

      const seen = new Set();
      const samples = [];
      let node;
      const limit = 400;
      while ((node = walker.nextNode()) && samples.length < limit) {
        try {
          const el = node.parentElement;
          if (!el || seen.has(el)) continue;
          seen.add(el);
          if (!isVisible(el)) continue;
          const style = window.getComputedStyle(el);
          const fontFamily = style && style.fontFamily ? style.fontFamily : '';
          const fontWeight = style && style.fontWeight ? style.fontWeight : '';
          const fontStyle = style && style.fontStyle ? style.fontStyle : '';
          samples.push({ fontFamily, fontWeight, fontStyle, text: (el.innerText||'').slice(0,120) });
        } catch (e) { /* ignore per-node errors */ }
      }

      // aggregate family counts
      const familyCounts = {};
      samples.forEach(s => {
        const fam = (s.fontFamily || '').split(',')[0].replace(/['\"]/g, '').trim().toLowerCase();
        if (!fam) return;
        familyCounts[fam] = (familyCounts[fam] || 0) + 1;
      });

      // collect @font-face families
      const sheetFamilies = [];
      try {
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule && rule.type === CSSRule.FONT_FACE_RULE) {
                const val = rule.style.getPropertyValue('font-family') || '';
                const name = val.replace(/['\"]/g, '').trim();
                if (name) sheetFamilies.push(name);
              }
            }
          } catch (e) { /* ignore cross-origin styleSheets */ }
        }
      } catch (e) { /* ignore */ }

      // check document.fonts availability and test common IBM Plex variants
      const available = [];
      const checked = {};
      try {
        if (document.fonts && typeof document.fonts.forEach === 'function') {
          document.fonts.forEach(f => { try { if (f && f.family) available.push(f.family); } catch(e){} });
        }
        const checks = ['IBM Plex Sans Arabic', 'IBM Plex Arabic', 'IBM Plex Sans', 'IBMPlexSans', 'IBMPlexSansArabic'];
        checks.forEach(name => {
          try { checked[name] = !!(document.fonts.check && document.fonts.check(`12px "${name}"`)); } catch(e) { checked[name] = false; }
        });
      } catch (e) { /* ignore */ }

      return { familyCounts, totalSamples: samples.length, sheetFamilies, available, checked };
    });
  } catch (e) {
    fontDetection = null;
  }

  // compute a confidence score based on sampled text nodes
  let fontMatch = simpleNameMatch;
  let fontMatchConfidence = 0;
  if (fontDetection && fontDetection.totalSamples > 0) {
    const total = fontDetection.totalSamples;
    let matchedCount = 0;
    Object.entries(fontDetection.familyCounts).forEach(([fam, cnt]) => {
      if (/ibm.*plex|plex.*arabic|ibmplex/.test(fam)) matchedCount += cnt;
    });
    fontMatchConfidence = Math.round((matchedCount / total) * 100);
    // Consider font available via FontFaceSet checks as high-confidence
    const checkPositive = fontDetection.checked && Object.values(fontDetection.checked).some(Boolean);
    if (checkPositive) fontMatchConfidence = Math.max(fontMatchConfidence, 90);
    // final determination
    fontMatch = simpleNameMatch || checkPositive || fontMatchConfidence >= 30;
  }

  // Attach detection summary to be saved in the result
  const fontDetectionSummary = {
    collectedFamilies: fontFaces,
    sampledFamilies: fontDetection ? fontDetection.familyCounts : {},
    sampleCount: fontDetection ? fontDetection.totalSamples : 0,
    sheetFamilies: fontDetection ? fontDetection.sheetFamilies : [],
    availableFonts: fontDetection ? fontDetection.available : [],
    checked: fontDetection ? fontDetection.checked : {},
    confidence: fontMatchConfidence
  };

  // Detect primary language: prefer <html lang> / meta language; fall back to sampling visible text for Arabic script
  let primaryLanguage = { detected: null, confidence: 0, sample: null };
  try {
    const langData = await page.evaluate(() => {
      const htmlLang = (document.documentElement && document.documentElement.lang) ? document.documentElement.lang.trim().toLowerCase() : null;
      const meta = (document.querySelector('meta[http-equiv="content-language"], meta[name="language"], meta[name="Content-Language"]') || null);
      const metaLang = meta ? (meta.getAttribute('content') || meta.getAttribute('value') || '').trim().toLowerCase() : null;

      // Sample visible text nodes and compute Arabic character ratio
      function isVisibleNode(node) {
        if (!node || !node.parentElement) return false;
        const el = node.parentElement;
        const s = window.getComputedStyle(el);
        if (!s) return false;
        if (s.visibility === 'hidden' || s.display === 'none' || parseFloat(s.opacity || '1') === 0) return false;
        if (!el.offsetParent && s.position !== 'fixed') return false;
        return true;
      }

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
          if (!node || !node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (!isVisibleNode(node)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }, false);

      let text = '';
      let n;
      const limitChars = 8000;
      while ((n = walker.nextNode()) && text.length < limitChars) {
        try { text += ' ' + n.nodeValue.slice(0, 300); } catch (e) { /* ignore */ }
      }

      const arabicMatches = text.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/g) || [];
      const arabicCount = arabicMatches.length;
      const sampleLength = text.length || 1;
      const arabicRatio = arabicCount / sampleLength;

      return { htmlLang, metaLang, sampleLength, arabicCount, arabicRatio };
    });

    // Compute primary language confidence and suggested primary language
    if (langData) {
      const { htmlLang, metaLang, arabicRatio } = langData;
      let confidence = 0;
      let detected = null;
      // If htmlLang or metaLang explicitly indicates Arabic
      if (htmlLang && htmlLang.startsWith('ar')) { detected = 'ar'; confidence = 100; }
      else if (metaLang && metaLang.startsWith('ar')) { detected = 'ar'; confidence = 95; }
      else {
        // Use sampled Arabic ratio heuristic
        const ratio = arabicRatio || 0;
        const pct = Math.min(100, Math.round(ratio * 100));
        confidence = pct;
        if (ratio > 0.20) detected = 'ar'; // if >20% Arabic characters, consider Arabic primary
        else if (ratio > 0.05) detected = 'mixed';
        else detected = 'non-ar';
      }

      primaryLanguage = { detected, confidence, sample: langData };
    }
  } catch (e) {
    // ignore language detection errors
  }

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

  // Collect simple network metrics (request count, transfer size) during the page session
  const networkStats = { requestCount: 0, transferSizeBytes: 0 };
  try {
    page.on('response', async (response) => {
      try {
        networkStats.requestCount += 1;
        const headers = response.headers() || {};
        // content-length may be missing for chunked responses; tolerate that
        const cl = headers['content-length'] || headers['Content-Length'] || headers['content-length'.toUpperCase()];
        if (cl && !isNaN(Number(cl))) networkStats.transferSizeBytes += Number(cl);
      } catch (e) { /* ignore network summary errors */ }
    });
  } catch (e) {
    // ignore if page.on fails
  }

  // Small wait to let late resources finish and the response handler collect sizes
  await page.waitForTimeout(600);

  // Collect performance metrics from the page (FCP, LCP, DCL, load, TTFB, TBT approximation)
  let performanceSummary = null;
  try {
    performanceSummary = await page.evaluate(() => {
      try {
        const perf = window.performance;
        const timing = perf.timing || {};
        const metrics = {
          fcpMs: null,
          lcpMs: null,
          domContentLoadedMs: null,
          loadEventEndMs: null,
          totalBlockingTimeMs: null,
          ttfbMs: null
        };

        // Navigation timings
        if (timing && timing.navigationStart) {
          if (timing.domContentLoadedEventEnd && timing.domContentLoadedEventEnd > timing.navigationStart) {
            metrics.domContentLoadedMs = timing.domContentLoadedEventEnd - timing.navigationStart;
          }
          if (timing.loadEventEnd && timing.loadEventEnd > timing.navigationStart) {
            metrics.loadEventEndMs = timing.loadEventEnd - timing.navigationStart;
          }
          if (timing.responseStart && timing.navigationStart) {
            metrics.ttfbMs = timing.responseStart - timing.navigationStart;
          }
        }

        // Paint entries (First Contentful Paint)
        try {
          const paints = perf.getEntriesByType('paint') || [];
          const fcp = paints.find(p => p.name && p.name.toLowerCase().includes('first-contentful-paint')) || paints[0];
          if (fcp && typeof fcp.startTime === 'number') metrics.fcpMs = Math.round(fcp.startTime);
        } catch (e) { }

        // LCP from entries
        try {
          const lcpEntries = perf.getEntriesByType('largest-contentful-paint') || [];
          const last = lcpEntries[lcpEntries.length - 1];
          if (last && typeof last.startTime === 'number') metrics.lcpMs = Math.round(last.startTime);
        } catch (e) { }

        // TBT estimation using longtask entries (if available). Subtract 50ms threshold per long task
        try {
          const longTasks = perf.getEntriesByType('longtask') || [];
          let tbt = 0;
          longTasks.forEach(lt => {
            const blocking = (lt.duration || 0) - 50;
            if (blocking > 0) tbt += blocking;
          });
          metrics.totalBlockingTimeMs = Math.round(tbt);
        } catch (e) { metrics.totalBlockingTimeMs = null; }

        return metrics;
      } catch (e) {
        return null;
      }
    });
  } catch (e) {
    performanceSummary = null;
  }

  // Attach aggregated network stats to performance summary
  if (!performanceSummary) performanceSummary = {};
  performanceSummary.resourceStats = Object.assign({}, performanceSummary.resourceStats || {}, networkStats);

  // Estimate a simple Speed Index proxy (not Lighthouse-accurate) using weighted FCP/LCP
  try {
    const fcp = performanceSummary && performanceSummary.fcpMs ? performanceSummary.fcpMs : null;
    const lcp = performanceSummary && performanceSummary.lcpMs ? performanceSummary.lcpMs : null;
    const tbt = performanceSummary && performanceSummary.totalBlockingTimeMs ? performanceSummary.totalBlockingTimeMs : 0;
    let speedIndexMs = null;
    if (lcp !== null && lcp !== undefined) {
      // weighted heuristic: LCP dominates perceived speed, include small factor of TBT
      speedIndexMs = Math.round((0.7 * lcp) + (0.3 * (fcp || lcp)) + (0.1 * (tbt || 0)));
    } else if (fcp !== null && fcp !== undefined) {
      speedIndexMs = Math.round(fcp + (0.1 * (tbt || 0)));
    }
    if (speedIndexMs !== null) {
      performanceSummary.speedIndexMs = speedIndexMs;
      performanceSummary.speedIndexSec = +(speedIndexMs / 1000).toFixed(2);
    } else {
      performanceSummary.speedIndexMs = null;
      performanceSummary.speedIndexSec = null;
    }
  } catch (e) {
    // ignore speed index calc errors
    performanceSummary.speedIndexMs = null;
    performanceSummary.speedIndexSec = null;
  }

  // Improved search bar detection BEFORE closing the browser!
  const hasSearchBar = await page.evaluate(() => {
    // Helper to check if an element is visible
    function isVisible(el) {
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
    }
    // Search keywords (Arabic/English)
    const keywords = [
      'search', 'بحث', 'ابحث', 'magnifier', 'fa-search', 'icon-search', 'mdi-search', 'material-icons', 'search-icon', 'svg-search', 'loupe', 'magnifying', '🔍'
    ];
    // Find input elements that look like search bars
    const inputs = Array.from(document.querySelectorAll('input[type="search"], input[type="text"]'));
    for (const input of inputs) {
      if (!isVisible(input)) continue;
      const attrs = [input.name, input.id, input.placeholder, input.getAttribute('aria-label')].map(a => (a || '').toLowerCase());
      if (attrs.some(a => keywords.some(k => a.includes(k)))) return true;
      // Check for a search icon/button nearby
      const parent = input.closest('form, div, section, header, nav');
      if (parent) {
        const btns = Array.from(parent.querySelectorAll('button, svg, i, span'));
        for (const btn of btns) {
          const btnText = (btn.textContent || '').toLowerCase();
          const btnClass = (btn.className || '').toLowerCase();
          const btnAria = (btn.getAttribute('aria-label') || '').toLowerCase();
          if ([btnText, btnClass, btnAria].some(a => keywords.some(k => a.includes(k)))) return true;
        }
      }
    }
    // Also check for forms with role="search"
    if (document.querySelector('form[role="search"]')) return true;
    // Also check for input with autocomplete="search"
    if (document.querySelector('input[autocomplete="search"]')) return true;
    // --- NEW LOGIC: icon-only search bar detection ---
    // Scan for visible SVG, <i>, <span> with search-related classes, aria-labels, or text
    const iconSelectors = ['svg', 'i', 'span'];
    for (const sel of iconSelectors) {
      const icons = Array.from(document.querySelectorAll(sel));
      for (const icon of icons) {
        if (!isVisible(icon)) continue;
        // Safely handle className for SVGs and other elements
        let iconClass = '';
        if (typeof icon.className === 'string') {
          iconClass = icon.className.toLowerCase();
        } else if (icon.className && typeof icon.className.baseVal === 'string') {
          iconClass = icon.className.baseVal.toLowerCase();
        }
        const iconAria = (icon.getAttribute('aria-label') || '').toLowerCase();
        const iconText = (icon.textContent || '').toLowerCase();
        // SVG: check for magnifier path or search-related class/aria/text
        let svgMatch = false;
        if (sel === 'svg') {
          const svgStr = (new XMLSerializer()).serializeToString(icon);
          if (/magnify|search|loupe|🔍/i.test(svgStr) || /fa-search|icon-search|mdi-search|search-icon/i.test(iconClass + iconAria + iconText)) svgMatch = true;
          // Check for common magnifier path (circle + line)
          if (/circle.*line|path.*search/i.test(svgStr)) svgMatch = true;
        }
        if (
          keywords.some(k => iconClass.includes(k) || iconAria.includes(k) || iconText.includes(k)) ||
          svgMatch
        ) {
          // Check if icon is inside or adjacent to a clickable/search container
          const clickable = icon.closest('button, a, form, div, header, nav, section');
          if (clickable && isVisible(clickable)) {
            // If in header/nav/top bar, more likely to be a search bar
            const loc = clickable.closest('header, nav, .topbar, .navbar, .main-header');
            if (loc) return true;
            // If the clickable has only this icon and no other text, likely a search trigger
            if (!clickable.textContent.trim() || clickable.textContent.trim() === icon.textContent.trim()) return true;
          }
        }
      }
    }
    return false;
  });

  // Detect DGA-style digital stamp / authenticated bar structures
  // Valid stamp must have: Saudi flag + number + official text
  let digitalStamp = { present: false, reason: null, selectors: [], images: [], svg: null, qrCount: 0 };
  try {
    digitalStamp = await page.evaluate(() => {
      const result = { present: false, reason: null, selectors: [], images: [], svgs: [], qrCount: 0, score: 0, matchedPhrases: [], matchedSelectors: [], matchedLinks: [] };
      try {
        // Candidate phrases and keywords (Arabic variants commonly used in official stamps)
        const phrases = [
          'موقع حكومي رسمي تابع لحكومة المملكة العربية السعودية',
          'موقع حكومي رسمي',
          'موقع رسمي',
          'تابع لحكومة المملكة العربية السعودية',
          'جهة حكومية',
          'حكومي رسمي',
          'تابع للحكومة',
          'تابع للوزارة',
          'الجهة الرسمية',
          'التابعة للحكومة'
        ];

        // Helper: visible check
        function isVisible(el) {
          try {
            const s = window.getComputedStyle(el);
            return s && s.display !== 'none' && s.visibility !== 'hidden' && (el.offsetParent !== null || s.position === 'fixed');
          } catch (e) { return false; }
        }

        // Scan for phrase matches and record selectors/text
        document.querySelectorAll('body *').forEach(el => {
          try {
            if (!isVisible(el)) return;
            const text = (el.innerText || '').trim();
            if (!text) return;
            for (const p of phrases) {
              if (text.includes(p)) {
                result.matchedPhrases.push({ phrase: p, selector: el.tagName.toLowerCase(), text: text.slice(0, 200) });
                result.matchedSelectors.push(el.tagName.toLowerCase());
              }
            }
            // also look for short official-looking texts
            if (/موقع\s+حكومي|ختم|شعار|موقع\s+رسمي|الجهة\s+الرسمية|حكومي/i.test(text)) {
              result.matchedPhrases.push({ phrase: 'heuristic', selector: el.tagName.toLowerCase(), text: text.slice(0,200) });
            }
            // quick number proximity: short numeric strings that look like registry numbers
            if (/\b\d{2,12}\b/.test(text)) {
              // attach as potential number indicator
              result.matchedPhrases.push({ phrase: 'number', selector: el.tagName.toLowerCase(), text: text.slice(0,80) });
            }
          } catch (e) {}
        });

        // Image/logo detection: alt/src/class hints
        document.querySelectorAll('img').forEach(img => {
          try {
            if (!isVisible(img)) return;
            const src = img.getAttribute('src') || '';
            const alt = (img.getAttribute('alt') || '').toLowerCase();
            const cls = (img.getAttribute('class') || '').toLowerCase();
            const candidate = /flag|علم|saudi|السعود|ksa|gov|logo|شعار|ختم|seal|emblem/i.test(src + ' ' + alt + ' ' + cls);
            if (candidate) {
              try { result.images.push(new URL(src, location.href).href); } catch(e){ result.images.push(src); }
            }
            // simple QR heuristic: nearly square small images
            if (img.naturalWidth && img.naturalHeight && Math.abs(img.naturalWidth - img.naturalHeight) < 20 && img.naturalWidth < 300) {
              result.qrCount = (result.qrCount || 0) + 1;
            }
          } catch (e) {}
        });

        // SVG scanning
        document.querySelectorAll('svg').forEach(svg => {
          try {
            if (!isVisible(svg)) return;
            const svgStr = (new XMLSerializer()).serializeToString(svg);
            // look for green fills or text mentions
            if (/السعودية|المملكة|علم|ختم|شعار|الجهة|حكومي/i.test(svgStr) || /fill\s*[:=]\s*#[0-9a-f]{3,6}/i.test(svgStr)) {
              result.svgs.push(svgStr.slice(0, 1000));
            }
          } catch (e) {}
        });

        // Links that reference gov.sa or known government hosts
        document.querySelectorAll('a[href]').forEach(a => {
          try {
            const href = a.getAttribute('href') || '';
            if (/\.gov\.sa|gov\.sa|govsa|moj\.gov|mofa\.gov|gov-i/i.test(href)) {
              result.matchedLinks.push(href);
            }
          } catch (e) {}
        });

        // Class/id heuristics for containers or headers
        document.querySelectorAll('header, nav, .topbar, .navbar, .gov-header, .official, .government, .stamp, .seal, .site-stamp').forEach(el => {
          try {
            if (!isVisible(el)) return;
            const cls = (el.getAttribute && (el.getAttribute('class') || '')).toLowerCase();
            const id = (el.getAttribute && (el.getAttribute('id') || '')).toLowerCase();
            if (/gov|حكومي|رسمي|شعار|ختم|الجهة/.test(cls + ' ' + id)) {
              result.matchedSelectors.push(el.tagName.toLowerCase());
            }
          } catch (e) {}
        });

        // Compute confidence score from heuristics
        try {
          let score = 0;
          if (result.matchedPhrases && result.matchedPhrases.length) score += Math.min(60, result.matchedPhrases.length * 20);
          if (result.images && result.images.length) score += Math.min(30, result.images.length * 10);
          if (result.svgs && result.svgs.length) score += 15;
          if (result.matchedLinks && result.matchedLinks.length) score += 15;
          if (result.qrCount && result.qrCount > 0) score += 5;
          if (score > 100) score = 100;
          result.score = score;
          // Determine presence threshold: require >= 60 or phrase+image+number combination
          const hasPhrase = result.matchedPhrases.some(m => m.phrase && m.phrase !== 'number');
          const hasNumber = result.matchedPhrases.some(m => m.phrase === 'number');
          const hasImage = result.images.length > 0 || result.svgs.length > 0;
          if (score >= 60 || (hasPhrase && hasNumber && hasImage)) {
            result.present = true;
            result.reason = 'موقع موثق: تم العثور على دلائل نصية/صورية متسقة مع ختم/شعار رسمي.';
          } else {
            const missing = [];
            if (!hasPhrase) missing.push('النص الرسمي');
            if (!hasNumber) missing.push('الرقم/معرف');
            if (!hasImage) missing.push('علم/شعار');
            result.present = false;
            result.reason = `غير موثق - نقص الأدلة: ${missing.join(', ')}`;
          }
        } catch (e) { /* ignore scoring errors */ }
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

  // Sitemap detection: check robots.txt for Sitemap: entries, try common sitemap paths, and scan page links
  let sitemapUrls = [];
  try {
    const purl = await page.url();
    const origin = (new URL(purl)).origin;
    // 1) robots.txt
    try {
      const robotsUrl = `${origin}/robots.txt`;
      const r = await context.request.get(robotsUrl, { timeout: 10000 }).catch(()=>null);
      if (r && r.ok()) {
        const text = await r.text().catch(()=>'');
        const lines = text.split(/\r?\n/);
        for (const line of lines) {
          const m = line.match(/^\s*Sitemap:\s*(\S+)/i);
          if (m && m[1]) {
            try { sitemapUrls.push(new URL(m[1], origin).href); } catch(e) { sitemapUrls.push(m[1]); }
          }
        }
      }
    } catch (e) { /* ignore robots failures */ }

    // 2) common sitemap locations
    const candidates = [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`, `${origin}/sitemap/sitemap.xml`, `${origin}/sitemap.xml.gz`];
    for (const cand of candidates) {
      try {
        const resp = await context.request.get(cand, { timeout: 8000 }).catch(()=>null);
        if (resp && resp.ok()) {
          const ct = (resp.headers()['content-type'] || '').toLowerCase();
          if (ct.includes('xml') || ct.includes('text') || cand.endsWith('.xml.gz')) {
            sitemapUrls.push(cand);
          }
        }
      } catch (e) { /* ignore */ }
    }

    // 3) scan page for <link rel="sitemap"> and anchor hrefs containing sitemap
    try {
      const pageSitemaps = await page.evaluate(() => {
        const found = [];
        try {
          const links = Array.from(document.querySelectorAll('link[rel="sitemap"], link[rel="alternate"][type*="xml"], a'));
          links.forEach(l => {
            try {
              const href = l.getAttribute && l.getAttribute('href') ? l.getAttribute('href') : (l.href || '');
              if (!href) return;
              if (/sitemap|sitemap_index|site-map|\.xml(\?|$)/i.test(href)) found.push(href);
            } catch(e){}
          });
        } catch(e){}
        return found;
      });
      if (pageSitemaps && pageSitemaps.length) {
        pageSitemaps.forEach(u => {
          try { sitemapUrls.push(new URL(u, origin).href); } catch(e) { sitemapUrls.push(u); }
        });
      }
    } catch (e) { /* ignore page scan errors */ }

    // dedupe
    sitemapUrls = Array.from(new Set(sitemapUrls));
  } catch (e) {
    // ignore sitemap discovery errors
    sitemapUrls = sitemapUrls || [];
  }

    // Template-match detection: optionally compare the live page to a provided React
    // template file. Place your component/source at `config/template-to-match.jsx`.
    // The detector extracts Dga* component names and className tokens from the
    // template and checks for their presence in the rendered page (by class
    // substring, id substring, or visible text). Results are attached as
    // `result.templateMatch` (tokensCount, matchedTokens, missingTokens, score).
    let templateMatch = null;
    try {
      const tplPath = path.join(process.cwd(), 'config', 'template-to-match.jsx');
      if (fs.existsSync(tplPath)) {
        try {
          const tpl = fs.readFileSync(tplPath, 'utf-8');
          // Extract component-like tokens (e.g., DgaNavHeader, DgaButton)
          const compMatches = Array.from(new Set((tpl.match(/Dga[A-Za-z0-9_]+/g) || [])));

          // Extract className="..." values and split into tokens
          const classMatches = [];
          const classRe = /className\s*=\s*(?:\{|)\s*[`'\"]([^`'\"]+)['\"]?\s*(?:\}|)/g;
          let cm;
          while ((cm = classRe.exec(tpl)) !== null) {
            try {
              const parts = (cm[1] || '').split(/\s+/).map(s => s.trim()).filter(Boolean);
              parts.forEach(p => classMatches.push(p));
            } catch (e) {}
          }

          // Also collect quoted strings that look useful (logo paths, copyright snippets)
          const literalMatches = [];
          const litRe = /['`\"]([^'`\"]{4,200})['`\"]/g;
          let lm;
          while ((lm = litRe.exec(tpl)) !== null) {
            const v = lm[1] || '';
            if (/logo|mobile-logo|All Right Reserved|Digital Government|dga-|saudigazette|saudi/i.test(v)) {
              literalMatches.push(v);
            }
          }

          // Build final token list (components + frequent class tokens + literals)
          const classCounts = {};
          classMatches.forEach(c => { classCounts[c] = (classCounts[c] || 0) + 1; });
          const sortedClassTokens = Object.keys(classCounts).sort((a,b)=>classCounts[b]-classCounts[a]).slice(0,40);
          const tokens = Array.from(new Set([...(compMatches||[]), ...sortedClassTokens, ...literalMatches])).slice(0,200);

          if (tokens.length > 0) {
            // Evaluate presence of tokens in the rendered page
            const check = await page.evaluate((tokensIn) => {
              const found = [];
              try {
                const bodyText = (document.body && document.body.innerText) ? document.body.innerText.toLowerCase() : '';
                for (const t of tokensIn) {
                  if (!t) continue;
                  const tl = String(t).toLowerCase();
                  let ok = false;
                  try {
                    // Class substring match
                    if (document.querySelector('[class*="' + tl + '"]')) ok = true;
                  } catch (e) {}
                  if (!ok) {
                    try {
                      // id substring
                      if (document.querySelector('[id*="' + tl + '"]')) ok = true;
                    } catch (e) {}
                  }
                  if (!ok) {
                    try {
                      // text content match
                      if (bodyText.indexOf(tl) !== -1) ok = true;
                    } catch (e) {}
                  }
                  if (!ok) {
                    try {
                      // fallback: attribute contains (class/id/data-*/aria-label)
                      const attrs = Array.from(document.querySelectorAll('[class],[id],[aria-label],[data-*]'));
                      for (const el of attrs) {
                        try {
                          const cs = (el.getAttribute('class')||'').toLowerCase();
                          const id = (el.id||'').toLowerCase();
                          const aria = (el.getAttribute('aria-label')||'').toLowerCase();
                          if (cs.indexOf(tl) !== -1 || id.indexOf(tl) !== -1 || aria.indexOf(tl) !== -1) { ok = true; break; }
                        } catch(e){}
                      }
                    } catch(e){}
                  }
                  if (ok) found.push(t);
                }
              } catch (e) {}
              return { found };
            }, tokens);

            const matchedTokens = (check && check.found) ? check.found : [];
            const missingTokens = tokens.filter(t => !matchedTokens.includes(t));
            const score = Math.round((matchedTokens.length / (tokens.length || 1)) * 100);
            templateMatch = { tokensCount: tokens.length, matchedTokens, missingTokens, score };
          }
        } catch (e) {
          // ignore template read/parse errors
        }
      }
    } catch (e) {
      // ignore overall template detection errors
      templateMatch = null;
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

  // Prepare language suggestions based on detection
  const languageSuggestions = [];
  try {
    const detected = primaryLanguage && primaryLanguage.detected ? primaryLanguage.detected : null;
    const conf = primaryLanguage && primaryLanguage.confidence ? primaryLanguage.confidence : 0;
    if (detected !== 'ar') {
      languageSuggestions.push('اجعل اللغة الأساسية للموقع العربية: أضف `lang="ar"` على وسم `<html>` ليعرّف المحتوى كلغة رئيسية.');
      languageSuggestions.push('قدّم محتوى الترجمة العربية في المسارات الرئيسية: عنوان الصفحة، التنقل، والنماذج الأساسية.');
      languageSuggestions.push('تأكد من ضبط اتجاه الكتابة إلى RTL عبر `dir="rtl"` عندما تكون اللغة العربية هي الأساسية.');
      languageSuggestions.push('أضف الوسوم التعريفية المناسبة: `meta name="language" content="ar"` أو `meta http-equiv="content-language" content="ar"`.');
      if (conf < 30) {
        languageSuggestions.push('نسبة النص العربي الحالية منخفضة — راجع محتوى النصوص الأساسية وضع ترجمة عربية واضحة أو إعادة صياغة المحتوى العربي.');
      }
    }
  } catch (e) {
    // ignore suggestion assembly errors
  }

  const result = {
    url,
    title,
    snapPath: snapFile,
    timestamp: new Date().toISOString(),
    fonts,
    fontFaces,
    fontMatch,
    fontMatchConfidence: (typeof fontDetectionSummary !== 'undefined' && fontDetectionSummary && fontDetectionSummary.confidence) ? fontDetectionSummary.confidence : 0,
    fontDetection: (typeof fontDetectionSummary !== 'undefined') ? fontDetectionSummary : null,
    primaryLanguage: primaryLanguage && primaryLanguage.detected ? primaryLanguage.detected : null,
    primaryLanguageConfidence: primaryLanguage && primaryLanguage.confidence ? primaryLanguage.confidence : 0,
    languageSample: primaryLanguage && primaryLanguage.sample ? primaryLanguage.sample : null,
    languageSuggestions: languageSuggestions,
    colorAudit,
    sitemapUrls: sitemapUrls || [],
    templateMatch: templateMatch,
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

  // Attach performance summary collected earlier
  try {
    result.performance = { metrics: performanceSummary || null, resourceStats: networkStats };
  } catch (e) {
    result.performance = { metrics: null, resourceStats: { requestCount: 0, transferSizeBytes: 0 } };
  }

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