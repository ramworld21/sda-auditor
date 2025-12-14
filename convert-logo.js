import fs from 'fs';
import path from 'path';

const logoPath = path.join(process.cwd(), 'public', 'RAM D.png');
const logoBuffer = fs.readFileSync(logoPath);
const base64Logo = logoBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64Logo}`;

console.log('Logo converted to base64. Length:', base64Logo.length);
console.log('Data URI (first 100 chars):', dataUri.substring(0, 100));

// Save to a file for easy copying
fs.writeFileSync('logo-base64.txt', dataUri);
console.log('Saved to logo-base64.txt');
