#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configuration - directory files
const HARDHAT_TYPECHAIN_PATH = './typechain-types';
const REACT_TYPECHAIN_PATH = '../Deployment/typechain-types';

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








// const fs = require('fs');
// const path = require('path');

// // Configuration - directory files
// const HARDHAT_TYPECHAIN_PATH = './typechain-types';
// const REACT_TYPECHAIN_PATH = '../Deployment/typechain-types';

// // Create the React ABI directory if it doesn't exist
// if (!fs.existsSync(REACT_TYPECHAIN_PATH)) {
//     fs.mkdirSync(REACT_TYPECHAIN_PATH, { recursive: true });
// }

// // Function to walk through directories recursively
// function walkDir(dir) {
//     let results = [{hardhat: '', react: ''}];
//     const list = fs.readdirSync(dir);
//     // console.log("List", list)
//     list.forEach(file => {
//         const filePath = path.join(dir, file);
//         const stat = fs.statSync(filePath);
//         const frontendPath = path.join(REACT_TYPECHAIN_PATH, file)
//         if (stat && stat.isDirectory()) {
//             results = results.concat(walkDir(filePath))
//             if (!fs.existsSync(frontendPath)) {
//                 fs.mkdirSync(frontendPath, { recursive: true });
//             }
//         } else {
//             if (!fs.existsSync(frontendPath)) {
//                 fs.mkdirSync(frontendPath, { recursive: true });
//             }
//             results.push({hardhat: filePath, react: frontendPath});
//             // if (file.endsWith('.ts') && (file.includes('common') || file.includes('index') || file.includes('hardhat.d'))) {
//             // }
//         }
//     });

//     // list.forEach(file => {
//     //     const filePath = path.join(dir, file);
//     //     const stat = fs.statSync(filePath);
//     //     // const frontendPath = path.join(REACT_TYPECHAIN_PATH, file)
      
        

//     //     // if (stat && filePath.includes('contracts') && !filePath.includes('openzeppelin') && stat.isDirectory()) {
//     //     //     results = results.concat(walkDir(filePath));
//     //     // } else {
//     //     //     if (file.endsWith('.ts') && !file.includes('Locks') && !file.includes('index')) {
//     //     //         results.push(filePath);
//     //     //     }
//     //     // }
//     // });
//     return results;
// }

// // Main script
// console.log("🔄 Syncing typechain-types to Next App...");

// try {
//     // Find all artifact JSON files
//     const artifactFiles = walkDir(HARDHAT_TYPECHAIN_PATH);
//     console.log("artifactFiles", artifactFiles)

//     artifactFiles.forEach(result => {
//         // Read and parse the artifact file
//         if(result.hardhat.includes('ts')){
//             const artifact = fs.readFileSync(result.hardhat, 'utf8');
//             const filename = path.basename(result.hardhat);
//             const contractName = filename.replace('.ts', '');
    
//             // Extract and save just the deployment content
//             const destination = path.join(result.react, `${contractName}.ts`);
//             if(artifact) {
//                 fs.writeFileSync(destination, artifact);
//             }
//             console.log(`Copied typechain-types for ${contractName}`);
//         }
//     });

//     // artifactFiles.forEach(filepath => {
//     //     // Read and parse the artifact file
//     //     const artifact = fs.readFileSync(filepath, 'utf8');
//     //     const filename = path.basename(filepath);
//     //     const contractName = filename.replace('.ts', '');

//     //     // Extract and save just the deployment content
//     //     const contractPath = path.join(REACT_TYPECHAIN_PATH, `${contractName}.ts`);
//     //     if(artifact) {
//     //         fs.writeFileSync(contractPath, artifact);
//     //     }
//     //     console.log(`Copied typechain-types for ${contractName}`);
//     // });

//     console.log("✅ Typechain-types sync complete!");
// } catch (error) {
//     console.error("❌ Error syncing Types:", error);
//     process.exit(1);
// }
