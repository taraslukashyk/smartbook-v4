const fs = require('fs');
const path = require('path');

// Adjust this if running from inside 'website' folder or root
// Assuming running from root 'd:\project\smartbook v4'
const docsDir = path.join(process.cwd(), 'website', 'docs');

console.log(`Fixing MDX files in: ${docsDir}`);

if (!fs.existsSync(docsDir)) {
    console.error(`Directory not found: ${docsDir}`);
    // Fallback if running from inside website folder
    if (fs.existsSync(path.join(process.cwd(), 'docs'))) {
        console.log('Detected running inside website folder, adjusting path...');
        fixFiles(path.join(process.cwd(), 'docs'));
    } else {
        process.exit(1);
    }
} else {
    fixFiles(docsDir);
}

function fixFiles(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            fixFiles(filePath);
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            let content = fs.readFileSync(filePath, 'utf8');

            let newContent = content;

            // Fix 1: <br> tags -> <br />
            // Look for <br> that matches strictly and isn't already closed
            newContent = newContent.replace(/<br\s*\/?>/gi, '<br />');

            // Fix 2: <hr> tags -> <hr />
            newContent = newContent.replace(/<hr\s*\/?>/gi, '<hr />');

            // Fix 3: Remove potential undefined variables or broken imports if generic
            // (Advanced step, skipping for now unless error occurs)

            if (content !== newContent) {
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`Fixed: ${filePath}`);
            }
        }
    });
}

console.log('MDX Fix completed successfully!');
