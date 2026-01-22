const fs = require('fs');
const path = require('path');

// Шлях до папки з документацією
const docsDir = path.join(__dirname, 'website', 'docs');

function updateCategoryFile(categoryPath) {
    const content = fs.readFileSync(categoryPath, 'utf8');
    const categoryData = JSON.parse(content);

    // Перевіряємо, чи це generated-index (що створює дублювання)
    if (categoryData.link && categoryData.link.type === 'generated-index') {
        // Змінюємо на doc, щоб категорія вела безпосередньо на index.md
        categoryData.link = {
            type: 'doc',
            id: path.basename(path.dirname(categoryPath)) + '/index'
        };

        fs.writeFileSync(categoryPath, JSON.stringify(categoryData, null, 2), 'utf8');
        console.log(`Оновлено: ${path.relative(docsDir, categoryPath)}`);
        return 1;
    }
    return 0;
}

function processDirectory(dir) {
    let filesProcessed = 0;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            // Шукаємо _category_.json у поточній директорії
            const categoryPath = path.join(fullPath, '_category_.json');
            if (fs.existsSync(categoryPath)) {
                filesProcessed += updateCategoryFile(categoryPath);
            }

            // Рекурсивно обробляємо підпапки
            filesProcessed += processDirectory(fullPath);
        }
    }

    return filesProcessed;
}

console.log('Початок оновлення файлів категорій для усунення дублювання...\n');
const totalFiles = processDirectory(docsDir);
console.log(`\nГотово! Оброблено категорій: ${totalFiles}`);
