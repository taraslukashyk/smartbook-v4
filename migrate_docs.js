const fs = require('fs');
const path = require('path');

// Setup paths
const currentDir = process.cwd(); // Should be d:\project\smartbook v4
const sourceDir = path.join(currentDir, 'Методичка_по розділах');
const destDir = path.join(currentDir, 'website', 'docs');

console.log(`Source: ${sourceDir}`);
console.log(`Dest: ${destDir}`);

if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found!');
    process.exit(1);
}

// Ensure destination exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// 1. Scan files to identify Chapter Names from "X.0_Title.md"
const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));
const chapterNames = {}; // { 1: "Вступ", 2: "Організація..." }

files.forEach(file => {
    // Regex for "1.0_Title.md" or "10.0_Title.md"
    const match = file.match(/^(\d+)\.0[._](.+)\.md$/);
    if (match) {
        const chapterNum = parseInt(match[1]);
        const title = match[2].replace(/_/g, ' ').trim();
        chapterNames[chapterNum] = title;
    }
});

console.log('Found Chapters:', chapterNames);

// 2. Process all files
files.forEach(file => {
    // Determine Chapter Number
    // Matches: 1.0_Title, 1.1._Title, 10.4.1._Title
    const match = file.match(/^(\d+)(\.(\d+))?(\.(\d+))?[._](.+)\.md$/);

    if (!match) {
        console.warn(`Skipping file with unknown format: ${file}`);
        return;
    }

    const chapterNum = parseInt(match[1]);
    const sectionNum = match[3] ? parseInt(match[3]) : 0;
    const subSectionNum = match[5] ? parseInt(match[5]) : 0;
    let rawTitle = match[6];

    // Clean title: remove leading underscore if exists and swap underscores for spaces
    let cleanTitle = rawTitle.replace(/^_/, '').replace(/_/g, ' ').trim();

    // Determine folder name
    // Pad chapter number: 01, 02, ... 10
    const paddedChapterNum = chapterNum.toString().padStart(2, '0');
    const chapterName = chapterNames[chapterNum] || `Chapter ${chapterNum}`;
    // Sanitize folder name (remove invalid chars)
    const safeChapterName = chapterName.replace(/[<>:"/\\|?*]/g, '');
    const folderName = `${paddedChapterNum}-${safeChapterName}`;

    const targetFolder = path.join(destDir, folderName);

    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });

        // Create _category_.json for the folder to control sidebar
        const categoryJson = {
            label: `${chapterNum}. ${chapterName}`,
            position: chapterNum,
            link: {
                type: 'generated-index',
                description: `Розділ ${chapterNum}: ${chapterName}`
            }
        };
        fs.writeFileSync(path.join(targetFolder, '_category_.json'), JSON.stringify(categoryJson, null, 2));
    }

    // Calculate sidebar position
    // 1.0 -> 0
    // 1.1 -> 1
    // 1.2 -> 2
    // 1.10 -> 10
    // For 1.1.1, it's harder to flatten into a single number for sorting if we mix depth.
    // But usually Docusaurus sorts by file name or frontmatter. 
    // Let's use a float-like logic or just "Order" if possible.
    // Simple approach: major * 1000 + minor * 10 + patch
    // Actually, within a folder (Chapter), we just care about sorting 1.0, 1.1, 1.2...

    const sidebarPosition = sectionNum * 100 + subSectionNum;

    // Read content
    let content = fs.readFileSync(path.join(sourceDir, file), 'utf8');

    // Prepare Frontmatter
    const frontmatter = `---
title: "${cleanTitle}"
sidebar_position: ${sidebarPosition}
---

`;

    // Write new file
    // Target filename: keep original but maybe cleaner? Let's keep original for traceability, 
    // or clean it up. Let's use the full original name to avoid collisions, but maybe just `cleanTitle.md`?
    // Use original filename to be safe against collisions like 1.1_A vs 1.1_B (though unlikely here).
    // Better: `section.subsection_Title.md`
    const destFileName = file;
    fs.writeFileSync(path.join(targetFolder, destFileName), frontmatter + content);

    console.log(`Migrated: ${file} -> ${folderName}/${destFileName}`);
});

console.log('Migration completed!');
