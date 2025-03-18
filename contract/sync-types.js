#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - directory files
const HARDHAT_TYPECHAIN_PATH = './typechain-types';
const REACT_TYPECHAIN_PATH = '../ui-ts/typechain-types';

// Create the React ABI directory if it doesn't exist
if (!fs.existsSync(REACT_TYPECHAIN_PATH)) {
    fs.mkdirSync(REACT_TYPECHAIN_PATH, { recursive: true });
}

// Function to walk through directories recursively
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && filePath.includes('contracts') && !filePath.includes('openzeppelin') && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            if (file.endsWith('.ts') && !file.includes('Locks') && !file.includes('index')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// Main script
console.log("🔄 Syncing typechain-types to Next App...");

try {
    // Find all artifact JSON files
    const artifactFiles = walkDir(HARDHAT_TYPECHAIN_PATH);
    console.log("artifactFiles", artifactFiles)

    artifactFiles.forEach(filepath => {
        // Read and parse the artifact file
        const artifact = fs.readFileSync(filepath, 'utf8');
        const filename = path.basename(filepath);
        const contractName = filename.replace('.ts', '');

        // Extract and save just the deployment content
        const contractPath = path.join(REACT_TYPECHAIN_PATH, `${contractName}.ts`);
        if(artifact) {
            fs.writeFileSync(contractPath, artifact);
        }
        console.log(`Copied typechain-types for ${contractName}`);
    });

    console.log("✅ Typechain-types sync complete!");
} catch (error) {
    console.error("❌ Error syncing Types:", error);
    process.exit(1);
}
