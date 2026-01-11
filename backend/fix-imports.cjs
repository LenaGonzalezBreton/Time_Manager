const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function addJsExtensions(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Regex pour trouver les imports relatifs sans extension .js
    const importRegex = /from\s+['"](\.\.[\/\\][^'"]+|\.\/[^'"]+)['"]/g;

    content = content.replace(importRegex, (match, importPath) => {
        // Si l'import se termine déjà par .js, on ne fait rien
        if (importPath.endsWith('.js')) {
            return match;
        }

        // Ajouter .js à la fin
        modified = true;
        return match.replace(importPath, importPath + '.js');
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${path.relative(__dirname, filePath)}`);
        return true;
    }
    return false;
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    let totalFixed = 0;

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            totalFixed += processDirectory(filePath);
        } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
            if (addJsExtensions(filePath)) {
                totalFixed++;
            }
        }
    }

    return totalFixed;
}

console.log('🔧 Adding .js extensions to all imports...\n');
const fixed = processDirectory(srcDir);
console.log(`\n✨ Done! Fixed ${fixed} files.`);
