import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const EXCEL_FILE = './scan-logs.xlsx';

/**
 * Log a scan request to Excel file
 * @param {string} email - User email
 * @param {string} url - Website URL
 * @param {boolean} fastMode - Whether fast mode was used
 */
export function logScanToExcel(email, url, fastMode = false) {
  try {
    let workbook;
    let worksheet;
    let data = [];

    // Check if file exists
    if (fs.existsSync(EXCEL_FILE)) {
      // Read existing file
      workbook = XLSX.readFile(EXCEL_FILE);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      data = XLSX.utils.sheet_to_json(worksheet);
    } else {
      // Create new workbook
      workbook = XLSX.utils.book_new();
    }

    // Add new entry
    const newEntry = {
      'Timestamp': new Date().toISOString(),
      'Email': email,
      'Website URL': url,
      'Fast Mode': fastMode ? 'Yes' : 'No',
      'Date': new Date().toLocaleDateString('ar-SA'),
      'Time': new Date().toLocaleTimeString('ar-SA')
    };

    data.push(newEntry);

    // Convert data to worksheet
    worksheet = XLSX.utils.json_to_sheet(data);

    // Set column widths for better readability
    worksheet['!cols'] = [
      { wch: 25 }, // Timestamp
      { wch: 30 }, // Email
      { wch: 40 }, // Website URL
      { wch: 10 }, // Fast Mode
      { wch: 15 }, // Date
      { wch: 15 }  // Time
    ];

    // Add or replace worksheet
    if (workbook.SheetNames.length === 0) {
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Scan Logs');
    } else {
      workbook.Sheets[workbook.SheetNames[0]] = worksheet;
    }

    // Write to file
    XLSX.writeFile(workbook, EXCEL_FILE);
    console.log(`✅ Logged scan: ${email} → ${url}`);
  } catch (error) {
    console.error('Error logging to Excel:', error);
  }
}
