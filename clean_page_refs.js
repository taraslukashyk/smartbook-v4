const fs = require('fs');
const path = require('path');

// Шлях до папки з документацією
const docsDir = path.join(__dirname, 'website', 'docs');

// Регулярний вираз для пошуку рядків типу "ст. 3", "ст. 10" тощо
// Шукаємо окремий рядок, що містить лише "ст. [число]" з можливими пробілами
const pageRefPattern = /^[\s]*ст\.\s+\d+[\s]*$/gm;

function cleanMarkdownFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Видаляємо рядки з посиланнями на сторінки
    content = content.replace(pageRefPattern, '');

    // Видаляємо зайві порожні рядки (більше двох підряд)
    content = content.replace(/\n{3,}/g, '\n\n');

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Очищено: ${path.relative(docsDir, filePath)}`);
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
            filesProcessed += processDirectory(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            filesProcessed += cleanMarkdownFile(fullPath);
        }
    }

    return filesProcessed;
}

console.log('Початок очищення файлів документації від посилань на сторінки...\n');
const totalFiles = processDirectory(docsDir);
console.log(`\nГотово! Оброблено файлів: ${totalFiles}`);
