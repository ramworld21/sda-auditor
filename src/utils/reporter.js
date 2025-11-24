import fs from "fs";

export function generateHTMLReport(result) {
  const colorMatches = (result.colorAudit || []).filter(r => r.match).length;
  const colorTotal = (result.colorAudit || []).length;
  const colorAccuracy = colorTotal ? ((colorMatches / colorTotal) * 100).toFixed(1) : 'N/A';
  const accuracyVal = colorTotal ? parseFloat(((colorMatches / colorTotal) * 100).toFixed(1)) : 0;
  const accuracyColor = (colorTotal && accuracyVal > 60) ? '#16a34a' : 'var(--accent)';
    // Updated Ramworld logo
    const ramworldLogo = 'https://ramworld.net/Ramworld_Logo_Main.png';
    // Try to extract entity logo from result data with fallbacks
    let entityLogo = result.logo || '';
    if (!entityLogo && result.favicon) entityLogo = result.favicon;
    if (!entityLogo && result.url) {
      try {
        const { origin } = new URL(result.url);
        entityLogo = `${origin}/favicon.ico`;
      } catch (err) {
        // ignore URL parsing errors
      }
    }
    if (!entityLogo) entityLogo = 'https://via.placeholder.com/80x48?text=Logo';
  const fullScreenshot = result.snapPath || '';
  const responsiveScreens = [
    { label: 'جوال (375x812)', src: result.screenshotMobile || '', key: 'mobile' },
    { label: 'تابلت (768x1024)', src: result.screenshotTablet || '', key: 'tablet' },
    { label: 'ديسكتوب (1440x900)', src: result.screenshotDesktop || '', key: 'desktop' }
  ].filter(s => s.src);
  // Determine document language and direction
  const isRTL = (s) => /[\u0591-\u08FF]/.test(s || '');
  const detectedLang = result.pageLang || (isRTL(result.title || '') ? 'ar' : 'en');
  const detectedDir = isRTL(detectedLang) || detectedLang.startsWith('ar') ? 'rtl' : 'ltr';
  const html = `
    <!DOCTYPE html>
    <html lang="${detectedLang}" dir="${detectedDir}">
    <head>
      <meta charset="UTF-8">
      <title>تقرير الفحص - ${result.title || ''}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #dbe3f0ff;
          --accent: #2db9db;
          --muted: #6b7280;
        }
        body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; margin: 0; background: #f4f7fb; direction: ${detectedDir}; color: #0f1724; }
        .header { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(90deg,var(--primary), rgba(255, 255, 255, 0.85)); color:#fff; padding:20px 28px; }
        .header img { height: 42px; }
        .report-title { font-size: 1.6rem; color: #fff; font-weight: 700; margin: 0; }
        .container { max-width: 980px; margin: 18px auto; padding: 18px; }
        .card { background: white; padding: 1.25rem; border-radius: 12px; box-shadow: 0 6px 24px rgba(15,23,36,0.06); margin-bottom: 1.25rem; border: 1px solid rgba(15,23,36,0.04); }
        h2 { color: var(--primary); margin-top: 0; }
        .meta { color: var(--muted); font-size: 0.98em; margin-bottom: 8px; }
        .swatch { display: inline-block; width: 24px; height: 24px; border: 1px solid #aaa; vertical-align: middle; margin-right: 8px; border-radius: 6px; }
        .match { background: #e6fff7; }
        .no-match { background: #ffe6e6; }
        .accuracy-bar { background: #eaf6fb; border-radius: 8px; height: 18px; margin: 8px 0 18px 0; position: relative; }
        .accuracy-fill { background: var(--accent); height: 100%; border-radius: 8px; transition: width .4s; }
        .accuracy-label { position: absolute; left: 50%; top: 0; transform: translateX(-50%); color: var(--primary); font-weight: 600; font-size: 1em; }
        .dropdown { margin-bottom: 18px; }
        select { font-size: 1em; padding: 6px 14px; border-radius: 8px; border: 1px solid #e6eefc; background: #f6f9ff; color: var(--primary); }
        .responsive-img { width: 100%; max-width: 420px; border-radius: 16px; box-shadow: 0 4px 16px #0003; background: #fff; margin-bottom: 8px; }
        .responsive-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .responsive-cell { background:#fff;padding:12px;border-radius:12px; }
        /* Hide interactive controls when printing/exporting to PDF */
        @media print {
          .btn, .actions, .dropdown { display: none !important; }
        }
        /* Also support client-side export which toggles this class */
        .pdf-export .btn, .pdf-export .actions, .pdf-export .dropdown { display: none !important; }
        .thumbnail { width: 140px; height: 92px; object-fit: cover; border-radius: 10px; border: 2px solid var(--accent); cursor: pointer; transition: box-shadow .18s; }
        .thumbnail:hover { box-shadow: 0 2px 12px var(--accent); }
        .actions { display: flex; gap: 12px; margin-top: 10px; }
        .btn { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 1em; cursor: pointer; font-weight: 600; transition: background .18s; }
        .btn:hover { background: #1ca1c2; }
        .footer { background: #fff; border-top: 2px solid var(--accent); padding: 18px 32px; display: flex; align-items: center; justify-content: space-between; font-size: 1em; color: var(--muted); }
        .footer .info { display: flex; flex-direction: column; gap: 2px; }
        .footer img { height: 32px; margin-left: 18px; }
        @media (max-width: 700px) {
          .header, .footer { flex-direction: column; align-items: flex-start; padding: 12px 8px; }
          .container { padding: 12px 8px; }
          .responsive-grid { grid-template-columns: 1fr; }
        }
      </style>
      <script>
        function showFullScreenshot(src) {
          const win = window.open('', '_blank');
          win.document.write('<img src="' + src + '" style="width:100%;max-width:1200px;display:block;margin:auto;">');
        }
        function downloadImage(src, name) {
          const a = document.createElement('a');
          a.href = src; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
        }
        async function exportPDF() {
          // Try server-side high-fidelity PDF first (best for Arabic/fonts/complex layout)
          const origin = (window.location && window.location.protocol === 'file:') ? 'http://localhost:3001' : window.location.origin;
          try {
            const resp = await fetch(origin + '/report-pdf');
            if (resp.ok) {
              const blob = await resp.blob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'audit-report.pdf';
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
              return;
            }
            console.warn('Server-side PDF endpoint returned non-OK:', resp.status);
          } catch (e) {
            console.warn('Server-side PDF generation failed, falling back to client export:', e);
          }

          // Fallback: client-side render using jsPDF + html2canvas
          if (!window.jspdf || !window.jspdf.jsPDF) {
            alert('jsPDF library not loaded. تصدير PDF غير متاح.');
            return;
          }
          const reportNode = document.getElementById('report-root');
          if (!reportNode) {
            alert('لم يتم العثور على محتوى التقرير.');
            return;
          }
          const { jsPDF } = window.jspdf;
          const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
          const spinner = document.createElement('div');
          spinner.innerHTML = '<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(255,255,255,0.7);display:flex;align-items:center;justify-content:center;"><span style="font-size:2em;color:#2db9db">جاري إنشاء PDF...</span></div>';
          document.body.appendChild(spinner);
          const contentWidth = reportNode.scrollWidth || reportNode.offsetWidth || 900;
          const canvasScale = Math.min(1, 560 / Math.max(contentWidth, 1));
          try {
            // add class to hide interactive controls during client-side rendering
            document.documentElement.classList.add('pdf-export');
            await doc.html(reportNode, {
              callback: (docRef) => docRef.save('audit-report.pdf'),
              margin: [20, 20, 20, 20],
              autoPaging: 'slice',
              x: 10,
              y: 10,
              width: 555,
              windowWidth: contentWidth,
              html2canvas: {
                scale: Math.max(canvasScale, 0.5),
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
              }
            });
          } catch (err) {
            console.error('PDF generation failed', err);
            alert('فشل إنشاء ملف PDF: ' + err);
          } finally {
            document.body.removeChild(spinner);
            document.documentElement.classList.remove('pdf-export');
          }
        }
        function switchResponsive() {
          const sel = document.getElementById('responsive-select');
          const img = document.getElementById('responsive-img');
          img.src = sel.value;
        }
      </script>
    </head>
    <body>
      <div id="report-root">
      <div class="header">
        <img src="${entityLogo}" alt="Entity Logo" style="height:48px;max-width:120px;object-fit:contain;">
        <span class="report-title">تقرير الفحص</span>
        <img src="${ramworldLogo}" alt="Ramworld Logo" style="height:48px;max-width:120px;object-fit:contain;">
      </div>
      <div class="container">
        <div class="card">
          <div class="meta">URL: <a href="${result.url}" target="_blank">${result.url}</a></div>
          <div class="meta">Timestamp: ${result.timestamp}</div>
          <div class="meta">Title: ${result.title || 'N/A'}</div>
        </div>
        <div class="card">
          <h2>مقارنة الخطوط</h2>
          <div class="meta"><strong>نتيجة الكشف عن خط الهوية (IBM Plex):</strong> ${result.fontMatch ? '✔️ مكتشف' : '❌ غير مكتشف'}</div>
        </div>
        ${colorTotal ? `
        <div class="card">
          <h2>جدول مطابقة الألوان</h2>
          <div class="meta"><strong>Color Accuracy:</strong> ${colorAccuracy}%</div>
          <div class="accuracy-bar"><div class="accuracy-fill" style="width:${colorAccuracy}%;background:${accuracyColor}"></div><span class="accuracy-label" style="color:${accuracyColor}">${colorAccuracy}%</span></div>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:var(--accent);color:#fff;">
                <th>لون الموقع</th>
                <th>أقرب لون للهوية</th>
                <th>المسافة</th>
                <th>مطابقة</th>
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
        <!-- Removed unique color set display per request -->
        <div class="card">
          <h2>ختم/شريط المصادقة (Digital Stamp)</h2>
          <div class="meta"><strong>موجود:</strong> ${result.digitalStamp && result.digitalStamp.present ? '✔️ موجود' : '❌ غير موجود'}</div>
          <div class="meta"><strong>سبب الكشف:</strong> ${result.digitalStamp && result.digitalStamp.reason ? result.digitalStamp.reason : 'N/A'}</div>
          ${result.digitalStamp && result.digitalStamp.selectors && result.digitalStamp.selectors.length ? `<div style="margin-top:8px"><strong>العناصر المكتشفة (قائمة مختصرة):</strong><ul>${result.digitalStamp.selectors.slice(0,6).map(s => `<li><code style="font-size:13px">${s.selector}</code> — <span style="display:inline-block;max-width:60%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;vertical-align:middle">${(s.text||'').replace(/\n/g,' ').trim()}</span></li>`).join('')}</ul></div>` : ''}
          ${result.digitalStamp && result.digitalStamp.images && result.digitalStamp.images.length ? `<div style="margin-top:10px;display:flex;flex-wrap:wrap;gap:10px">${result.digitalStamp.images.slice(0,6).map(src=>`<img src="${src}" style="width:120px;height:80px;object-fit:contain;border-radius:8px;border:1px solid #eee;background:#fff">`).join('')}</div>` : ''}
          ${result.logo ? `<div style="margin-top:10px"><strong>شعار محفوظ:</strong><div><img src="${result.logo}" style="width:120px;height:80px;object-fit:contain;border-radius:8px;border:1px solid #eee;background:#fff"></div></div>` : ''}
        </div>
        <div class="card">
          <h2>تدقيق شريط البحث</h2>
          <div class="meta"><strong>Search Bar Present:</strong> ${result.hasSearchBar ? '✔️ Yes' : '❌ No'}</div>
        </div>
        <div class="card">
          <h2>تدقيق المسافات</h2>
          <ul>
            <li>تم استخراج جميع قيم <strong>margin</strong> و <strong>padding</strong> من كل عنصر في الصفحة.</li>
            <li>تمت مقارنة كل قيمة مع رموز المسافات الرسمية: <span style="font-family:monospace">4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 80px, 96px, 128px, 160px, 192px, 256px</span>.</li>
            <li>الدقة = (عدد القيم المطابقة / إجمالي القيم المقاسة) × 100.</li>
          </ul>
          <div class="meta"><strong>Accuracy:</strong> ${typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy.toFixed(1) + '%' : 'N/A'}</div>
          <div class="meta"><strong>Matched Spacing Values:</strong> ${(result.spacingMatches && result.spacingMatches.length) ? result.spacingMatches.join(', ') : 'N/A'}</div>
          <div class="meta"><strong>Diagnosis:</strong> ${(() => {
            if (result.spacingAccuracy > 80) return 'تطبيق المسافات جيد حسب النظام';
            if (result.spacingAccuracy > 50) return 'تطبيق المسافات متوسط حسب النظام';
            return 'لم يتم تطبيق المسافات حسب النظام';
          })()}</div>
        </div>
        <div class="card">
          <h2>اختبار التصميم المتجاوب</h2>
          <div class="responsive-grid">
            ${responsiveScreens.map(s => `
              <div class="responsive-cell">
                <div class="meta">${s.label}</div>
                <img src="${s.src}" style="width:100%;height:auto;border-radius:12px;box-shadow:0 6px 20px rgba(0,0,0,0.08);background:#fff;" alt="${s.label}">
                <div style="margin-top:8px;"><button class="btn" onclick="showFullScreenshot('${s.src}')">عرض</button> <button class="btn" onclick="downloadImage('${s.src}','${s.key}-screenshot.png')">تحميل</button></div>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="card">
          <h2>صورة كاملة للصفحة</h2>
          <img src="${fullScreenshot}" class="thumbnail" alt="Full Screenshot" onclick="showFullScreenshot('${fullScreenshot}')">
          <div class="actions">
            <button class="btn" onclick="showFullScreenshot('${fullScreenshot}')">عرض بالحجم الكامل</button>
            <button class="btn" onclick="downloadImage('${fullScreenshot}','full-screenshot.png')">تحميل PNG</button>
            <button class="btn" onclick="exportPDF()">تصدير إلى PDF</button>
          </div>
        </div>
        ${result.colorFailures && result.colorFailures.length ? `
        <div class="card">
          <h2>ألوان غير متوافقة — مواقع الظهور</h2>
          <div class="meta">تم تصوير أول عنصر لكل لون غير متوافق. انقر على الصورة لعرضها بالحجم الكامل.</div>
          <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:12px">${result.colorFailures.map(cf => `
            <div style="width:220px;background:#fff;border:1px solid #eee;padding:8px;border-radius:10px;box-shadow:0 4px 12px rgba(2,6,23,0.04);">
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;"><div class="swatch" style="background:${cf.color};width:28px;height:28px;border-radius:6px;border:1px solid #ddd"></div><div style="font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${cf.color}</div></div>
              <img src="${cf.screenshot}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;cursor:pointer" onclick="showFullScreenshot('${cf.screenshot}')">
              <div style="margin-top:8px;font-size:12px;color:var(--muted);max-height:48px;overflow:hidden">${cf.snippet ? cf.snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''}</div>
              <div style="margin-top:8px;font-size:12px;color:var(--muted)"><strong>Selector:</strong> <code style="font-size:12px">${cf.selector || 'N/A'}</code></div>
              <div style="margin-top:4px;font-size:12px;color:var(--muted)"><strong>Rect:</strong> ${cf.rect ? `x:${Math.round(cf.rect.x)}, y:${Math.round(cf.rect.y)}, w:${Math.round(cf.rect.width)}, h:${Math.round(cf.rect.height)}` : 'N/A'}</div>
              <div style="margin-top:8px"><a href="${cf.screenshot}" target="_blank" class="btn" style="display:inline-block;padding:8px 10px;font-size:13px">فتح الصورة</a></div>
            </div>
          `).join('')}</div>
        </div>
        ` : ''}
      </div>
      <div class="footer">
        <div class="info">
          <div>info@ramworld.net</div>
          <div>ramworld.net</div>
          <div>+966 55 506 7508</div>
        </div>
        <img src="${ramworldLogo}" alt="Ramworld Logo">
      </div>
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync('reports/report.html', html, 'utf-8');
  console.log("✅ HTML report saved in reports/report.html");
}
