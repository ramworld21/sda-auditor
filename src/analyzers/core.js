import fs from "fs";
import { chromium } from "playwright";
import { generateHTMLReport } from "../utils/reporter.js";

export async function auditSite(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  // Use faster navigation and shorter timeout
  await page.goto(url, { waitUntil: "load", timeout: 30000 });

  // Sample a limited set of elements (headings, links, buttons, inputs, body) to speed up extraction
  const { fonts, colors } = await page.evaluate(() => {
    const fontSet = new Set();
    const colorSet = new Set();
    const selectors = ['body', 'h1,h2,h3,h4,h5,h6', 'a', 'button', 'input,textarea,select'];
    const nodeList = [];
    selectors.forEach(sel => document.querySelectorAll(sel).forEach(el => nodeList.push(el)));
    // Fallback: first 150 elements
    if (nodeList.length < 100) document.querySelectorAll('*').forEach((el, i) => { if (i < 150) nodeList.push(el); });
    nodeList.slice(0, 300).forEach(el => {
      try {
        const s = getComputedStyle(el);
        fontSet.add(s.fontFamily);
        colorSet.add(s.color);
      } catch (e) {}
    });
    return { fonts: Array.from(fontSet), colors: Array.from(colorSet) };
  });

  const title = await page.title();
  const snapFile = `snap-${Date.now()}.png`;
  const snapPath = `reports/${snapFile}`;
  await page.screenshot({ path: snapPath });

  const result = {
    url,
    title,
    snapPath: snapFile, // or snapPath if you want the full path
    timestamp: new Date().toISOString(),
    fonts,
    colors
  };
  generateHTMLReport(result);

  console.log("Audit done. JSON + HTML reports generated.");
  await browser.close();
}
