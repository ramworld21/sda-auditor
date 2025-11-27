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
  const detectedDir = 'rtl'; // Always RTL for Arabic report interface
  const html = `
    <!DOCTYPE html>
    <html lang="${detectedLang}" dir="${detectedDir}">
    <head>
      <meta charset="UTF-8">
      <title>تقرير الفحص - ${result.title || ''}</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --primary: #062c6e;
          --accent: #2db9db;
          --muted: #6b7280;
        }
        body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; margin: 0; background: #f4f7fb; direction: ${detectedDir}; color: #0f1724; }
        .ltr { direction: ltr; text-align: left; }
        .rtl { direction: rtl; text-align: right; }
        .header { display: flex; justify-content: space-between; align-items: center; background: #fff; color:#fff; padding:20px 28px; border-bottom: 3px solid var(--primary); }
        .header img { height: 42px; }
        .report-title { font-size: 1.6rem; color: var(--primary); font-weight: 700; margin: 0; }
        @media print {
          @page { size: A4; margin: 15mm; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { padding-top: 0; padding-bottom: 0; background: white; }
          .header { position: relative; page-break-after: avoid; }
          .footer { position: relative; page-break-before: avoid; margin-top: 20px; }
          .container { max-width: 100%; }
          .card { page-break-inside: avoid; margin-bottom: 20px; }
          h2, h3 { page-break-after: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          img { max-width: 100%; height: auto; }
        }
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
        .filter-row { display: none; }
        .color-table-row { transition: opacity 0.2s; }
        /* Hide interactive controls when printing/exporting to PDF */
        @media print {
          .btn, .actions, .dropdown { display: none !important; }
          #failures-hidden { display: flex !important; }
          .color-table-row { display: table-row !important; opacity: 1 !important; }
        }
        /* Also support client-side export which toggles this class */
        .pdf-export .btn, .pdf-export .actions, .pdf-export .dropdown { display: none !important; }
        .pdf-export #failures-hidden { display: flex !important; }
        .pdf-export .color-table-row { display: table-row !important; opacity: 1 !important; }
        .thumbnail { width: 140px; height: 92px; object-fit: cover; border-radius: 10px; border: 2px solid var(--accent); cursor: pointer; transition: box-shadow .18s; }
        .thumbnail:hover { box-shadow: 0 2px 12px var(--accent); }
        .actions { display: flex; gap: 12px; margin-top: 10px; }
        .btn { background: var(--accent); color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 1em; cursor: pointer; font-weight: 600; transition: background .18s; }
        .btn:hover { background: #1ca1c2; }
        .footer { background: linear-gradient(135deg, #f8f9fa, #fff); border-top: 3px solid var(--primary); padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; font-size: 0.95em; color: var(--muted); position: relative; box-shadow: 0 -4px 12px rgba(0,0,0,0.04); }
        .footer .info { display: flex; flex-direction: column; gap: 6px; }
        .footer .info strong { color: var(--primary); font-weight: 700; font-size: 1.1em; }
        .footer img { height: 42px; margin-left: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        .three-col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 16px; }
        .footer .page-number { position: absolute; left: 50%; transform: translateX(-50%); font-weight: 600; color: var(--primary); display: none; }
        @media print {
          .footer .page-number { display: block; }
          .footer .page-number::before { content: "صفحة " counter(page); }
        }
        @media (max-width: 700px) {
          .header, .footer { flex-direction: column; align-items: flex-start; padding: 12px 8px; }
          .container { padding: 12px 8px; }
          .responsive-grid { grid-template-columns: 1fr; }
          .card > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          .btn { font-size: 14px; padding: 10px 14px; }
        }
      </style>
      <script>
        function showFullScreenshot(src) {
          const win = window.open('', '_blank');
          win.document.write('<img src="' + src + '" style="width:100%;max-width:1200px;display:block;margin:auto;">');
        }
        function downloadImage(src, name) {
          try {
            const a = document.createElement('a');
            a.href = src; 
            a.download = name; 
            a.setAttribute('download', name);
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a);
          } catch (error) {
            console.error('Download failed:', error);
            alert('فشل تحميل الصورة. جرب فتح الصورة في نافذة جديدة والنقر بزر الماوس الأيمن للحفظ.');
          }
        }
        async function exportPDF() {
          // Try server-side high-fidelity PDF first (best for Arabic/fonts/complex layout)
          const origin = (window.location && window.location.protocol === 'file:') ? 'http://localhost:3001' : window.location.origin;
          
          // Show loading indicator
          const loadingDiv = document.createElement('div');
          loadingDiv.id = 'pdf-loading';
          loadingDiv.innerHTML = '<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;"><div style="background:white;padding:30px;border-radius:12px;text-align:center;"><div style="font-size:1.5em;color:#062c6e;margin-bottom:10px">جاري إنشاء PDF...</div><div style="font-size:14px;color:#666">يرجى الانتظار</div></div></div>';
          document.body.appendChild(loadingDiv);
          
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
              document.body.removeChild(loadingDiv);
              return;
            }
            console.warn('Server-side PDF endpoint returned non-OK:', resp.status);
            document.body.removeChild(loadingDiv);
          } catch (e) {
            console.warn('Server-side PDF generation failed:', e);
            document.body.removeChild(loadingDiv);
          }

          // Fallback: use browser print dialog (better than client-side screenshot)
          alert('تعذر الاتصال بالخادم لإنشاء PDF. سيتم فتح نافذة الطباعة.\\n\\nنصيحة: اختر "حفظ كـ PDF" من خيارات الطباعة للحصول على أفضل نتيجة.');
          // Show all content before printing
          const hiddenFailures = document.getElementById('failures-hidden');
          if (hiddenFailures) hiddenFailures.style.display = 'flex';
          const colorFilter = document.getElementById('color-filter');
          if (colorFilter) {
            colorFilter.value = 'all';
            const rows = document.querySelectorAll('.color-table-row');
            rows.forEach(row => { row.style.display = 'table-row'; row.style.opacity = '1'; });
          }
          window.print();
        }
        function switchResponsive() {
          const sel = document.getElementById('responsive-select');
          const img = document.getElementById('responsive-img');
          img.src = sel.value;
        }
        function filterColorTable(filter) {
          const rows = document.querySelectorAll('.color-table-row');
          rows.forEach(row => {
            if (filter === 'all') {
              row.style.display = 'table-row';
              row.style.opacity = '1';
            } else if (row.dataset.match === filter) {
              row.style.display = 'table-row';
              row.style.opacity = '1';
            } else {
              row.style.display = 'none';
              row.style.opacity = '0';
            }
          });
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
        
        <!-- Interactive Accuracy Chart -->
        <div class="card">
          <h2>نظرة عامة على دقة التوافق</h2>
          <div style="max-width:600px;margin:20px auto;position:relative;height:350px">
            <canvas id="accuracyChart"></canvas>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-top:24px">
            <div style="background:linear-gradient(135deg,#e6fff7,#fff);padding:16px;border-radius:10px;border:2px solid #16a34a;text-align:center">
              <div style="font-size:2em;font-weight:700;color:#16a34a">${colorAccuracy}%</div>
              <div style="color:#15803d;margin-top:4px">دقة الألوان</div>
            </div>
            <div style="background:linear-gradient(135deg,#eff6ff,#fff);padding:16px;border-radius:10px;border:2px solid var(--accent);text-align:center">
              <div style="font-size:2em;font-weight:700;color:var(--accent)">${typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy.toFixed(1) : '0'}%</div>
              <div style="color:var(--primary);margin-top:4px">دقة المسافات</div>
            </div>
            <div style="background:linear-gradient(135deg,${result.fontMatch ? '#e6fff7' : '#ffe6e6'},#fff);padding:16px;border-radius:10px;border:2px solid ${result.fontMatch ? '#16a34a' : '#dc2626'};text-align:center">
              <div style="font-size:1.8em;font-weight:700;color:${result.fontMatch ? '#16a34a' : '#dc2626'}">${result.fontMatch ? '✓' : '✗'}</div>
              <div style="color:${result.fontMatch ? '#15803d' : '#991b1b'};margin-top:4px">خط IBM Plex</div>
            </div>
            <div style="background:linear-gradient(135deg,${result.digitalStamp?.present ? '#e6fff7' : '#ffe6e6'},#fff);padding:16px;border-radius:10px;border:2px solid ${result.digitalStamp?.present ? '#16a34a' : '#dc2626'};text-align:center">
              <div style="font-size:1.8em;font-weight:700;color:${result.digitalStamp?.present ? '#16a34a' : '#dc2626'}">${result.digitalStamp?.present ? '✓' : '✗'}</div>
              <div style="color:${result.digitalStamp?.present ? '#15803d' : '#991b1b'};margin-top:4px">ختم التحقق</div>
            </div>
          </div>
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
          <div class="dropdown" style="margin-bottom:12px">
            <label for="color-filter" style="margin-left:8px;font-weight:600;color:var(--primary)">تصفية الألوان:</label>
            <select id="color-filter" onchange="filterColorTable(this.value)">
              <option value="all">جميع الألوان</option>
              <option value="correct">الألوان الصحيحة فقط</option>
              <option value="wrong">الألوان الخاطئة فقط</option>
            </select>
          </div>
          <table style="width:100%;border-collapse:collapse;" id="color-table">
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
                <tr class="color-table-row ${r.match ? 'match' : 'no-match'}" data-match="${r.match ? 'correct' : 'wrong'}">
                  <td><span class="swatch" style="background:${r.color}"></span>${r.color}</td>
                  <td>${r.closest ? `<span class="swatch" style="background:${r.closest}"></span>${r.closest}` : '-'}</td>
                  <td>${r.distance !== null ? r.distance.toFixed(1) : '-'}</td>
                  <td>${r.match ? '✔️' : '❌'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ${result.colorFailures && result.colorFailures.length ? `
        <div class="card" id="color-failures-card">
          <h2>ألوان غير متوافقة — مواقع الظهور</h2>
          <div class="meta">تم تصوير أول عنصر لكل لون غير متوافق. انقر على الصورة لعرضها بالحجم الكامل.</div>
          <div id="failures-visible" style="margin-top:12px;display:flex;flex-wrap:wrap;gap:12px">
            ${result.colorFailures.slice(0,2).map(cf => `
              <div style="width:220px;background:#fff;border:1px solid #eee;padding:8px;border-radius:10px;box-shadow:0 4px 12px rgba(2,6,23,0.04);">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;"><div class="swatch" style="background:${cf.color};width:28px;height:28px;border-radius:6px;border:1px solid #ddd"></div><div style="font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${cf.color}</div></div>
                <img src="${cf.screenshot}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;cursor:pointer" onclick="showFullScreenshot('${cf.screenshot}')">
                <div style="margin-top:8px;font-size:12px;color:var(--muted);max-height:48px;overflow:hidden">${cf.snippet ? cf.snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''}</div>
                <div style="margin-top:8px;font-size:12px;color:var(--muted)"><strong>Selector:</strong> <code style="font-size:12px">${cf.selector || 'N/A'}</code></div>
                <div style="margin-top:4px;font-size:12px;color:var(--muted)"><strong>Rect:</strong> ${cf.rect ? `x:${Math.round(cf.rect.x)}, y:${Math.round(cf.rect.y)}, w:${Math.round(cf.rect.width)}, h:${Math.round(cf.rect.height)}` : 'N/A'}</div>
                <div style="margin-top:8px"><a href="${cf.screenshot}" target="_blank" class="btn" style="display:inline-block;padding:8px 10px;font-size:13px">فتح الصورة</a></div>
              </div>
            `).join('')}
          </div>
          ${result.colorFailures.length > 2 ? `
          <div id="failures-hidden" style="margin-top:12px;display:none;flex-wrap:wrap;gap:12px">
            ${result.colorFailures.slice(2).map(cf => `
              <div style="width:220px;background:#fff;border:1px solid #eee;padding:8px;border-radius:10px;box-shadow:0 4px 12px rgba(2,6,23,0.04);">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;"><div class="swatch" style="background:${cf.color};width:28px;height:28px;border-radius:6px;border:1px solid #ddd"></div><div style="font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${cf.color}</div></div>
                <img src="${cf.screenshot}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;cursor:pointer" onclick="showFullScreenshot('${cf.screenshot}')">
                <div style="margin-top:8px;font-size:12px;color:var(--muted);max-height:48px;overflow:hidden">${cf.snippet ? cf.snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''}</div>
                <div style="margin-top:8px;font-size:12px;color:var(--muted)"><strong>Selector:</strong> <code style="font-size:12px">${cf.selector || 'N/A'}</code></div>
                <div style="margin-top:4px;font-size:12px;color:var(--muted)"><strong>Rect:</strong> ${cf.rect ? `x:${Math.round(cf.rect.x)}, y:${Math.round(cf.rect.y)}, w:${Math.round(cf.rect.width)}, h:${Math.round(cf.rect.height)}` : 'N/A'}</div>
                <div style="margin-top:8px"><a href="${cf.screenshot}" target="_blank" class="btn" style="display:inline-block;padding:8px 10px;font-size:13px">فتح الصورة</a></div>
              </div>
            `).join('')}
          </div>
          <div class="actions">
            <button class="btn" id="show-more-btn" onclick="(function(){
              const hidden = document.getElementById('failures-hidden');
              if (!hidden) return;
              const visible = hidden.style.display !== 'none';
              if (visible) {
                hidden.style.display = 'none';
                document.getElementById('show-more-btn').innerText = 'أظهار المزيد';
              } else {
                hidden.style.display = 'flex';
                document.getElementById('show-more-btn').innerText = 'إخفاء';
              }
            })()">أظهار المزيد</button>
          </div>
          ` : ''}
        </div>
        ` : ''}
        ` : ''}
        <!-- Removed unique color set display per request -->
        <div class="card">
          <h2>عناصر التصميم الأساسية</h2>
          <div class="three-col-grid">
            <div style="background:linear-gradient(135deg,${result.digitalStamp?.present ? '#e6fff7' : '#ffe6e6'},#fff);padding:20px;border-radius:12px;border:2px solid ${result.digitalStamp?.present ? '#16a34a' : '#dc2626'};text-align:center">
              <div style="font-size:3em;margin-bottom:8px">${result.digitalStamp?.present ? '✓' : '✗'}</div>
              <h3 style="color:${result.digitalStamp?.present ? '#16a34a' : '#dc2626'};margin:0 0 8px 0;font-size:1.1em">ختم التحقق</h3>
              <div class="meta" style="color:${result.digitalStamp?.present ? '#15803d' : '#991b1b'}">${result.digitalStamp?.present ? 'تم الكشف' : 'غير موجود'}</div>
              ${result.digitalStamp && result.digitalStamp.present && result.digitalStamp.reason ? `<div style="margin-top:12px;padding:10px;background:rgba(255,255,255,0.6);border-radius:8px;font-size:0.85em;color:#15803d">${result.digitalStamp.reason}</div>` : ''}
            </div>
            <div style="background:linear-gradient(135deg,${result.hasSearchBar ? '#e6fff7' : '#ffe6e6'},#fff);padding:20px;border-radius:12px;border:2px solid ${result.hasSearchBar ? '#16a34a' : '#dc2626'};text-align:center">
              <div style="font-size:3em;margin-bottom:8px">${result.hasSearchBar ? '✓' : '✗'}</div>
              <h3 style="color:${result.hasSearchBar ? '#16a34a' : '#dc2626'};margin:0 0 8px 0;font-size:1.1em">شريط البحث</h3>
              <div class="meta" style="color:${result.hasSearchBar ? '#15803d' : '#991b1b'}">${result.hasSearchBar ? 'تم الكشف' : 'غير موجود'}</div>
            </div>
            <div style="background:linear-gradient(135deg,${result.spacingAccuracy > 50 ? '#e6fff7' : '#ffe6e6'},#fff);padding:20px;border-radius:12px;border:2px solid ${result.spacingAccuracy > 50 ? '#16a34a' : '#dc2626'};text-align:center">
              <div style="font-size:2.5em;margin-bottom:8px;color:${result.spacingAccuracy > 50 ? '#16a34a' : '#dc2626'};font-weight:700">${typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy.toFixed(1) : '0'}%</div>
              <h3 style="color:${result.spacingAccuracy > 50 ? '#16a34a' : '#dc2626'};margin:0 0 8px 0;font-size:1.1em">دقة المسافات</h3>
              <div class="meta" style="color:${result.spacingAccuracy > 50 ? '#15803d' : '#991b1b'}">${(() => {
                const acc = result.spacingAccuracy || 0;
                if (acc > 80) return 'ممتاز';
                if (acc > 50) return 'جيد';
                return 'يحتاج تحسين';
              })()}</div>
            </div>
          </div>
        </div>

        <!-- AI Recommendations Section -->
        <div class="card" style="background:linear-gradient(135deg,#f0f9ff,#fff);border:2px solid var(--accent)">
          <h2 style="display:flex;align-items:center;gap:10px">
            <svg viewBox="0 0 24 24" style="width:28px;height:28px" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            توصيات التحسين (AI)
          </h2>
          <div style="color:#0f1724;line-height:1.8;margin-top:16px">
            ${(() => {
              const recommendations = [];
              const colorAcc = parseFloat(colorAccuracy);
              const spacingAcc = typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy : 0;
              
              // Color recommendations
              if (colorAcc < 60) {
                recommendations.push({
                  priority: 'عالي',
                  color: '#dc2626',
                  icon: '🎨',
                  title: 'تحسين توافق الألوان',
                  description: 'دقة الألوان الحالية (' + colorAccuracy + '%) أقل من المستوى المطلوب. يُنصح بمراجعة لوحة الألوان المستخدمة في الموقع وتحديثها لتطابق ألوان الهوية الموحدة للحكومة الرقمية.',
                  action: 'استخدام الألوان المعتمدة من نظام التصميم الموحد فقط في جميع عناصر الموقع'
                });
              } else if (colorAcc < 80) {
                recommendations.push({
                  priority: 'متوسط',
                  color: '#f59e0b',
                  icon: '🎨',
                  title: 'تحسينات بسيطة على الألوان',
                  description: 'دقة الألوان جيدة (' + colorAccuracy + '%) لكن يمكن تحسينها. راجع الألوان غير المتوافقة المدرجة في التقرير وقم بتعديلها.',
                  action: 'مراجعة وتصحيح الألوان المحددة في قسم "ألوان غير متوافقة"'
                });
              } else {
                recommendations.push({
                  priority: 'ممتاز',
                  color: '#16a34a',
                  icon: '✓',
                  title: 'توافق ممتاز للألوان',
                  description: 'دقة الألوان ممتازة (' + colorAccuracy + '%). الموقع يستخدم ألوان الهوية بشكل صحيح. استمر في الحفاظ على هذا المستوى.',
                  action: 'الحفاظ على استخدام ألوان الهوية في التحديثات المستقبلية'
                });
              }
              
              // Spacing recommendations
              if (spacingAcc < 50) {
                recommendations.push({
                  priority: 'عالي',
                  color: '#dc2626',
                  icon: '📏',
                  title: 'إصلاح نظام المسافات',
                  description: 'دقة المسافات (' + spacingAcc.toFixed(1) + '%) تحتاج إلى تحسين كبير. المسافات غير المتسقة تؤثر على تجربة المستخدم والمظهر الاحترافي للموقع.',
                  action: 'تطبيق نظام المسافات الموحد (4px, 8px, 12px, 16px, 24px, 32px, 48px) في جميع العناصر'
                });
              } else if (spacingAcc < 80) {
                recommendations.push({
                  priority: 'متوسط',
                  color: '#f59e0b',
                  icon: '📏',
                  title: 'تحسين اتساق المسافات',
                  description: 'دقة المسافات (' + spacingAcc.toFixed(1) + '%) جيدة لكن تحتاج بعض التحسينات لتحقيق التناسق الكامل.',
                  action: 'مراجعة المسافات في العناصر الرئيسية وتوحيدها حسب النظام'
                });
              }
              
              // Font recommendations
              if (!result.fontMatch) {
                recommendations.push({
                  priority: 'عالي',
                  color: '#dc2626',
                  icon: '🔤',
                  title: 'تطبيق خط الهوية',
                  description: 'الموقع لا يستخدم خط IBM Plex Arabic المطلوب. الخط الموحد ضروري لتحقيق الهوية البصرية المتسقة.',
                  action: 'تحميل وتطبيق خط IBM Plex Arabic من Google Fonts أو من ملفات الخطوط المحلية'
                });
              }
              
              // Digital stamp recommendations  
              if (!result.digitalStamp?.present) {
                recommendations.push({
                  priority: 'عالي',
                  color: '#dc2626',
                  icon: '🔒',
                  title: 'إضافة ختم التحقق',
                  description: 'الموقع لا يحتوي على ختم/شريط المصادقة الرسمي. هذا العنصر إلزامي للمواقع الحكومية للتأكيد على الهوية الرسمية.',
                  action: 'إضافة شريط التحقق الرسمي مع العلم السعودي والنص "موقع حكومي رسمي تابع لحكومة المملكة العربية السعودية"'
                });
              }
              
              // General recommendations
              if (colorAcc >= 80 && spacingAcc >= 80 && result.fontMatch && result.digitalStamp?.present) {
                recommendations.push({
                  priority: 'ممتاز',
                  color: '#16a34a',
                  icon: '🌟',
                  title: 'توافق ممتاز مع المعايير',
                  description: 'الموقع يحقق مستوى ممتاز من التوافق مع معايير التصميم الموحد. جميع العناصر الأساسية مطبقة بشكل صحيح.',
                  action: 'متابعة الالتزام بالمعايير في التحديثات المستقبلية وإجراء فحوصات دورية'
                });
              }
              
              // Responsive design recommendation
              if (responsiveScreens.length === 3) {
                recommendations.push({
                  priority: 'معلومات',
                  color: '#2563eb',
                  icon: '📱',
                  title: 'التصميم المتجاوب',
                  description: 'تم اختبار الموقع على أحجام شاشات متعددة (جوال، تابلت، ديسكتوب). راجع لقطات الشاشة للتأكد من جودة العرض.',
                  action: 'مراجعة لقطات الشاشة وضمان تناسق التصميم عبر جميع الأجهزة'
                });
              }
              
              return recommendations.map(rec => `
                <div style="margin-bottom:20px;padding:20px;background:white;border-radius:12px;border-right:4px solid ${rec.color};box-shadow:0 2px 8px rgba(0,0,0,0.08)">
                  <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
                    <span style="font-size:2em">${rec.icon}</span>
                    <div style="flex:1">
                      <div style="display:flex;align-items:center;gap:10px;margin-bottom:4px">
                        <h3 style="margin:0;color:${rec.color};font-size:1.2em">${rec.title}</h3>
                        <span style="background:${rec.color};color:white;padding:4px 12px;border-radius:20px;font-size:11px;font-weight:700">${rec.priority}</span>
                      </div>
                    </div>
                  </div>
                  <p style="margin:0 0 12px 0;color:#4b5563;line-height:1.7">${rec.description}</p>
                  <div style="background:#f9fafb;padding:12px 16px;border-radius:8px;border-right:3px solid ${rec.color}">
                    <strong style="color:#1f2937">الإجراء المقترح:</strong>
                    <div style="color:#4b5563;margin-top:6px">${rec.action}</div>
                  </div>
                </div>
              `).join('');
            })()}
          </div>
        </div>

        ${responsiveScreens.length > 0 ? `
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
        ` : ''}
        <div class="card">
          <h2>صورة كاملة للصفحة و تصدير التقرير</h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px">
            <div>
              <h3 style="color:var(--primary);font-size:1.1rem;margin-bottom:12px">معاينة الصفحة</h3>
              <img src="${fullScreenshot}" class="thumbnail" alt="Full Screenshot" onclick="showFullScreenshot('${fullScreenshot}')" style="width:100%;height:auto;max-height:300px;object-fit:contain;border:2px solid var(--accent);border-radius:12px;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
              <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
                <button class="btn" onclick="showFullScreenshot('${fullScreenshot}')" style="flex:1;min-width:140px">
                  <svg viewBox="0 0 24 24" style="width:16px;height:16px;margin-left:6px;display:inline-block;vertical-align:middle" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                  عرض بالحجم الكامل
                </button>
                <button class="btn" onclick="downloadImage('${fullScreenshot}','full-screenshot.png')" style="flex:1;min-width:140px;background:#16a34a">
                  <svg viewBox="0 0 24 24" style="width:16px;height:16px;margin-left:6px;display:inline-block;vertical-align:middle" fill="currentColor"><path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/></svg>
                  تحميل PNG
                </button>
              </div>
            </div>
            <div style="background:linear-gradient(135deg,#f6f9ff,#fff);padding:20px;border-radius:12px;border:2px solid var(--primary-rgba-12)">
              <h3 style="color:var(--primary);font-size:1.1rem;margin-bottom:16px;display:flex;align-items:center">
                <svg viewBox="0 0 24 24" style="width:20px;height:20px;margin-left:8px" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                تصدير التقرير
              </h3>
              <div style="color:var(--muted);font-size:14px;margin-bottom:16px;line-height:1.6">احفظ التقرير الكامل بصيغة PDF مع جميع النتائج والصور والتحليلات. مثالي للمشاركة أو الأرشفة.</div>
              <button class="btn" onclick="exportPDF()" style="width:100%;padding:14px;font-size:16px;font-weight:700;background:var(--primary);display:flex;align-items:center;justify-content:center;gap:10px;box-shadow:0 4px 12px rgba(6,44,110,0.3)">
                <svg viewBox="0 0 24 24" style="width:20px;height:20px" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 10h-4v5h-2v-5H5l7-7 7 7z"/></svg>
                تصدير إلى PDF
              </button>
              <div style="margin-top:12px;padding:12px;background:rgba(45,185,219,0.1);border-radius:8px;border-right:3px solid var(--accent)">
                <div style="font-size:12px;color:var(--muted);line-height:1.5">
                  <strong style="color:var(--accent)">💡 ملاحظة:</strong> سيتم تضمين جميع الألوان والعناصر غير المتوافقة تلقائياً في التقرير المصدر.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer">
        <div class="info">
          <strong>تقرير الفحص - مدقق الهوية الموحدة</strong>
          <div style="margin-top:4px">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA')}</div>
          <div class="ltr" style="font-size:0.9em;margin-top:6px;color:#6b7280">Powered by Ramworld Tech Solutions</div>
        </div>
        <div style="text-align:center">
          <img src="${ramworldLogo}" alt="Ramworld Logo">
          <div class="ltr" style="font-size:0.85em;color:var(--muted);margin-top:6px">www.ramworld.net | info@ramworld.net | +966 55 506 7508</div>
        </div>
        <div class="page-number"></div>
      </div>
      </div>
      <script>
        // Ensure functions are in global scope
        window.showFullScreenshot = function(src) {
          const win = window.open('', '_blank');
          win.document.write('<img src="' + src + '" style="width:100%;max-width:1200px;display:block;margin:auto;">');
        };
        
        window.downloadImage = function(src, name) {
          try {
            const a = document.createElement('a');
            a.href = src; 
            a.download = name; 
            a.setAttribute('download', name);
            document.body.appendChild(a); 
            a.click(); 
            document.body.removeChild(a);
          } catch (error) {
            console.error('Download failed:', error);
            alert('فشل تحميل الصورة. جرب فتح الصورة في نافذة جديدة والنقر بزر الماوس الأيمن للحفظ.');
          }
        };
        
        window.exportPDF = async function() {
          const origin = (window.location && window.location.protocol === 'file:') ? 'http://localhost:3001' : window.location.origin;
          
          const loadingDiv = document.createElement('div');
          loadingDiv.id = 'pdf-loading';
          loadingDiv.innerHTML = '<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;"><div style="background:white;padding:30px;border-radius:12px;text-align:center;"><div style="font-size:1.5em;color:#062c6e;margin-bottom:10px">جاري إنشاء PDF...</div><div style="font-size:14px;color:#666">يرجى الانتظار</div></div></div>';
          document.body.appendChild(loadingDiv);
          
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
              document.body.removeChild(loadingDiv);
              return;
            }
            document.body.removeChild(loadingDiv);
          } catch (e) {
            console.warn('Server-side PDF generation failed:', e);
            document.body.removeChild(loadingDiv);
          }
          
          alert('تعذر الاتصال بالخادم لإنشاء PDF. سيتم فتح نافذة الطباعة.\\n\\nنصيحة: اختر \"حفظ كـ PDF\" من خيارات الطباعة للحصول على أفضل نتيجة.');
          const hiddenFailures = document.getElementById('failures-hidden');
          if (hiddenFailures) hiddenFailures.style.display = 'flex';
          const colorFilter = document.getElementById('color-filter');
          if (colorFilter) {
            colorFilter.value = 'all';
            const rows = document.querySelectorAll('.color-table-row');
            rows.forEach(row => { row.style.display = 'table-row'; row.style.opacity = '1'; });
          }
          window.print();
        };
        
        // Initialize Chart.js accuracy chart
        window.addEventListener('DOMContentLoaded', function() {
          const ctx = document.getElementById('accuracyChart');
          if (ctx && window.Chart) {
            const colorAcc = ${colorAccuracy};
            const spacingAcc = ${typeof result.spacingAccuracy === 'number' ? result.spacingAccuracy.toFixed(1) : 0};
            const fontScore = ${result.fontMatch ? 100 : 0};
            const stampScore = ${result.digitalStamp?.present ? 100 : 0};
            const searchScore = ${result.hasSearchBar ? 100 : 0};
            
            new Chart(ctx, {
              type: 'doughnut',
              data: {
                labels: ['الألوان', 'المسافات', 'الخط', 'ختم التحقق', 'شريط البحث'],
                datasets: [{
                  data: [colorAcc, spacingAcc, fontScore, stampScore, searchScore],
                  backgroundColor: [
                    'rgba(22, 163, 74, 0.8)',
                    'rgba(45, 185, 219, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                  ],
                  borderColor: [
                    'rgba(22, 163, 74, 1)',
                    'rgba(45, 185, 219, 1)',
                    'rgba(251, 191, 36, 1)',
                    'rgba(139, 92, 246, 1)',
                    'rgba(239, 68, 68, 1)'
                  ],
                  borderWidth: 2
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      font: { size: 14, family: 'IBM Plex Sans Arabic' },
                      padding: 15,
                      usePointStyle: true
                    }
                  },
                  title: {
                    display: true,
                    text: 'مقاييس التوافق مع معايير التصميم الموحد',
                    font: { size: 18, family: 'IBM Plex Sans Arabic', weight: '700' },
                    color: '#062c6e',
                    padding: { top: 10, bottom: 20 }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return context.label + ': ' + context.parsed + '%';
                      }
                    },
                    bodyFont: { family: 'IBM Plex Sans Arabic', size: 14 },
                    titleFont: { family: 'IBM Plex Sans Arabic', size: 16 }
                  }
                }
              }
            });
          }
        });
      </script>

    </body>
    </html>
  `;
  fs.writeFileSync('reports/report.html', html, 'utf-8');
  console.log("✅ HTML report saved in reports/report.html");
}
