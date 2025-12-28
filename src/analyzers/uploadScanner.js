export async function analyzeUploads(page, baseUrl) {
  // Enhanced upload scanner with comprehensive detection
  const results = {
    foundUploadInputs: [],
    linkedFiles: [],
    summary: {
      suspiciousCount: 0,
      confidentialCount: 0,
      publicFiles: 0,
      totalSize: 0,
      byCategory: {},
      securityIssues: []
    },
    formsWithFile: [],
    directoryListing: [],
    formsWithIssues: [],
    apiEndpoints: [],
    downloadableAssets: []
  };

  // Enhanced DOM scan with more details
  const domScan = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type=file]')).map(i => {
      const form = i.closest('form');
      return {
        name: i.getAttribute('name') || null,
        id: i.id || null,
        accept: i.getAttribute('accept') || null,
        multiple: i.hasAttribute('multiple'),
        required: i.hasAttribute('required'),
        maxSize: i.getAttribute('max-size') || null,
        formAction: form ? (form.getAttribute('action') || null) : null,
        ariaLabel: i.getAttribute('aria-label') || null,
        outerHTML: i.outerHTML.substring(0, 200)
      };
    });

    const forms = Array.from(document.querySelectorAll('form')).map(f => {
      const fileInputs = f.querySelectorAll('input[type=file]');
      return {
        action: f.getAttribute('action') || null,
        method: (f.getAttribute('method') || 'GET').toUpperCase(),
        enctype: f.getAttribute('enctype') || null,
        hasFileInput: fileInputs.length > 0,
        fileInputCount: fileInputs.length,
        hasCSRFToken: !!(f.querySelector('input[name*="csrf"], input[name*="token"]')),
        id: f.id || null,
        className: f.className || null
      };
    });

    // Enhanced anchor detection with more metadata
    const anchors = Array.from(document.querySelectorAll('a[href]')).map(a => ({
      href: a.href,
      text: (a.innerText || '').trim().substring(0, 100),
      download: a.hasAttribute('download'),
      target: a.getAttribute('target') || null,
      title: a.getAttribute('title') || null,
      ariaLabel: a.getAttribute('aria-label') || null
    }));

    // Detect potential API endpoints from JavaScript
    const scripts = Array.from(document.querySelectorAll('script')).map(s => s.textContent).join(' ');
    const apiMatches = scripts.match(/['"]\/(api|upload|file|attachment|download)[^'"]{0,50}['"]/gi) || [];
    const apiEndpoints = [...new Set(apiMatches.map(m => m.replace(/['"\/]/g, '')))];

    return { inputs, forms, anchors, apiEndpoints };
  });

  const base = baseUrl || (await page.url());
  results.foundUploadInputs = domScan.inputs;
  results.formsWithFile = domScan.forms.filter(f => f.hasFileInput);
  results.apiEndpoints = domScan.apiEndpoints || [];

  // Enhanced file detection with more extensions and patterns
  const fileExtensions = {
    documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp', 'rtf', 'txt'],
    archives: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'tgz', 'iso'],
    media: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'mp4', 'avi', 'mov', 'mp3', 'wav'],
    code: ['js', 'css', 'html', 'json', 'xml', 'csv'],
    executables: ['exe', 'dll', 'msi', 'app', 'dmg', 'deb', 'rpm'],
    scripts: ['php', 'asp', 'aspx', 'jsp', 'py', 'rb', 'sh', 'bat', 'ps1', 'cmd'],
    security: ['pem', 'key', 'crt', 'cer', 'pfx', 'p12', 'jks'],
    database: ['sql', 'db', 'sqlite', 'mdb', 'accdb'],
    backup: ['bak', 'backup', 'old', 'tmp', 'log', 'swp']
  };

  const sensitiveKeywords = [
    'password', 'passwd', 'pwd', 'secret', 'confidential', 'private',
    'salary', 'payslip', 'payroll', 'passport', 'id-card', 'idcard',
    'ssn', 'national-id', 'credentials', 'auth', 'token', 'api-key',
    'certificate', 'license', 'contract', 'agreement', 'personal',
    'medical', 'health', 'financial', 'bank', 'credit-card'
  ];

  // Filter file-like anchors
  const fileLike = domScan.anchors.filter(a => {
    try {
      const url = new URL(a.href, base);
      const path = url.pathname.toLowerCase();
      
      // Check all file extensions
      const allExts = Object.values(fileExtensions).flat();
      if (allExts.some(ext => path.endsWith('.' + ext))) return true;
      
      // Check paths
      const filePaths = ['/uploads/', '/upload/', '/files/', '/documents/', '/attachments/',
                        '/downloads/', '/media/', '/assets/', '/storage/', '/public/',
                        '/static/files/', '/content/files/'];
      if (filePaths.some(p => path.includes(p))) return true;
      
      // Check if download attribute is present
      if (a.download) return true;
      
    } catch (e) {
      return false;
    }
    return false;
  });

  // Analyze each file with enhanced checks
  for (const a of fileLike) {
    try {
      const url = a.href;
      const urlObj = new URL(url, base);
      const path = urlObj.pathname.toLowerCase();
      const filename = path.split('/').pop() || '';
      
      // Determine category
      let category = 'other';
      for (const [cat, exts] of Object.entries(fileExtensions)) {
        if (exts.some(ext => filename.endsWith('.' + ext))) {
          category = cat;
          break;
        }
      }

      const r = await page.request.fetch(url, { method: 'HEAD', timeout: 10000 });
      const status = r.status();
      const headers = r.headers();
      const ct = headers['content-type'] || null;
      const len = headers['content-length'] ? parseInt(headers['content-length'], 10) : null;
      const lastModified = headers['last-modified'] || null;
      const publicAccessible = (status >= 200 && status < 300);

      // Security checks
      const lower = url.toLowerCase();
      const suspiciousName = sensitiveKeywords.some(kw => lower.includes(kw));
      const dangerousExt = Object.values([fileExtensions.executables, fileExtensions.scripts, fileExtensions.database]).flat()
        .some(ext => filename.endsWith('.' + ext));
      const isBackup = fileExtensions.backup.some(ext => filename.endsWith('.' + ext));
      const lacksSecurity = publicAccessible && (suspiciousName || dangerousExt || isBackup);

      const item = {
        url,
        filename,
        status,
        contentType: ct,
        contentLength: len,
        lastModified,
        publicAccessible,
        suspiciousName,
        dangerousExt,
        isBackup,
        category,
        lacksSecurity,
        downloadAttr: a.download,
        linkText: a.text
      };

      results.linkedFiles.push(item);

      // Update summary
      if (publicAccessible) results.summary.publicFiles++;
      if (suspiciousName) results.summary.confidentialCount++;
      if (dangerousExt) results.summary.suspiciousCount++;
      if (len) results.summary.totalSize += len;
      
      // Category count
      results.summary.byCategory[category] = (results.summary.byCategory[category] || 0) + 1;

      // Security issues
      if (lacksSecurity) {
        results.summary.securityIssues.push({
          file: filename,
          issue: suspiciousName ? 'اسم ملف حساس' : (dangerousExt ? 'امتداد خطير' : 'نسخة احتياطية مكشوفة'),
          severity: suspiciousName || dangerousExt ? 'high' : 'medium'
        });
      }

    } catch (e) {
      results.linkedFiles.push({
        url: a.href,
        error: e.message,
        linkText: a.text
      });
    }
  }

  // Directory listing detection
  const dirCandidates = domScan.anchors.filter(a =>
    /index of|directory listing|parent directory/i.test(a.text) ||
    /listing|browse/i.test(a.href) ||
    a.href.match(/\/(uploads?|files?|documents?|attachments?)\/?$/i)
  );
  results.directoryListing = dirCandidates.map(d => ({ href: d.href, text: d.text }));

  // Enhanced form issues detection
  results.formsWithIssues = results.formsWithFile.map(f => {
    const issues = [];
    if (!f.enctype || !f.enctype.includes('multipart')) issues.push('enctype غير صحيح');
    if (f.method !== 'POST') issues.push('method ليس POST');
    if (!f.hasCSRFToken) issues.push('لا يوجد CSRF token');
    if (!f.action || f.action === '#') issues.push('action غير محدد');
    
    return {
      action: f.action,
      method: f.method,
      enctype: f.enctype,
      fileInputCount: f.fileInputCount,
      hasCSRFToken: f.hasCSRFToken,
      issues: issues,
      severity: issues.length >= 2 ? 'high' : (issues.length === 1 ? 'medium' : 'low')
    };
  }).filter(f => f.issues.length > 0);

  return results;
}
