#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { zeroAddress } = require('viem');

// Configuration - directory files
const HARDHAT_ARTIFACTS_PATH = './deployments/';
const REACT_DATA_PATH = '../Deployment/contractsData';
const GLOBAL_OUTPUT_PATH = '../Deployment/contractsData/global.json';
const approvedFunctions = ['createPool', 'getFinance', 'deposit', 'payback', 'liquidate', 'deposits', 'closePool', 'contribute', 'registerToEarnPoints', 'provideLiquidity', 'removeLiquidity', 'borrow', 'claimTestTokens', 'setBaseToken', 'setCollateralToken', 'panicUnlock', 'unlockToken', 'lockToken', 'transferFrom', 'approve', 'getCollateralQuote', 'getCurrentDebt', 'allowance', 'balanceOf', 'getProviders', 'symbol', 'getFactoryData', 'getPoolRecord', 'getPoints', 'getSupportedAssets', 'getPoolData', 'setVerification', 'toggleUseWalletVerification', 'isVerified', 'getDeposit'];
const readFunctions = ['getCollateralQuote', 'getCurrentDebt', 'allowance', 'balanceOf', 'getProviders', 'symbol', 'getFactoryData', 'getPoolRecord', 'getPoints', 'getSupportedAssets', 'getPoolData', 'isVerified', 'getDeposit'];
const functionsRequireArgUpdate = ['transferFrom', 'approve', 'deposit'];
const chainName = {44787: 'alfajores', 4157: 'crossstestnet', 42220: 'celo', 4158: 'crossmainnet'};
const chainIds = [44787, 4157, 42220, 4158]
let workBuild = {
    44787: [],
    42220: [],
    4157:[],
    4158: []
};

let globalOutput = {
    approvedFunctions: approvedFunctions,
    chainName: chainName,
    chainIds: chainIds,
    paths: workBuild,
    contractAddresses: [{"stablecoin": "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"}, {"stablecoin": zeroAddress}, {stablecoin: "0x765de816845861e75a25fca122bb6898b8b1282a"}, {stablecoin: zeroAddress}],
};

let itemOutput = {
    contractAddress: '',
    functionName: '',
    inputCount: 0,
    requireArgUpdate: false,
    abi: []
};

// Create the React ABI directory if it doesn't exist
if (!fs.existsSync(REACT_DATA_PATH)) {
    fs.mkdirSync(REACT_DATA_PATH, { recursive: true });
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
            const fileWithSolcInputs = file.includes('solcInputs');
            const fileWithChainId = file.endsWith('.chainId');
            if (stat && stat.isDirectory() && !fileWithSolcInputs && !fileWithChainId) {
                if(isChainRelated){
                    workBuild[chain].concat(walkDir(filePath));
                }
            } else {
                if(isChainRelated && !fileWithSolcInputs && !fileWithChainId) workBuild[chain].push(filePath);
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
    chainIds.forEach((chainId) => {
        workBuild[chainId].forEach(filepath => {
            const artifact = JSON.parse(fs.readFileSync(filepath, 'utf8'));
            const basename = path.basename(filepath).replace('.json', '');

            // Extract and save all the required data such as the ABI, contractAddress, inputs etc
            artifact.abi.forEach((item) => {
                if(item.type === 'function' && approvedFunctions.includes(item.name)) {
                    let inputs = [];
                    const chainIndex = chainIds.indexOf(chainId);
                    item.inputs && item.inputs.forEach((input) => {
                        inputs.push(input.name);
                    });
                    const isReadFunction = readFunctions.includes(item.name);
                    const dir = `${REACT_DATA_PATH}/${chainId}`;
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir, { recursive: true });
                    }
                    // const stdItemOutPath = path.join(REACT_DATA_PATH, `${item.name}.json`);
                    const stdItemOutPath = path.join(dir, `${item.name}.json`);
                    itemOutput.abi = isReadFunction? [item] : artifact.abi;
                    itemOutput.inputCount = inputs.length;
                    itemOutput.functionName = item.name;
                    itemOutput.contractAddress = artifact.address;
                    itemOutput.requireArgUpdate = functionsRequireArgUpdate.includes(item.name)
                    fs.writeFileSync(stdItemOutPath, JSON.stringify(itemOutput, null, 2));
                    globalOutput.contractAddresses[chainIndex][basename] = artifact.address;

                }
            })
        });

    });
    fs.writeFileSync(GLOBAL_OUTPUT_PATH, JSON.stringify(globalOutput, null, 2));
    console.log("✅ Data synchronization completed!");
} catch (error) {
    console.error("❌ Error syncing ABIs:", error);
    process.exit(1);
}