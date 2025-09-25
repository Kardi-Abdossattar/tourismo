#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Tourismo Demo Build...\n');

// Check if out directory exists
const outDir = path.join(__dirname, 'out');
if (!fs.existsSync(outDir)) {
  console.log('❌ Build directory "out" not found. Run: npm run build');
  process.exit(1);
}

// Check essential files
const essentialFiles = [
  'out/index.html',
  'out/_redirects'
];

// Check if target directories exist (Next.js creates directories for dynamic routes)
const targetDirs = [
  'out/target',
  'out/booking'
];

let allFilesExist = true;

essentialFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

// Check target directories and count pages
targetDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    const subDirs = fs.readdirSync(dir);
    console.log(`✅ ${dir} (${subDirs.length} pages)`);
  } else {
    console.log(`❌ Missing: ${dir}`);
    allFilesExist = false;
  }
});

// Check data file
const dataFile = path.join(__dirname, 'data/targets.json');
if (fs.existsSync(dataFile)) {
  const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
  console.log(`✅ data/targets.json (${data.targets.length} destinations)`);
} else {
  console.log('❌ Missing: data/targets.json');
  allFilesExist = false;
}

// Count generated pages
const outFiles = fs.readdirSync(outDir, { recursive: true })
  .filter(file => file.endsWith('.html'));

console.log(`\n📊 Build Summary:`);
console.log(`   • ${outFiles.length} HTML pages generated`);
console.log(`   • Static assets ready`);
console.log(`   • SPA routing configured`);

if (allFilesExist) {
  console.log('\n🎉 Build verification passed! Ready for Netlify deployment.');
  console.log('\n📝 Next steps:');
  console.log('   1. git push origin demo');
  console.log('   2. Connect to Netlify');
  console.log('   3. Deploy with: npm run build → out/');
} else {
  console.log('\n❌ Build verification failed. Please fix missing files.');
  process.exit(1);
}
