#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { zeroAddress } = require('viem');

// Configuration - directory files
const HARDHAT_ARTIFACTS_PATH = './deployments/';
const REACT_ABI_PATH = '../Deployment';
const approvedFunctions = ['createPool', 'getFinance', 'deposit', 'payback', 'liquidate', 'editPool', 'closePool', 'contribute', 'registerToEarnPoints', 'provideLiquidity', 'removeLiquidity', 'borrow', 'claimTestTokens', 'setBaseToken', 'setCollateralToken', 'panicUnlock', 'unlockToken', 'lockToken', 'transferFrom', 'approve', 'getCollateralQuote', 'getCurrentDebt', 'allowance', 'balanceOf'];
const chainName = {44787: 'alfajores', 4157: 'crossTest'};
const chainIds = [44787, 4157]
let workBuild = {
    44787: [],
    4157: [],
};

let stdOut = {
    approvedFunctions: approvedFunctions,
    chainName: chainName,
    chainIds: chainIds,
    data: [[], []],
    paths: workBuild,
    contracts: [{"stablecoin": "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"}, {"stablecoin": zeroAddress}],
};

// Create the React ABI directory if it doesn't exist
if (!fs.existsSync(REACT_ABI_PATH)) {
    fs.mkdirSync(REACT_ABI_PATH, { recursive: true });
}

// Function to walk through directories recursively
function walkDir(dir) {
    let list = fs.readdirSync(dir);
    if(list.includes('contracts.json')){
        list = list.filter((item) => item !== 'contracts.json')
    }
    
    chainIds.forEach((chain) => {
        list.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            const isChainRelated = filePath.includes(chainName[chain]);
            const noSolcInputs = file.includes('solcInputs');
            const noFileWithChainId = file.endsWith('.chainId');
            if (stat && stat.isDirectory() && !noSolcInputs && !noFileWithChainId) {
                if(isChainRelated){
                    workBuild[chain].concat(walkDir(filePath));
                }
            } else {
                if(isChainRelated && !noSolcInputs && !noFileWithChainId) workBuild[chain].push(filePath);
            }
        });
    })
    return workBuild;
}

// Main script
console.log("🔄 Syncing contracts data to Next App...");

try {
    // Find all artifact JSON files
    walkDir(HARDHAT_ARTIFACTS_PATH);
    const stdOutPath = path.join(REACT_ABI_PATH, 'contractsData.json');
    chainIds.forEach((chainId) => {
        workBuild[chainId].forEach(filepath => {
            const artifact = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            const basename = path.basename(filepath).replace('.json', '');
            // console.log("BaseName: ", basename);
            // Extract and save all the required data such as the ABI, contractAddress, inputs etc
            artifact.abi.forEach((item) => {
                const abi = item;
                if(item.type === 'function' && approvedFunctions.includes(item.name)) {
                    let inputs = [];
                    const chainIndex = chainIds.indexOf(chainId);
                    item.inputs && item.inputs.forEach((input) => {
                        inputs.push(input.name);
                    });
                    stdOut.data[chainIndex].push({
                        abi: [item],
                        contractAddress: artifact.address,
                        inputCounts: inputs.length,
                        inputs: inputs,
                        functionName: item.name,
                    });
                    stdOut.contracts[chainIndex][basename] = artifact.address;

                }
            })
        });

    });
    fs.writeFileSync(stdOutPath, JSON.stringify(stdOut, null, 2));
    // console.log("StdOut", stdOut);
    console.log("✅ Data synchronization completed!");
} catch (error) {
    console.error("❌ Error syncing ABIs:", error);
    process.exit(1);
}
