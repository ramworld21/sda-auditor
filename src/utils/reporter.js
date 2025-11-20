import fs from "fs";

export function generateHTMLReport(result) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Audit Report - ${result.title || ''}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 2rem; background: #f5f5f5; }
        .card { background: white; padding: 1.5rem; border-radius: 12px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); margin-bottom: 1.5rem; }
        h1 { color: #004990; }
        img { max-width: 100%; border: 1px solid #ccc; border-radius: 8px; }
        .meta { color: #666; font-size: 0.9em; }
        .swatch { display: inline-block; width: 24px; height: 24px; border: 1px solid #aaa; vertical-align: middle; margin-right: 8px; }
        .match { background: #d4edda; }
        .no-match { background: #f8d7da; }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Audit Report</h1>
        <p class="meta">URL: <a href="${result.url}" target="_blank">${result.url}</a></p>
        <p class="meta">Timestamp: ${result.timestamp}</p>
        <p class="meta">Title: ${result.title || 'N/A'}</p>
      </div>
      <div class="card">
        <h2>Font Comparison</h2>
        <p><strong>Fonts found:</strong> ${(result.fonts || []).join(', ')}</p>
        <p><strong>Matches brand font ("IBM Plex Sans"):</strong> ${result.fontMatch ? '✔️ Yes' : '❌ No'}</p>
      </div>
      ${result.colorAudit && result.colorAudit.length ? `
        <div class="card">
          <h2>Color Match Table</h2>
          <table>
            <thead>
              <tr>
                <th>Website Color</th>
                <th>Closest Brand Color</th>
                <th>Distance</th>
                <th>Match</th>
              </tr>
            </thead>
            <tbody>
              ${result.colorAudit.map(r => `
                <tr class="${r.match ? 'match' : 'no-match'}">
                  <td><span class="swatch" style="background:${r.color}"></span>${r.color}</td>
                  <td>${r.closest ? `<span class="swatch" style="background:${r.closest}"></span>${r.closest}` : '-'}</td>
                  <td>${r.distance !== null ? r.distance.toFixed(1) : '-'}</td>
                  <td>${r.match ? '✔️' : '❌'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : ''}
      <div class="card">
        <h2>Search Bar Audit</h2>
        <p class="meta"><strong>Search Bar Present:</strong> ${result.hasSearchBar ? '✔️ Yes' : '❌ No'}</p>
      </div>
      <div class="card">
        <h2>Spacing Audit</h2>
        <p><strong>How Spacing Was Measured:</strong></p>
        <ul>
          <li>All <strong>margin</strong> and <strong>padding</strong> values were extracted from every element on the page using automated browser inspection.</li>
          <li>Each value was compared against the official Saudi DGA spacing tokens: <span style="font-family:monospace">4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 128px, 160px, 192px, 256px</span>.</li>
          <li>Accuracy = (number of matches / total measured spacings) × 100.</li>
        </ul>
        <p><strong>Accuracy:</strong> ${typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy.toFixed(1) + '%' : 'N/A'}</p>
        <p><strong>Matched Spacing Values:</strong> ${(result.spacingMatches && result.spacingMatches.length) ? result.spacingMatches.join(', ') : 'N/A'}</p>
        <p><strong>Diagnosis:</strong> ${(() => {
          if (result.spacingAccuracy > 80) return 'تطبيق المسافات جيد حسب النظام';
          if (result.spacingAccuracy > 50) return 'تطبيق المسافات متوسط حسب النظام';
          return 'لم يتم تطبيق المسافات حسب النظام';
        })()}</p>
      </div>
      <div class="card">
        <h2>التصميم المتجاوب (Responsive Design Test)</h2>
        <p>تم اختبار توافق الموقع مع الأجهزة التالية:</p>
        <div style="display:flex; flex-wrap:wrap; gap:2rem; justify-content:center;">
          <div style="text-align:center;">
            <div style="width:220px; height:440px; background:#222; border-radius:32px; box-shadow:0 4px 16px #0003; padding:16px; margin-bottom:8px; position:relative; display:flex; align-items:center; justify-content:center;">
              <img src="${result.screenshotMobile || ''}" alt="Mobile Screenshot" style="width:188px; height:400px; object-fit:cover; border-radius:24px; background:#fff; box-shadow:0 2px 8px #0001;">
              <span style="position:absolute;top:12px;left:50%;transform:translateX(-50%);color:#fff;font-size:1em;font-weight:bold;">جوال</span>
            </div>
            <span style="font-size:0.95em; color:#004990;">جوال (375x812)</span>
          </div>
          <div style="text-align:center;">
            <div style="width:320px; height:240px; background:#222; border-radius:24px; box-shadow:0 4px 16px #0003; padding:16px; margin-bottom:8px; position:relative; display:flex; align-items:center; justify-content:center;">
              <img src="${result.screenshotTablet || ''}" alt="Tablet Screenshot" style="width:288px; height:192px; object-fit:cover; border-radius:16px; background:#fff; box-shadow:0 2px 8px #0001;">
              <span style="position:absolute;top:12px;left:50%;transform:translateX(-50%);color:#fff;font-size:1em;font-weight:bold;">تابلت</span>
            </div>
            <span style="font-size:0.95em; color:#004990;">تابلت (768x1024)</span>
          </div>
          <div style="text-align:center;">
            <div style="width:420px; height:260px; background:#222; border-radius:16px; box-shadow:0 4px 16px #0003; padding:16px; margin-bottom:8px; position:relative; display:flex; align-items:center; justify-content:center;">
              <img src="${result.screenshotDesktop || ''}" alt="Desktop Screenshot" style="width:388px; height:192px; object-fit:cover; border-radius:8px; background:#fff; box-shadow:0 2px 8px #0001;">
              <span style="position:absolute;top:12px;left:50%;transform:translateX(-50%);color:#fff;font-size:1em;font-weight:bold;">ديسكتوب</span>
            </div>
            <span style="font-size:0.95em; color:#004990;">ديسكتوب (1440x900)</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>Screenshot</h2>
        <img src="${result.snapPath}" alt="Screenshot">
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync('reports/report.html', html, 'utf-8');
  console.log("✅ HTML report saved in reports/report.html");
}
