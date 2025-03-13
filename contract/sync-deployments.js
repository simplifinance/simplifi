#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - directory files
const HARDHAT_DEPLOYMENTS_PATH = './deployments';
const REACT_DEPLOYMENT_PATH = '../ui-ts/deployments';

// Create the React ABI directory if it doesn't exist
if (!fs.existsSync(REACT_DEPLOYMENT_PATH)) {
    fs.mkdirSync(REACT_DEPLOYMENT_PATH, { recursive: true });
}

// Function to walk through directories recursively
function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walkDir(filePath));
        } else {
            if (file.endsWith('.json') && !file.includes('contracts')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

// Main script
console.log("🔄 Syncing Deployment modules to Next App...");

try {
    // Find all artifact JSON files
    const artifactFiles = walkDir(HARDHAT_DEPLOYMENTS_PATH);

    artifactFiles.forEach(filepath => {
        // Read and parse the artifact file
        const artifact = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        const filename = path.basename(filepath);
        const contractName = filename.replace('.json', '');

        // Extract and save just the deployment content
        const abiPath = path.join(REACT_DEPLOYMENT_PATH, `${contractName}.json`);
        if(artifact.abi) {
            fs.writeFileSync(abiPath, JSON.stringify(artifact.abi, null, 2));
        }
        console.log(`Copied Deployments for ${contractName}`);
    });

    console.log("✅ ABI sync complete!");
} catch (error) {
    console.error("❌ Error syncing Deployment:", error);
    process.exit(1);
}
