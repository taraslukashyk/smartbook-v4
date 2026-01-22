const fs = require('fs');
const path = require('path');

const currentDir = 'd:/project/smartbook v4';
const sourceDir = path.join(currentDir, 'Методичка_split_by_sections');
const destDir = path.join(currentDir, 'website', 'docs');

console.log(`Source: ${sourceDir}`);
console.log(`Dest: ${destDir}`);

if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found!');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    // Matches: РОЗДІЛ_1._ВСТУП.md
    const match = file.match(/^РОЗДІЛ_(\d+)\._(.+)\.md$/);
    if (!match) {
        console.warn(`Skipping unknown file: ${file}`);
        return;
    }

    const chapterNum = parseInt(match[1]);
    let rawTitle = match[2];

    // Clean Title: replace underscores with spaces and remove trailing dots if any
    let cleanTitle = rawTitle.replace(/_/g, ' ').replace(/\.$/, '').trim();

    // Create folder name like 01-ВСТУП
    const folderName = `${chapterNum.toString().padStart(2, '0')}-${cleanTitle}`;
    const targetFolder = path.join(destDir, folderName);

    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true });

        // Create category file
        const categoryJson = {
            label: `${chapterNum}. ${cleanTitle}`,
            position: chapterNum,
            link: {
                type: 'generated-index',
                description: `Розділ ${chapterNum}: ${cleanTitle}`
            }
        };
        fs.writeFileSync(path.join(targetFolder, '_category_.json'), JSON.stringify(categoryJson, null, 2));
    }

    // Read content
    const content = fs.readFileSync(path.join(sourceDir, file), 'utf8');

    // Add frontmatter
    const frontmatter = `---
title: "${cleanTitle}"
sidebar_position: 1
---

`;

    // Save as index.md inside the folder so it's the main page of that section
    fs.writeFileSync(path.join(targetFolder, 'index.md'), frontmatter + content);
    console.log(`Migrated: ${file} -> ${folderName}/index.md`);
});

console.log('Migration of sections completed!');
