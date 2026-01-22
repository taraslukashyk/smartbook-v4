const fs = require('fs');
const path = require('path');

// Шлях до папки з документацією
const docsDir = path.join(__dirname, 'website', 'docs');

/**
 * Docusaurus автоматично прибирає префікси типу "01-" з ID документів.
 * Нам потрібно оновити _category_.json, щоб ID відповідали реальним ID Docusaurus.
 */
function fixCategoryIds(categoryPath) {
    const content = fs.readFileSync(categoryPath, 'utf8');
    const categoryData = JSON.parse(content);

    if (categoryData.link && categoryData.link.type === 'doc') {
        const folderName = path.basename(path.dirname(categoryPath));

        // Видаляємо префікс "число-" з назви папки (наприклад, "01-ВСТУП" -> "ВСТУП")
        const cleanFolderName = folderName.replace(/^\d+-/, '');

        // Встановлюємо правильний ID: "чиста_назва_папки/index"
        const newId = `${cleanFolderName}/index`;

        if (categoryData.link.id !== newId) {
            categoryData.link.id = newId;
            fs.writeFileSync(categoryPath, JSON.stringify(categoryData, null, 2), 'utf8');
            console.log(`Виправлено ID у: ${path.relative(docsDir, categoryPath)} -> ${newId}`);
            return 1;
        }
    }
    return 0;
}

function processDirectory(dir) {
    let filesProcessed = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const categoryPath = path.join(fullPath, '_category_.json');
            if (fs.existsSync(categoryPath)) {
                filesProcessed += fixCategoryIds(categoryPath);
            }
            filesProcessed += processDirectory(fullPath);
        }
    }

    return filesProcessed;
}

console.log('Початок виправлення ID категорій для GitHub...\n');
const totalFiles = processDirectory(docsDir);
console.log(`\nГотово! Виправлено категорій: ${totalFiles}`);
