import fs from "fs";
import { chromium } from "playwright";
import { generateHTMLReport } from "../utils/reporter.js";

export async function auditSite(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  // Extract fonts and colors
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

  const title = await page.title();
  const snapFile = `snap-${Date.now()}.png`;
  const snapPath = `reports/${snapFile}`;
  await page.screenshot({ path: snapPath, fullPage: true });

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
