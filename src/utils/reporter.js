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
  // Normalize logo path: if local file name, prefix with /reports/
  let initialEntityLogoSrc = entityLogo;
  if (entityLogo && !/^https?:/i.test(entityLogo)) {
    initialEntityLogoSrc = `/reports/${entityLogo}`;
  }
  // Always use the app favicon from /public
  const faviconHref = '/favicon.png';
  // Use absolute paths under /reports so assets load when report is in a subfolder
  const fullScreenshot = result.snapPath ? `/reports/${result.snapPath}` : '';
  const responsiveScreens = [
    { label: 'جوال (375x812)', src: result.screenshotMobile ? `/reports/${result.screenshotMobile}` : '', key: 'mobile' },
    { label: 'تابلت (768x1024)', src: result.screenshotTablet ? `/reports/${result.screenshotTablet}` : '', key: 'tablet' },
    { label: 'ديسكتوب (1440x900)', src: result.screenshotDesktop ? `/reports/${result.screenshotDesktop}` : '', key: 'desktop' }
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
      <link rel="icon" href="${faviconHref}" sizes="32x32" />
      <link rel="shortcut icon" href="${faviconHref}" />
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
          @page { 
            size: A4; 
            margin: 20mm 12mm 20mm 12mm; 
          }
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          body { 
            padding: 0; 
            margin: 0;
            background: white !important; 
            font-size: 9.5pt;
            line-height: 1.3;
          }
          .header { 
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 16mm;
            background: white !important;
            border-bottom: 1.5px solid var(--primary);
            padding: 4mm 12mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1000;
          }
          .header img {
            height: 24px;
            max-width: 70px;
            object-fit: contain;
          }
          .header .report-title {
            font-size: 11pt;
            margin: 0;
            color: var(--primary);
            font-weight: 700;
            white-space: nowrap;
          }
          .footer { 
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 14mm;
            background: white;
            border-top: 1.5px solid var(--primary);
            padding: 3mm 12mm;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
          }
          .footer img {
            height: 22px;
            max-width: 60px;
            object-fit: contain;
          }
          .footer .info {
            flex: 1;
            text-align: center;
          }
          .footer .info div {
            font-size: 8pt;
            line-height: 1.2;
          }
          .footer .page-number {
            position: static;
            transform: none;
            margin: 0 15px;
            font-size: 9pt;
            font-weight: 600;
          }
          .container { 
            max-width: 100%; 
            padding: 0;
            margin: 18mm 0 16mm 0;
          }
          .card { 
            page-break-inside: avoid; 
            margin-bottom: 6px;
            box-shadow: none;
            border: 0.5px solid #d1d5db;
            padding: 8px 10px;
            border-radius: 4px;
          }
          h2 { 
            page-break-after: avoid; 
            font-size: 11pt;
            margin: 0 0 6px 0;
            font-weight: 700;
          }
          h3 { 
            page-break-after: avoid;
            font-size: 10pt;
            margin: 0 0 4px 0;
            font-weight: 600;
          }
          .meta {
            font-size: 8pt;
            margin-bottom: 4px;
          }
          table { 
            page-break-inside: auto;
            font-size: 8pt;
            width: 100%;
          }
          tr { 
            page-break-inside: avoid; 
            page-break-after: auto; 
          }
          td, th {
            padding: 4px 6px;
          }
          th {
            font-size: 8.5pt;
          }
          img { 
            max-width: 100%; 
            height: auto;
            page-break-inside: avoid;
          }
          .responsive-grid { 
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
          }
          .responsive-cell {
            padding: 4px;
          }
          .responsive-cell .meta {
            font-size: 7pt;
            margin-bottom: 2px;
          }
          .responsive-cell img {
            max-height: 110px;
            width: 100%;
            object-fit: contain;
          }
          .three-col-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 6px;
          }
          .three-col-grid > div {
            padding: 8px;
            font-size: 8.5pt;
          }
          .three-col-grid h3 {
            font-size: 9pt;
          }
          .three-col-grid .meta {
            font-size: 7.5pt;
          }
          #section-color-failures {
            page-break-inside: auto;
          }
          #section-color-failures .meta {
            font-size: 7pt;
          }
          #section-color-failures > div {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 6px;
          }
          #section-color-failures > div > div {
            width: auto;
            padding: 4px;
            font-size: 7pt;
          }
          #section-color-failures img {
            height: 70px;
            width: 100%;
            object-fit: cover;
          }
          #failures-visible, #failures-hidden {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 6px !important;
          }
          .accuracy-bar {
            height: 12px;
            margin: 4px 0 8px 0;
          }
          .accuracy-label {
            font-size: 9pt;
          }
          .dropdown {
            margin-bottom: 6px;
          }
          .swatch {
            width: 16px;
            height: 16px;
            margin-right: 4px;
          }
          canvas#accuracyChart {
            max-height: 160px !important;
            max-width: 100% !important;
          }
          .card:first-child canvas {
            max-height: 140px !important;
          }
        }
        .container { max-width: 1100px; margin: 18px auto; padding: 18px; }
        .card { background: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(15,23,36,0.08); margin-bottom: 16px; border: 1px solid #e5e7eb; }
        h2 { color: var(--primary); margin-top: 0; margin-bottom: 12px; }
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
            /* Floating TOC fixed to the right of the viewport with hover hints
              - Placed outside of the main .container so it doesn't affect layout
              - Hidden on small screens and when printing */
            #section-toc { position:fixed; right:18px; top:110px; width:220px; z-index:1200; background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(15,23,36,0.08); }
          .toc-list { padding: 0; }
          .toc-item { display:flex; align-items:center; justify-content:space-between; padding:8px; border-radius:8px; transition:background .12s; position:relative; }
          .toc-item .toc-link { flex:1; text-decoration:none; color:var(--primary); font-weight:600; padding-right:8px }
          .toc-item .toc-icon { margin-left:8px; opacity:0.95; cursor:default }
          .toc-item:hover { background: rgba(6,44,110,0.04); }
          .toc-hint { position:absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%); background: #fff; border:1px solid #e5e7eb; padding:8px 12px; min-width:220px; border-radius:8px; box-shadow:0 6px 20px rgba(2,6,23,0.06); display:none; z-index:40; font-size:13px; color:#334155 }
          .toc-item:hover .toc-hint { display:block; }
          
          /* Hamburger menu button */
          .toc-hamburger { display: none; position: fixed; top: 90px; right: 20px; z-index: 1300; background: var(--primary); color: white; border: none; border-radius: 8px; padding: 10px 12px; cursor: pointer; box-shadow: 0 2px 8px rgba(6,44,110,0.3); }
          .toc-hamburger:hover { background: #051f4d; }
          .toc-hamburger svg { width: 24px; height: 24px; }
          
          /* Mobile/Tablet: Hide TOC by default, show hamburger */
          @media (max-width:1100px) { 
            .toc-hamburger { display: block; }
            #section-toc { 
              position: fixed; 
              right: -280px;
              top: 0;
              height: 100vh;
              width: 260px; 
              margin: 0;
              overflow-y: auto;
              transition: right 0.3s ease;
              box-shadow: -2px 0 10px rgba(0,0,0,0.1);
              border-radius: 0;
            }
            #section-toc.toc-open { right: 0; }
            .toc-hint { display:none !important; }
            .toc-overlay { display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 1199; }
            .toc-overlay.active { display: block; }
          }
          
          /* Desktop: Optional hamburger toggle */
          @media (min-width:1101px) {
            .toc-hamburger { display: block; }
            #section-toc.toc-hidden { display: none; }
          }
          
          @media print { #section-toc { display:none !important; } .toc-hamburger { display: none !important; } }
        .footer { background: white; border-top: 2px solid var(--primary); padding: 16px 32px; display: flex; align-items: center; justify-content: space-between; font-size: 0.9em; color: var(--muted); position: relative; }
        .footer .info { display: flex; flex-direction: column; gap: 6px; }
        .footer .info strong { color: var(--primary); font-weight: 700; font-size: 1.1em; }
        .footer img { height: 42px; margin-left: 18px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        .three-col-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 16px; }
        .footer .page-number { position: absolute; left: 50%; transform: translateX(-50%); font-weight: 600; color: var(--primary); display: none; }
        @media print {
          .footer .page-number { display: block; }
          .footer .page-number::before { content: "صفحة " counter(page); }
        }
        @media (max-width: 1024px) {
          #failures-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .three-col-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 700px) {
          .header, .footer { flex-direction: column; align-items: flex-start; padding: 12px 8px; }
          .container { padding: 12px 8px; margin-top: 60px; }
          .responsive-grid { grid-template-columns: 1fr; }
          .card > div[style*="grid-template-columns"] { grid-template-columns: 1fr !important; }
          #failures-grid { grid-template-columns: 1fr !important; }
          .three-col-grid { grid-template-columns: 1fr; }
          .btn { font-size: 14px; padding: 10px 14px; }
          table { font-size: 13px; }
          table th, table td { padding: 6px 8px !important; }
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
            const currentPath = (window.location && window.location.pathname) ? window.location.pathname : '/reports/report.html';
            const resp = await fetch(origin + '/report-pdf?path=' + encodeURIComponent(currentPath));
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

        function sortColorTable(criteria) {
          const tbody = document.querySelector('#colors-table-body');
          if (!tbody) return;
          const rows = Array.from(tbody.querySelectorAll('tr'));
          if (criteria === 'default') {
            rows.sort((a,b) => (Number(a.dataset.index) || 0) - (Number(b.dataset.index) || 0));
          } else if (criteria === 'distance-asc') {
            rows.sort((a,b) => (Number(a.dataset.distance) || 0) - (Number(b.dataset.distance) || 0));
          } else if (criteria === 'distance-desc') {
            rows.sort((a,b) => (Number(b.dataset.distance) || 0) - (Number(a.dataset.distance) || 0));
          }
          // re-append in new order
          rows.forEach(r => tbody.appendChild(r));
        }

        function toggleUniqueColors(checked) {
          const tbody = document.querySelector('#colors-table-body');
          if (!tbody) return;
          const rows = Array.from(tbody.querySelectorAll('tr'));
          if (!checked) {
            rows.forEach(r => r.style.display = r.dataset.matchFilter === 'hidden' ? 'none' : 'table-row');
            return;
          }
          const seen = new Set();
          rows.forEach(r => {
            const color = r.dataset.color;
            if (seen.has(color)) {
              r.style.display = 'none';
            } else {
              seen.add(color);
              r.style.display = r.dataset.matchFilter === 'hidden' ? 'none' : 'table-row';
            }
          });
        }
        
        function toggleTOC() {
          const toc = document.getElementById('section-toc');
          const overlay = document.getElementById('toc-overlay');
          if (toc.classList.contains('toc-open') || toc.classList.contains('toc-hidden')) {
            toc.classList.remove('toc-open', 'toc-hidden');
            if (overlay) overlay.classList.remove('active');
          } else {
            if (window.innerWidth <= 1100) {
              toc.classList.add('toc-open');
              if (overlay) overlay.classList.add('active');
            } else {
              toc.classList.add('toc-hidden');
            }
          }
        }
        
        // Close TOC when clicking on overlay or link
        document.addEventListener('DOMContentLoaded', function() {
          const overlay = document.getElementById('toc-overlay');
          if (overlay) {
            overlay.addEventListener('click', toggleTOC);
          }
          const tocLinks = document.querySelectorAll('.toc-link');
          tocLinks.forEach(link => {
            link.addEventListener('click', function() {
              if (window.innerWidth <= 1100) {
                setTimeout(toggleTOC, 300);
              }
            });
          });
        });
      </script>
    </head>
    <body>
      <div id="report-root">
      <!-- Hamburger menu button -->
      <button class="toc-hamburger" onclick="toggleTOC()" aria-label="Toggle menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <!-- Overlay for mobile TOC -->
      <div id="toc-overlay" class="toc-overlay"></div>
      <div class="header">
        <img src="${ramworldLogo}" alt="Ramworld Logo" style="height:48px;max-width:120px;object-fit:contain;order:1;">
        <span class="report-title" style="order:2;">تقرير فحص التوافق مع معايير التصميم الموحد</span>
        <img src="${initialEntityLogoSrc}" alt="Entity Logo" style="height:48px;max-width:120px;object-fit:contain;order:3;">
      </div>
      <!-- Floating/icon TOC (outside of main container so it can be fixed to viewport) -->
      <div class="card" id="section-toc">
        <h2 style="margin-top:0;text-align:center">جدول المحتويات</h2>
        <ol class="toc-list" style="padding-inline-start:0;margin:6px 0 12px 0;list-style:none;display:flex;flex-direction:column;gap:8px;">
          <li class="toc-item" data-desc="موجز نتائج الفحص والدقة العامة" style="position:relative">
            <a class="toc-link" href="#section-overview">نظرة عامة ودقة التوافق</a>
            <span class="toc-icon">📊</span>
            <div class="toc-hint">موجز نتائج الفحص والدقة العامة</div>
          </li>
          <li class="toc-item" data-desc="حالة الخطوط المستخدمة ومطابقتها للهوية" style="position:relative">
            <a class="toc-link" href="#section-fonts">مقارنة الخطوط</a>
            <span class="toc-icon">🔤</span>
            <div class="toc-hint">حالة الخطوط المستخدمة ومطابقتها للهوية</div>
          </li>
          <li class="toc-item" data-desc="تفاصيل نتائج فحص الألوان ومطابقتها" style="position:relative">
            <a class="toc-link" href="#section-colors">تحليل الألوان</a>
            <span class="toc-icon">🎨</span>
            <div class="toc-hint">تفاصيل نتائج فحص الألوان ومطابقتها</div>
          </li>
          <li class="toc-item" data-desc="أمثلة على ألوان غير متوافقة ومواقع ظهورها" style="position:relative">
            <a class="toc-link" href="#section-color-failures">ألوان غير متوافقة</a>
            <span class="toc-icon">⚠️</span>
            <div class="toc-hint">أمثلة على ألوان غير متوافقة ومواقع ظهورها</div>
          </li>
          <li class="toc-item" data-desc="التحقق من عناصر التصميم الأساسية مثل الختم وشريط البحث" style="position:relative">
            <a class="toc-link" href="#section-design">عناصر التصميم الأساسية</a>
            <span class="toc-icon">🧩</span>
            <div class="toc-hint">التحقق من عناصر التصميم الأساسية مثل الختم وشريط البحث</div>
          </li>
          <li class="toc-item" data-desc="اللغة الأساسية للموقع والتحقق من كونها عربية" style="position:relative">
            <a class="toc-link" href="#section-language">اللغة الأساسية</a>
            <span class="toc-icon">🌐</span>
            <div class="toc-hint">اللغة الأساسية للموقع — التحقق إن كانت عربية مع اقتراحات تحسين</div>
          </li>
          <li class="toc-item" data-desc="مقاييس الأداء وموارد الصفحة وطريقة الاختبار" style="position:relative">
            <a class="toc-link" href="#section-performance">تحليل الأداء</a>
            <span class="toc-icon">⚡</span>
            <div class="toc-hint">مقاييس الأداء، الموارد المحملة، وطريقة الاختبار</div>
          </li>
          <li class="toc-item" data-desc="خريطة الموقع وروابط الخرائط المكتشفة" style="position:relative">
            <a class="toc-link" href="#section-sitemap">خريطة الموقع</a>
            <span class="toc-icon">🗺️</span>
            <div class="toc-hint">روابط خريطة الموقع المكتشفة (robots.txt أو sitemap.xml)</div>
          </li>
          <li class="toc-item" data-desc="التحقق من مطابقة القالب المقدم" style="position:relative;display:none">
            <a class="toc-link" href="#section-template-match">مطابقة القالب</a>
            <span class="toc-icon">🧭</span>
            <div class="toc-hint">التحقق إن كان تصميم الصفحة يطابق القالب المقدم</div>
          </li>
          <li class="toc-item" data-desc="لقطات التصميم عبر الأجهزة المتنوعة" style="position:relative">
            <a class="toc-link" href="#section-responsive">اختبار التصميم المتجاوب</a>
            <span class="toc-icon">📱</span>
            <div class="toc-hint">لقطات التصميم عبر الأجهزة المتنوعة</div>
          </li>
          <li class="toc-item" data-desc="اقتراحات التحسين الناتجة عن التحليل بالذكاء الاصطناعي" style="position:relative">
            <a class="toc-link" href="#section-ai">توصيات التحسين (AI)</a>
            <span class="toc-icon">🤖</span>
            <div class="toc-hint">اقتراحات التحسين الناتجة عن التحليل بالذكاء الاصطناعي</div>
          </li>
          <li class="toc-item" data-desc="صور الصفحة وخيارات التصدير" style="position:relative">
            <a class="toc-link" href="#section-export">الصور والتصدير</a>
            <span class="toc-icon">📁</span>
            <div class="toc-hint">صور الصفحة وخيارات التصدير</div>
          </li>
        </ol>
      </div>
      <div class="container">
        <!-- primary TOC removed; using the icon-enabled floating TOC further down -->

        <div class="card" id="section-overview">
          <!-- Summary Card: Website Name, URL, Timestamp -->
          <div class="summary-card" style="background:linear-gradient(135deg,#f6f9ff,#fff);border:2px solid var(--accent);border-radius:12px;padding:18px 24px;margin:0 0 18px 0;box-shadow:0 2px 8px rgba(45,185,219,0.08);display:flex;flex-direction:column;gap:10px;align-items:flex-start">
            <div style="font-size:1.25em;font-weight:700;color:var(--primary);margin-bottom:2px">
              <span style="margin-left:8px">اسم الموقع:</span> <span style="color:#2563eb">${result.title || 'غير متوفر'}</span>
            </div>
            <div style="font-size:1.1em;color:#0f172a;word-break:break-all">
              <span style="margin-left:8px">الرابط:</span> <a href="${result.url || '#'}" target="_blank" style="color:var(--accent);text-decoration:underline">${result.url || 'غير متوفر'}</a>
            </div>
            <div style="font-size:1em;color:#475569">
              ${(() => {
                try {
                  const d = result.timestamp ? new Date(result.timestamp) : new Date();
                  const hijri = d.toLocaleString('ar-SA-u-ca-islamic', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  const greg = d.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                  return `<div><span style="margin-left:8px">تاريخ الفحص (هجري):</span> ${hijri}</div><div><span style="margin-left:8px">تاريخ الفحص (ميلادي):</span> ${greg}</div>`;
                } catch (e) {
                  return `<span style="margin-left:8px">تاريخ الفحص:</span> ${result.timestamp || 'غير متوفر'}`;
                }
              })()}
            </div>
          </div>
          <h2>نظرة عامة على دقة التوافق</h2>
          <div style="max-width:500px;margin:20px auto;position:relative;height:300px">
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

        <div class="card" id="section-fonts">
          <h2>مقارنة الخطوط</h2>
          <div class="meta"><strong>نتيجة الكشف عن خط الهوية (IBM Plex):</strong> ${result.fontMatch ? '✔️ مكتشف' : '❌ غير مكتشف'}${result.fontMatchConfidence ? ' — ثقة: ' + result.fontMatchConfidence + '%' : ''}</div>
        </div>
        ${colorTotal ? `
        <div class="card" id="section-colors">
          <h2>تحليل الألوان</h2>
          <div class="meta">مقارنة ألوان الموقع مع ألوان هوية التصميم الموحدة. انقر على الصف لفتح swatch أو حفظ اللون.</div>
          <div style="display:flex;gap:8px;align-items:center;justify-content:flex-start;margin-top:8px">
            <label class="meta" style="margin:0 8px 0 0">تصفية الألوان:</label>
            <select id="color-filter" onchange="(function(v){ filterColorTable(v); document.querySelectorAll('#colors-table-body tr').forEach(r=>{ r.dataset.matchFilter = (v === 'all' ? 'visible' : (r.dataset.match === v ? 'visible' : 'hidden')) }) })(this.value)" style="padding:6px 10px;border-radius:8px;border:1px solid #e6eefc;background:#fff">
              <option value="all">الكل</option>
              <option value="correct">مطابقة</option>
              <option value="wrong">غير متطابقة</option>
            </select>

            <label style="margin-left:12px;display:flex;align-items:center;gap:6px"><input type="checkbox" id="unique-colors" onchange="toggleUniqueColors(this.checked)"> عرض الألوان الفريدة فقط</label>

            <label style="margin-left:12px">فرز:</label>
            <select id="color-sort" onchange="sortColorTable(this.value)" style="padding:6px 10px;border-radius:8px;border:1px solid #e6eefc;background:#fff">
              <option value="default">افتراضي</option>
              <option value="distance-asc">المسافة (تصاعدي)</option>
              <option value="distance-desc">المسافة (تنازلي)</option>
            </select>
          </div>
          <div style="overflow:auto;margin-top:12px">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="text-align:right">
                  <th style="padding:8px 10px;border-bottom:1px solid #e6eefc">لون الموقع</th>
                  <th style="padding:8px 10px;border-bottom:1px solid #e6eefc">أقرب لون للهوية</th>
                  <th style="padding:8px 10px;border-bottom:1px solid #e6eefc">المسافة</th>
                  <th style="padding:8px 10px;border-bottom:1px solid #e6eefc">مطابقة</th>
                </tr>
              </thead>
              <tbody>
                ${result.colorAudit.map((r,i) => `
                  <tr id="color-row-${i}" class="color-table-row ${r.match ? 'match' : 'no-match'}" data-match="${r.match ? 'correct' : 'wrong'}" data-distance="${r.distance !== null && r.distance !== undefined ? r.distance.toFixed(1) : 9999}" data-index="${i}" data-color="${r.color}" style="border-bottom:1px dashed #f1f5f9">
                    <td style="padding:10px;text-align:right"><span class="swatch" style="background:${r.color}"></span> ${r.color}</td>
                    <td style="padding:10px;text-align:right">${r.closest ? `<span class="swatch" style="background:${r.closest}"></span> ${r.closest}` : '-'}</td>
                    <td style="padding:10px;text-align:right">${r.distance !== null && r.distance !== undefined ? r.distance.toFixed(1) : '-'}</td>
                    <td style="padding:10px;text-align:right">${r.match ? '✔️' : '❌'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        ${(() => {
          // Get all non-matched colors from the color audit
          const nonMatchedColors = (result.colorAudit || []).filter(r => !r.match);
          if (nonMatchedColors.length === 0) return '';
          
          // Create a map of colors that have screenshots
          const colorFailuresMap = new Map();
          if (result.colorFailures && result.colorFailures.length) {
            result.colorFailures.forEach(cf => {
              colorFailuresMap.set(cf.color, cf);
            });
          }
          
          return `
        <div class="card" id="section-color-failures">
          <h2>ألوان غير متوافقة — مواقع الظهور</h2>
          <div class="meta">جميع الألوان غير المتوافقة مع معايير التصميم الموحد. الألوان التي تم تصويرها تحتوي على صورة توضيحية.</div>
          <div id="failures-grid" style="margin-top:12px;display:grid;grid-template-columns:repeat(3,1fr);gap:12px;align-items:start">
            ${nonMatchedColors.map((colorAudit, idx) => {
              const cf = colorFailuresMap.get(colorAudit.color);
              if (cf) {
                // Color with screenshot
                return `
              <div style="background:#fff;border:1px solid #eee;padding:10px;border-radius:10px;box-shadow:0 4px 12px rgba(2,6,23,0.04);">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><div class="swatch" style="background:${cf.color};width:28px;height:28px;border-radius:6px;border:1px solid #ddd"></div><div style="font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${cf.color}</div></div>
                <img src="/reports/${cf.screenshot}" style="width:100%;height:140px;object-fit:cover;border-radius:8px;cursor:pointer" onclick="showFullScreenshot('/reports/${cf.screenshot}')">
                <div style="margin-top:8px;font-size:12px;color:var(--muted);max-height:64px;overflow:hidden">${cf.snippet ? cf.snippet.replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''}</div>
                <div style="margin-top:8px;font-size:12px;color:var(--muted)"><strong>Selector:</strong> <code style="font-size:12px">${cf.selector || 'N/A'}</code></div>
                <div style="margin-top:4px;font-size:12px;color:var(--muted)"><strong>Rect:</strong> ${cf.rect ? `x:${Math.round(cf.rect.x)}, y:${Math.round(cf.rect.y)}, w:${Math.round(cf.rect.width)}, h:${Math.round(cf.rect.height)}` : 'N/A'}</div>
                <div style="margin-top:8px"><a href="${cf.screenshot}" target="_blank" class="btn" style="display:inline-block;padding:8px 10px;font-size:13px">فتح الصورة</a></div>
              </div>
                `;
              } else {
                // Color without screenshot - just show the color info
                return `
              <div style="background:#fff;border:1px solid #eee;padding:10px;border-radius:10px;box-shadow:0 4px 12px rgba(2,6,23,0.04);">
                <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                  <div class="swatch" style="background:${colorAudit.color};width:28px;height:28px;border-radius:6px;border:1px solid #ddd"></div>
                  <div style="font-size:13px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${colorAudit.color}</div>
                </div>
                <div style="height:140px;background:linear-gradient(135deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(135deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0);background-size:20px 20px;background-position:0 0, 10px 10px;border-radius:8px;display:flex;align-items:center;justify-content:center">
                  <div style="background:${colorAudit.color};width:80px;height:80px;border-radius:50%;border:2px solid #ddd;box-shadow:0 2px 8px rgba(0,0,0,0.1)"></div>
                </div>
                <div style="margin-top:8px;font-size:12px;color:var(--muted)"><strong>أقرب لون:</strong> ${colorAudit.closest || 'N/A'}</div>
                <div style="margin-top:4px;font-size:12px;color:var(--muted)"><strong>المسافة:</strong> ${colorAudit.distance !== null && colorAudit.distance !== undefined ? colorAudit.distance.toFixed(1) : 'N/A'}</div>
                <div style="margin-top:4px;font-size:11px;color:#dc2626;background:#fee;padding:6px 8px;border-radius:6px;text-align:center">لم يتم التقاط صورة لهذا اللون</div>
              </div>
                `;
              }
            }).join('')}
          </div>
        </div>
          `;
        })()}
        ` : ''}
        <!-- Language Validation Section -->
        <div class="card" id="section-language">
          <h2>اللغة الأساسية للموقع</h2>
          ${(() => {
            const lang = result.primaryLanguage || null;
            const conf = result.primaryLanguageConfidence || 0;
            const suggestions = result.languageSuggestions || [];
            if (!lang) {
              return `<div class="meta">لم نتمكن من تحديد اللغة الأساسية للموقع.</div>`;
            }
            if (lang === 'ar') {
              return `
                <div style="display:flex;flex-direction:column;gap:10px;">
                  <div style="font-weight:700;color:var(--primary)">اللغة الأساسية: العربية</div>
                  <div class="meta">مستوى الثقة: ${conf}% — الموقع يبدو أنه يستخدم العربية كلغة أساسية.</div>
                </div>
              `;
            }
            // Non-Arabic or mixed
            return `
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="font-weight:700;color:#dc2626">اللغة الأساسية ليست عربية (${lang})</div>
                <div class="meta">مستوى الثقة: ${conf}% — يُطلب من الهيئة الرقمية أن تكون اللغة الأساسية عربية.</div>
                <div style="margin-top:10px">
                  <strong>اقتراحات لتطبيق اللغة العربية كلغة أساسية:</strong>
                  <ul style="margin-top:8px;color:#475569">
                    ${suggestions.map(s => `<li>${s}</li>`).join('')}
                  </ul>
                </div>
              </div>
            `;
          })()}
        </div>
        
        <!-- Sitemap Section -->
        <div class="card" id="section-sitemap">
          <h2>خريطة الموقع (Sitemap)</h2>
          ${(() => {
            const s = result.sitemapUrls || [];
            if (!s || !s.length) return `<div class="meta">لم يتم العثور على خريطة موقع.</div>`;
            
            // Categorize sitemaps
            const visible = s.filter(u => !u.match(/\.xml(\.gz)?(\?|$)/) && u.match(/\/sitemap\/?$|\/site-map\/?$|sitemap\.html$/i));
            const xml = s.filter(u => u.match(/\.xml(\.gz)?(\?|$)/i));
            const other = s.filter(u => !visible.includes(u) && !xml.includes(u));
            
            return `
              <div style="display:flex;flex-direction:column;gap:16px;">
                <div class="meta">تم العثور على <strong>${s.length}</strong> خريطة موقع. يمكنك فتح أي رابط لمراجعتها.</div>
                
                ${visible.length > 0 ? `
                  <div style="background:#f0fdf4;padding:12px;border-radius:8px;border-right:3px solid #16a34a">
                    <h3 style="color:#15803d;margin:0 0 8px 0;font-size:1.1em">📄 خرائط الموقع المرئية (للمستخدمين)</h3>
                    <div class="meta" style="color:#166534;margin-bottom:8px">هذه صفحات HTML يمكن للزوار الوصول إليها مباشرة</div>
                    <ul style="color:#166534">
                      ${visible.map(u => `<li><a href="${u}" target="_blank" style="color:#15803d;font-weight:600">${u}</a></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
                
                ${xml.length > 0 ? `
                  <div style="background:#eff6ff;padding:12px;border-radius:8px;border-right:3px solid #2563eb">
                    <h3 style="color:#1e40af;margin:0 0 8px 0;font-size:1.1em">🤖 خرائط XML (لمحركات البحث)</h3>
                    <div class="meta" style="color:#1e40af;margin-bottom:8px">ملفات XML تستخدمها محركات البحث للزحف</div>
                    <ul style="color:#1e40af">
                      ${xml.map(u => `<li><a href="${u}" target="_blank" style="color:#2563eb">${u}</a></li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            `;
          })()}
        </div>
        
        <!-- Template Match Section (hidden) -->
        <div class="card" id="section-template-match" style="display:none">
          <h2>مطابقة القالب</h2>
          ${(() => {
            const tm = result.templateMatch || null;
            
            // Handle error states
            if (!tm) {
              return `<div class="meta">لم يتم تشغيل فحص مطابقة القالب.</div>`;
            }
            
            if (tm.__status === 'error') {
              return `<div style="color:#dc2626">حدث خطأ أثناء فحص القالب: ${tm.__error || 'خطأ غير معروف'}</div>`;
            }
            
            if (tm.__status === 'no_templates_matched') {
              return `<div class="meta">لم يتم العثور على ملفات القوالب في المسار: <code>config/cookiesbanner.tsx</code> و <code>config/rating.tsx</code></div>`;
            }
            
            // Support object with multiple template comparisons (cookies, rating)
            if (typeof tm === 'object' && (tm.cookies || tm.rating)) {
              const parts = [];
              ['cookies','rating'].forEach(key => {
                const t = tm[key] || null;
                if (!t) return;
                const score = (typeof t.score === 'number') ? t.score.toFixed(0) : '-';
                const matchedList = (t.matchedTokens || []).slice(0,10).map(x => `<li>${x}</li>`).join('');
                const missingCount = (t.missingTokens || []).length;
                parts.push(`
                  <div style="display:flex;flex-direction:column;gap:8px;padding:8px;border-radius:8px;background:#fff;border:1px solid #eef6ff">
                    <div style="font-weight:700;color:var(--primary)">${key === 'cookies' ? 'مقارنة قالب ملفات الكوكيز' : 'مقارنة قالب التقييم'}</div>
                    <div class="meta">نسبة المطابقة: ${score}% — مجموع الرموز: ${t.tokensCount || 0} — المكتشفة: ${(t.matchedTokens || []).length} — المفقودة: ${missingCount}</div>
                    <div><strong>أهم الرموز المكتشفة:</strong><ul style="margin-top:8px;color:#475569">${matchedList || '<li>لا توجد رموز مكتشفة</li>'}</ul></div>
                    ${missingCount ? `<div style="color:#7f1d1d"><strong>ملحوظة:</strong> يوجد ${missingCount} رمزًا مفقودًا قد يشير إلى اختلاف في القالب.</div>` : `<div class="meta" style="color:#15803d">تشابه جيد مع القالب.</div>`}
                  </div>
                `);
              });
              return parts.join('');
            }
            // Fallback: single template object
            const score = (typeof tm.score === 'number') ? tm.score.toFixed(0) : '-';
            const matchedList = (tm.matchedTokens || []).slice(0,10).map(t => `<li>${t}</li>`).join('');
            const missingCount = (tm.missingTokens || []).length;
            return `
              <div style="display:flex;flex-direction:column;gap:10px;">
                <div style="font-weight:700;color:var(--primary)">نسبة المطابقة: ${score}%</div>
                <div class="meta">مجموع الرموز المراد التحقق منها: ${tm.tokensCount || 0} — المكتشفة: ${(tm.matchedTokens || []).length} — المفقودة: ${missingCount}</div>
                <div>
                  <strong>أهم الرموز المكتشفة:</strong>
                  <ul style="margin-top:8px;color:#475569">${matchedList || '<li>لا توجد رموز مكتشفة</li>'}</ul>
                </div>
                ${missingCount ? `<div style="margin-top:8px;color:#7f1d1d"><strong>ملحوظة:</strong> يوجد ${missingCount} رمزًا مفقودًا قد يشير إلى اختلاف في القالب.</div>` : `<div class="meta" style="color:#15803d">القالب متطابق إلى حد كبير.</div>`}
              </div>
            `;
          })()}
        </div>

        <!-- Removed Uploads Section - Now in separate page -->

        <!-- Removed unique color set display per request -->
        <div class="card" id="section-design">
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

        <!-- Performance Section -->
        <div class="card" id="section-performance">
          <h2>تحليل الأداء</h2>
          ${(() => {
            const perf = (result.performance && result.performance.metrics) ? result.performance.metrics : null;
            const resources = (result.performance && result.performance.resourceStats) ? result.performance.resourceStats : { requestCount: 0, transferSizeBytes: 0 };
            if (!perf) {
              return `<div class="meta">لم تتوفر بيانات أداء تفصيلية لهذا الفحص.</div>`;
            }
            // Render timings in seconds for readability
            const toSec = (ms) => (ms === null || ms === undefined) ? null : (ms/1000);
            const cards = [];
            if (perf.fcpMs !== null && perf.fcpMs !== undefined) cards.push({ k: 'FCP', label: 'FCP (أول محتوى مرئي)', value: `${toSec(perf.fcpMs).toFixed(2)} ثانية` });
            if (perf.lcpMs !== null && perf.lcpMs !== undefined) cards.push({ k: 'LCP', label: 'LCP (أكبر عنصر مرئي)', value: `${toSec(perf.lcpMs).toFixed(2)} ثانية` });
            if (perf.domContentLoadedMs !== null && perf.domContentLoadedMs !== undefined) cards.push({ k: 'DCL', label: 'DOM Content Loaded', value: `${toSec(perf.domContentLoadedMs).toFixed(2)} ثانية` });
            if (perf.loadEventEndMs !== null && perf.loadEventEndMs !== undefined) cards.push({ k: 'LOAD', label: 'اكتمال تحميل الصفحة', value: `${toSec(perf.loadEventEndMs).toFixed(2)} ثانية` });
            if (perf.totalBlockingTimeMs !== null && perf.totalBlockingTimeMs !== undefined) cards.push({ k: 'TBT', label: 'إجمالي وقت الحظر (TBT)', value: `${toSec(perf.totalBlockingTimeMs).toFixed(2)} ثانية` });
            if (perf.speedIndexSec !== null && perf.speedIndexSec !== undefined) cards.push({ k: 'SI', label: 'سرعة العرض (Speed Index)', value: `${perf.speedIndexSec.toFixed(2)} ثانية` });
            cards.push({ k: 'REQ', label: 'عدد الطلبات', value: `${(resources.requestCount || 0)}` });
            cards.push({ k: 'SIZE', label: 'حجم الموارد (تقريبي)', value: `${resources.transferSizeBytes ? (Math.round(resources.transferSizeBytes/1024)) + ' ك.بايت' : 'غير متوفر'}` });

            const cardsHtml = cards.map(c => `
              <div style="background:#fff;border:1px solid #e6eefc;padding:12px;border-radius:10px;display:flex;flex-direction:column;gap:8px;text-align:right">
                <div style="font-weight:700;color:var(--primary);font-size:0.95em">${c.label}</div>
                <div style="font-size:1.2em;font-weight:700;color:#0f172a">${c.value}</div>
              </div>
            `).join('');

            // Generate suggestions based on thresholds
            const suggestions = [];
            if (perf.lcpMs && perf.lcpMs > 2500) suggestions.push({ title: 'تحسين LCP', description: 'LCP أعلى من 2.5s؛ قم بتحسين تحميل الصور والموارد الحرجة وضبط التحميل الكسول.' });
            if (perf.fcpMs && perf.fcpMs > 1000) suggestions.push({ title: 'رفع FCP', description: 'FCP بطيء؛ قلل الموارد الحرجة وادمج CSS الحرجة إن أمكن.' });
            if (perf.totalBlockingTimeMs && perf.totalBlockingTimeMs > 300) suggestions.push({ title: 'تقليل TBT', description: 'وجود مهام طويلة تؤثر على التفاعل؛ احرص على تفكيك البرامج الثقيلة أو تأجيلها.' });
            if ((resources.requestCount || 0) > 90) suggestions.push({ title: 'تقليل عدد الطلبات', description: 'عدد كبير من الطلبات يزيد زمن التحميل. دمج الموارد وتقليل الحزم يساعد.' });

            // Speed Index guidance
            const speedIndex = perf.speedIndexSec || null;
            if (speedIndex !== null) {
              if (speedIndex > 3.5) {
                suggestions.push({ title: 'تحسين سرعة العرض (Speed Index)', description: 'سرعة العرض أعلى من المستوى المطلوب؛ اقترح تقليل حجم المرئيات واستخدام صيغ حديثة مثل WebP وتقليل عدد طلبات HTTP عن طريق تجميع الموارد وتأخير تحميل الموارد غير الحرجة.' });
              } else {
                // positive note (not a critical suggestion)
                suggestions.push({ title: 'سرعة العرض جيدة', description: 'Speed Index ضمن النطاق الجيد (' + speedIndex.toFixed(2) + 's). حافظ على تقليل أحجام الصور وعدد الطلبات للحفاظ على الأداء.' });
              }
            }

            const suggestionsHtml = suggestions.length ? `
              <div style="margin-top:14px">
                <h3 style="margin:0 0 8px 0;color:var(--primary)">اقتراحات لتحسين الأداء</h3>
                <div style="display:flex;flex-direction:column;gap:10px">${suggestions.map(s => `<div style="background:#fff;padding:12px;border-radius:8px;border-left:4px solid #f59e0b"><strong>${s.title}</strong><div style="color:#475569;margin-top:6px">${s.description}</div></div>`).join('')}</div>
              </div>
            ` : '<div class="meta" style="margin-top:12px;color:#15803d">لا توجد توصيات حرجة للأداء.</div>';

            const testingHtml = `
              <div style="margin-top:14px;padding:12px;background:#fbfdff;border-radius:8px;border:1px solid #eef6ff">
                <div style="color:#475569;margin-top:6px;line-height:1.6">القيم مأخوذة من واجهة window.performance داخل الصفحة: FCP وLCP من Paint/PerformanceEntry، DCL وLoad من توقيتات التنقل، وTTB مقدر من سجلات longtask.</div>
              </div>
            `;

            const resourcesHtml = `
              <div style="margin-top:12px;padding:12px;background:#fff;border-radius:8px;border:1px solid #eef2ff">
                <strong style="color:var(--primary)">ملخص الموارد:</strong>
                <div style="color:#475569;margin-top:6px">عدد الطلبات: <strong>${resources.requestCount || 0}</strong> — حجم إجمالي (تقريبي): <strong>${resources.transferSizeBytes ? Math.round(resources.transferSizeBytes/1024) + ' ك.بايت' : 'غير متوفر'}</strong></div>
              </div>
            `;

            return `
              <div class="performance-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-top:12px">${cardsHtml}</div>
              ${resourcesHtml}
              ${testingHtml}
              ${suggestionsHtml}
            `;
          })()}
        </div>

        <!-- AI Recommendations Section -->
        <div class="card" id="section-ai" style="background:linear-gradient(135deg,#f0f9ff,#fff);border:2px solid var(--accent)">
          <h2 style="display:flex;align-items:center;gap:10px">
            <svg viewBox="0 0 24 24" style="width:28px;height:28px" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5"/></svg>
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
        <div class="card" id="section-responsive">
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
        <div class="card" id="section-export">
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
              <div style="margin-top:10px">
                <a href="files.html" class="btn" style="background:#2563eb;display:inline-block;text-decoration:none;padding:12px 14px">فتح صفحة الملفات</a>
              </div>
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
        <img src="${ramworldLogo}" alt="Ramworld Logo" style="order:1;">
        <div class="info" style="order:2;">
          <div style="font-size:10pt;font-weight:600;color:var(--primary)">مدقق التصميم الموحد</div>
          <div class="ltr" style="font-size:9pt;color:#6b7280;margin-top:2px">www.ramworld.net | +966 55 506 7508</div>
        </div>
        <div class="page-number" style="font-size:10pt;font-weight:600;color:var(--primary);order:3;"></div>
        <img src="${initialEntityLogoSrc}" alt="Entity Logo" style="order:4;">
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
            const currentPath = (window.location && window.location.pathname) ? window.location.pathname : '/reports/report.html';
            const resp = await fetch(origin + '/report-pdf?path=' + encodeURIComponent(currentPath));
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
  // Save to a unique subfolder: <sanitized-domain>-<timestamp>/report.html
  const ts = result.timestamp ? new Date(result.timestamp).getTime() : Date.now();
  const domainPart = (result.url || 'site')
    .replace(/^https?:\/\//, '')
    .replace(/[\/:?&#%\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const slug = `${domainPart}-${ts}`;
  const outDir = `reports/${slug}`;
  try { if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true }); } catch (e) {}

  // Entity logo: always use logo.png from the scanned URL folder if it exists
  let entityLogoSrc;
  const logoPath = `${outDir}/logo.png`;
  if (fs.existsSync(logoPath)) {
    entityLogoSrc = `/reports/${slug}/logo.png`;
  } else if (result.favicon && /^https?:/i.test(result.favicon)) {
    entityLogoSrc = result.favicon;
  } else {
    entityLogoSrc = 'https://via.placeholder.com/80x48?text=Logo';
  }

  fs.writeFileSync(`${outDir}/report.html`, html, 'utf-8');
  
  // Generate comprehensive files page with enhanced upload scanner results
  try {
    const uploads = result.uploads || null;
    const filesHtml = `<!doctype html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="utf-8">
      <title>فحص المرفقات والتحميلات — ${result.title || ''}</title>
      <meta name="viewport" content="width=device-width,initial-scale=1">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'IBM Plex Sans Arabic', Arial, sans-serif; background: linear-gradient(135deg, #f4f7fb 0%, #e8f0f7 100%); padding: 24px; line-height: 1.6; color: #1f2937; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #062c6e, #2563eb); color: white; padding: 32px; border-radius: 16px; margin-bottom: 24px; box-shadow: 0 8px 24px rgba(6,44,110,0.2); }
        .header h1 { font-size: 2em; font-weight: 700; margin-bottom: 8px; }
        .header .meta { opacity: 0.95; font-size: 0.95em; }
        .card { background: white; padding: 24px; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); margin-bottom: 24px; border: 1px solid #e5e7eb; }
        .card h2 { color: #062c6e; margin-bottom: 16px; font-size: 1.5em; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
        .card h3 { color: #1f2937; margin: 16px 0 12px; font-size: 1.2em; }
        .stats { display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 20px; }
        .stat-box { flex: 1; min-width: 200px; background: linear-gradient(135deg, #f6f9ff, #fff); padding: 20px; border-radius: 10px; border: 2px solid #e0e7ff; text-align: center; }
        .stat-box.danger { border-color: #fee; background: linear-gradient(135deg, #fff5f5, #fff); }
        .stat-box.warning { border-color: #fef3c7; background: linear-gradient(135deg, #fffbeb, #fff); }
        .stat-box.success { border-color: #d1fae5; background: linear-gradient(135deg, #f0fdf4, #fff); }
        .stat-value { font-size: 2em; font-weight: 700; color: #062c6e; margin-bottom: 4px; }
        .stat-label { color: #6b7280; font-size: 0.9em; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #f9fafb; padding: 12px; border-bottom: 2px solid #e5e7eb; text-align: right; font-weight: 600; color: #062c6e; }
        td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; text-align: right; }
        tr:hover { background: #f9fafb; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.85em; font-weight: 600; margin: 0 4px; }
        .badge.danger { background: #fee2e2; color: #991b1b; }
        .badge.warning { background: #fef3c7; color: #92400e; }
        .badge.success { background: #d1fae5; color: #065f46; }
        .badge.info { background: #dbeafe; color: #1e40af; }
        a { color: #2563eb; text-decoration: none; word-break: break-all; }
        a:hover { text-decoration: underline; }
        .btn { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; border-radius: 8px; text-decoration: none; font-weight: 600; transition: all 0.2s; border: none; cursor: pointer; }
        .btn:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.3); }
        .alert { padding: 16px; border-radius: 8px; margin-bottom: 16px; border-right: 4px solid; }
        .alert.danger { background: #fef2f2; border-color: #dc2626; color: #7f1d1d; }
        .alert.warning { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
        .alert.info { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
        .category-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin: 16px 0; }
        .category-card { background: #f9fafb; padding: 16px; border-radius: 8px; text-align: center; border: 1px solid #e5e7eb; }
        .category-card strong { display: block; font-size: 1.8em; color: #2563eb; margin-bottom: 4px; }
        .file-icon { width: 24px; height: 24px; display: inline-block; margin-left: 8px; vertical-align: middle; }
        .security-issue { background: #fef2f2; padding: 12px; border-radius: 8px; border-right: 3px solid #dc2626; margin-bottom: 12px; }
        .security-issue strong { color: #991b1b; }
        .back-btn { position: fixed; bottom: 24px; left: 24px; z-index: 100; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📤 فحص المرفقات والتحميلات</h1>
          <div class="meta">
            <strong>الموقع:</strong> ${result.url || 'غير متوفر'}<br>
            <strong>التاريخ:</strong> ${new Date().toLocaleDateString('ar-SA')}
          </div>
        </div>

        ${(() => {
          if (!uploads) return `<div class="card"><div class="alert info">⚠️ لم يتم تشغيل فحص التحميلات أو لا توجد بيانات.</div></div>`;
          
          const inputs = uploads.foundUploadInputs || [];
          const forms = uploads.formsWithFile || [];
          const files = uploads.linkedFiles || [];
          const dirlist = uploads.directoryListing || [];
          const summary = uploads.summary || {};
          const formsWithIssues = uploads.formsWithIssues || [];
          const apiEndpoints = uploads.apiEndpoints || [];
          const securityIssues = summary.securityIssues || [];
          
          const formatBytes = (bytes) => {
            if (!bytes || bytes === 0) return '0 بايت';
            const k = 1024;
            const sizes = ['بايت', 'ك.بايت', 'م.بايت', 'ج.بايت'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
          };
          
          return `
            <!-- Overall Summary -->
            <div class="card">
              <h2>📊 ملخص الفحص</h2>
              <div class="stats">
                <div class="stat-box">
                  <div class="stat-value">${inputs.length}</div>
                  <div class="stat-label">حقول رفع الملفات</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">${forms.length}</div>
                  <div class="stat-label">نماذج بها تحميل</div>
                </div>
                <div class="stat-box ${files.length > 0 ? 'info' : ''}">
                  <div class="stat-value">${files.length}</div>
                  <div class="stat-label">روابط ملفات مكتشفة</div>
                </div>
                <div class="stat-box ${summary.publicFiles > 0 ? 'success' : ''}">
                  <div class="stat-value">${summary.publicFiles || 0}</div>
                  <div class="stat-label">ملفات قابلة للوصول</div>
                </div>
                <div class="stat-box ${summary.confidentialCount > 0 ? 'danger' : ''}">
                  <div class="stat-value">${summary.confidentialCount || 0}</div>
                  <div class="stat-label">ملفات حساسة</div>
                </div>
                <div class="stat-box ${summary.suspiciousCount > 0 ? 'warning' : ''}">
                  <div class="stat-value">${summary.suspiciousCount || 0}</div>
                  <div class="stat-label">امتدادات خطرة</div>
                </div>
              </div>
              
              ${summary.totalSize ? `<div class="alert info"><strong>📦 إجمالي حجم الملفات المكتشفة:</strong> ${formatBytes(summary.totalSize)}</div>` : ''}
              
              ${securityIssues.length > 0 ? `
                <div class="alert danger">
                  <strong>🔴 تحذير أمني:</strong> تم اكتشاف ${securityIssues.length} مشكلة أمنية محتملة في الملفات!
                </div>
              ` : ''}
            </div>

            <!-- Security Issues -->
            ${securityIssues.length > 0 ? `
              <div class="card">
                <h2>🔒 المشاكل الأمنية المكتشفة</h2>
                ${securityIssues.map(issue => `
                  <div class="security-issue">
                    <strong>${issue.severity === 'high' ? '🔴 خطورة عالية' : '🟡 خطورة متوسطة'}</strong><br>
                    <strong>الملف:</strong> ${issue.file}<br>
                    <strong>المشكلة:</strong> ${issue.issue}
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- File Categories -->
            ${summary.byCategory && Object.keys(summary.byCategory).length > 0 ? `
              <div class="card">
                <h2>📂 تصنيف الملفات حسب النوع</h2>
                <div class="category-grid">
                  ${Object.entries(summary.byCategory).map(([category, count]) => `
                    <div class="category-card">
                      <strong>${count}</strong>
                      <div style="color: #6b7280">${category === 'documents' ? 'مستندات' : 
                        category === 'archives' ? 'أرشيفات' :
                        category === 'media' ? 'وسائط' :
                        category === 'code' ? 'كود' :
                        category === 'executables' ? 'تنفيذية' :
                        category === 'scripts' ? 'سكربتات' :
                        category === 'security' ? 'أمنية' :
                        category === 'database' ? 'قواعد بيانات' :
                        category === 'backup' ? 'نسخ احتياطية' : 'أخرى'}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Linked Files Table -->
            ${files.length > 0 ? `
              <div class="card">
                <h2>📎 روابط الملفات المكتشفة</h2>
                <div style="overflow-x:auto">
                  <table>
                    <thead>
                      <tr>
                        <th>اسم الملف</th>
                        <th>الرابط</th>
                        <th>الحالة</th>
                        <th>النوع</th>
                        <th>الحجم</th>
                        <th>التصنيف</th>
                        <th>الملاحظات</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${files.map(f => `
                        <tr>
                          <td><strong>${f.filename || 'غير معروف'}</strong></td>
                          <td><a href="${f.url}" target="_blank">${f.url.length > 60 ? f.url.substring(0, 60) + '...' : f.url}</a></td>
                          <td>
                            ${f.publicAccessible ? '<span class="badge success">مفتوح</span>' : 
                              f.status ? `<span class="badge warning">${f.status}</span>` : 
                              '<span class="badge">غير متوفر</span>'}
                          </td>
                          <td style="font-size:0.85em">${f.contentType || '-'}</td>
                          <td>${f.contentLength ? formatBytes(f.contentLength) : '-'}</td>
                          <td>
                            <span class="badge ${f.category === 'executables' || f.category === 'scripts' ? 'danger' : 
                              f.category === 'backup' ? 'warning' : 'info'}">
                              ${f.category || 'other'}
                            </span>
                          </td>
                          <td>
                            ${f.suspiciousName ? '<span class="badge danger">حساس</span>' : ''}
                            ${f.dangerousExt ? '<span class="badge warning">خطير</span>' : ''}
                            ${f.isBackup ? '<span class="badge warning">نسخة احتياطية</span>' : ''}
                            ${f.error ? '<span class="badge">خطأ</span>' : ''}
                          </td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              </div>
            ` : '<div class="card"><div class="alert info">لم يتم العثور على روابط ملفات قابلة للفحص.</div></div>'}

            <!-- Forms with File Upload -->
            ${forms.length > 0 ? `
              <div class="card">
                <h2>📝 نماذج رفع الملفات</h2>
                <table>
                  <thead>
                    <tr>
                      <th>الإجراء (Action)</th>
                      <th>الطريقة</th>
                      <th>نوع التشفير</th>
                      <th>عدد حقول الملفات</th>
                      <th>CSRF Token</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${forms.map(f => `
                      <tr>
                        <td>${f.action || 'N/A'}</td>
                        <td><span class="badge ${f.method === 'POST' ? 'success' : 'warning'}">${f.method}</span></td>
                        <td><span class="badge ${f.enctype && f.enctype.includes('multipart') ? 'success' : 'danger'}">${f.enctype || 'غير محدد'}</span></td>
                        <td>${f.fileInputCount || 1}</td>
                        <td>${f.hasCSRFToken ? '<span class="badge success">✓ موجود</span>' : '<span class="badge danger">✗ مفقود</span>'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Forms with Security Issues -->
            ${formsWithIssues.length > 0 ? `
              <div class="card">
                <h2>⚠️ نماذج بها مشاكل أمنية</h2>
                ${formsWithIssues.map(f => `
                  <div class="alert ${f.severity === 'high' ? 'danger' : 'warning'}" style="margin-bottom:12px">
                    <strong>Action:</strong> ${f.action || 'N/A'}<br>
                    <strong>المشاكل المكتشفة:</strong>
                    <ul style="margin-right:20px;margin-top:8px">
                      ${f.issues.map(issue => `<li>${issue}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- File Input Details -->
            ${inputs.length > 0 ? `
              <div class="card">
                <h2>🔧 تفاصيل حقول رفع الملفات</h2>
                <table>
                  <thead>
                    <tr>
                      <th>الاسم/المعرف</th>
                      <th>أنواع الملفات المقبولة</th>
                      <th>متعدد</th>
                      <th>مطلوب</th>
                      <th>Form Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${inputs.map(input => `
                      <tr>
                        <td><code>${input.name || input.id || 'غير محدد'}</code></td>
                        <td style="font-size:0.85em">${input.accept || 'جميع الأنواع'}</td>
                        <td>${input.multiple ? '<span class="badge success">نعم</span>' : '<span class="badge">لا</span>'}</td>
                        <td>${input.required ? '<span class="badge warning">نعم</span>' : '<span class="badge">لا</span>'}</td>
                        <td style="font-size:0.85em">${input.formAction || '-'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Directory Listings -->
            ${dirlist && dirlist.length > 0 ? `
              <div class="card">
                <div class="alert danger">
                  <strong>🔴 تحذير:</strong> تم اكتشاف قوائم دلائل محتملة! هذا قد يمثل خطراً أمنياً.
                </div>
                <h3>📁 قوائم الدلائل المكتشفة</h3>
                <ul style="margin-right:20px">
                  ${dirlist.map(d => `<li><a href="${d.href}" target="_blank">${d.href}</a> ${d.text ? `— ${d.text}` : ''}</li>`).join('')}
                </ul>
              </div>
            ` : ''}

            <!-- API Endpoints -->
            ${apiEndpoints && apiEndpoints.length > 0 ? `
              <div class="card">
                <h2>🔌 نقاط API المكتشفة</h2>
                <div class="alert info">تم اكتشاف ${apiEndpoints.length} نقطة API محتملة في كود JavaScript</div>
                <ul style="margin-right:20px;column-count:2;column-gap:20px">
                  ${apiEndpoints.map(ep => `<li><code>${ep}</code></li>`).join('')}
                </ul>
              </div>
            ` : ''}
          `;
        })()}

        <div class="card" style="text-align:center;background:linear-gradient(135deg,#f6f9ff,#fff)">
          <p style="color:#6b7280;margin-bottom:16px">العودة إلى التقرير الرئيسي</p>
          <a href="report.html" class="btn">← العودة للتقرير</a>
        </div>
      </div>

      <a href="report.html" class="btn back-btn">← رجوع</a>
    </body>
    </html>`;

    fs.writeFileSync(`${outDir}/files.html`, filesHtml, 'utf-8');
    console.log(`✅ Files page saved in ${outDir}/files.html`);
  } catch (e) {
    // ignore files page generation errors
  }
  console.log(`✅ HTML report saved in ${outDir}/report.html`);
}
