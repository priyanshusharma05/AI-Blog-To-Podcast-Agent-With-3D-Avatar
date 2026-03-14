const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'f:/ai-blog-to-potcast/src/pages/MyEpisodes.jsx',
    'f:/ai-blog-to-potcast/src/pages/Dashboard.jsx',
    'f:/ai-blog-to-potcast/src/pages/Analytics.jsx',
    'f:/ai-blog-to-potcast/src/pages/Settings.jsx',
    'f:/ai-blog-to-potcast/src/pages/CreateEpisode.jsx'
];

filesToCheck.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        // Basic check for balanced braces
        let braceCount = 0;
        let parenCount = 0;
        let bracketCount = 0;
        
        for (let i = 0; i < content.length; i++) {
            if (content[i] === '{') braceCount++;
            if (content[i] === '}') braceCount--;
            if (content[i] === '(') parenCount++;
            if (content[i] === ')') parenCount--;
            if (content[i] === '[') bracketCount++;
            if (content[i] === ']') bracketCount--;
        }
        
        console.log(`Checking ${path.basename(file)}:`);
        console.log(`  Braces: ${braceCount}`);
        console.log(`  Parens: ${parenCount}`);
        console.log(`  Brackets: ${bracketCount}`);
        
        if (braceCount !== 0 || parenCount !== 0 || bracketCount !== 0) {
            console.error(`  ERROR: Unbalanced tokens in ${file}`);
        }
    } catch (err) {
        console.error(`  FAILED to read ${file}: ${err.message}`);
    }
});
