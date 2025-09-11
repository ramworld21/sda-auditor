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
        <h2>Screenshot</h2>
        <img src="${result.snapPath}" alt="Screenshot">
      </div>
      <div class="card">
        <h2>Search Bar Audit</h2>
        <p class="meta"><strong>Search Bar Present:</strong> ${result.hasSearchBar ? '✔️ Yes' : '❌ No'}</p>
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync('reports/report.html', html, 'utf-8');
  console.log("✅ HTML report saved in reports/report.html");
}
