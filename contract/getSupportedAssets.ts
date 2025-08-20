import { assert } from "console";
import { DeploymentsExtension } from "hardhat-deploy/types";
import func from "./deploy/1_deploy";

export type NetworkName = 'crosstestnet' | 'crossfimainnet' | 'celo' | 'alfajores' | 'hardhat';
export type Address = `0x${string}`;
interface Transaction {
    name: string;
    options: {
        from: `0x${string}`;
    };
    methodName: string;
    args: {
        users: `0x${string}`[];
        unit: bigint;
        maxQuorum: number;
        durationInHrs: number;
        colCoverage: number;
        isPermissionless: boolean;
        colAsset: `0x${string}`;
    };
}


export const getContractData = (networkName: string) => {
    let flexpool = '';;
    let priceData = [{}];
    let wrappedAssetMetadata : {symbol: string, name: string} = {symbol: '', name: ''};
    let isNotHardhat = true;

    switch (networkName) {
        case 'alfajores':
            flexpool = 'CeloBased';
            wrappedAssetMetadata = { name: 'Wrapped Test Celo', symbol: 'TCELO'};
            priceData = [{
                any: '0',
                decimals: 8,
                pair: 'CELO/USD',
                feedAddr : '0x022F9dCC73C5Fb43F2b4eF2EF9ad3eDD1D853946', 
            }];
            break;
        case 'celo':
            flexpool = 'CeloBased';
            wrappedAssetMetadata = { name: 'Wrapped Celo', symbol: 'WCELO'};
            priceData = [{
                any: '0',
                decimals: 8,
                pair: 'CELO/USD',
                feedAddr: '0x0568fD19986748cEfF3301e55c0eb1E729E0Ab7e'
            }];
            break;
        case 'crosstestnet':
            flexpool = 'CrossfiBased';
            wrappedAssetMetadata = { name: 'Wrapped Test XFI', symbol: 'TXFI'};
            // oracleAddress = '0x33df80cdf0c9ff686261b11263d9f4a3ccc3d07f';
            priceData = [{
                latestPrice: '0',
                timestampOflatestPrice: '0',
                pair: 'XFI/USD',
                decimals: 8
            }];
            break;
        case 'crossfimainnet':
            flexpool = 'CrossfiBased';
            wrappedAssetMetadata = { name: 'Wrapped XFI', symbol: 'WXFI'};
            priceData = [{
                latestPrice: '0',
                timestampOflatestPrice: '0',
                pair: 'XFI/USD',
                decimals: 8
            }];
            // oracleAddress = '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233';
            break;
                
        // Defaults to Hardhat
        default:
            isNotHardhat = false;
            flexpool = 'HardhatBased';
            // oracleAddress = zeroAddress;
            wrappedAssetMetadata = { name: 'Wrapped Token', symbol: 'WToken'};
            break;
    }

    console.log(`NetworkName: ${networkName}`);
    return { flexpool, wrappedAssetMetadata, priceData, isNotHardhat }
};

export const baseContractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"typeAndVersion","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];

// 0xC8CeED65E236F7d6fB378b8715f9e6912e486A54 asset address on dia 

interface CreateOption {
    testers: Address[];
    deployments: DeploymentsExtension;
    units: bigint[];
    maxQuorums?: number[];
    durationInHrs: number[];
    colCoverages: number[];
    colAsset: Address;
    isPermissionless: boolean;
}

interface JoinOption {
    testers: Address[];
    creators: Address[];
    deployments: DeploymentsExtension;
    unit: bigint;
}

async function createPool(args: CreateOption) {
    const { testers, deployments: { execute }, units, maxQuorums, isPermissionless, durationInHrs, colCoverages, colAsset } = args;
    assert(testers.length === units.length && units.length === colCoverages.length && colCoverages.length === durationInHrs.length, "Args must have the same size");
    let transactions : Transaction[] = [];
    if(isPermissionless) {
        assert(maxQuorums !== undefined && maxQuorums?.length === units.length, "MaxQuorum not provided");
        transactions = testers.map((tester, i) => {
            return{
                name: "CeloBased", 
                options: {from: tester},
                methodName: "createPool", 
                args: {
                    users: [tester],
                    unit: units[i],
                    maxQuorum: maxQuorums?.[i]!,
                    durationInHrs: durationInHrs[i],
                    colCoverage: colCoverages[i],
                    isPermissionless: true,
                    colAsset
                }
            }
        });
    } else {
        transactions = testers.map((tester, i) => {
            const otherUserIndex = i + 1;
            const users = [tester, testers[otherUserIndex < testers.length? otherUserIndex : 0]];
            return{
                name: "CeloBased", 
                options: {from: tester},
                methodName: "createPool", 
                args: {
                    users,
                    unit: units[i],
                    maxQuorum: users.length,
                    durationInHrs: durationInHrs[i],
                    colCoverage: colCoverages[i],
                    isPermissionless: false,
                    colAsset
                }
            }
        });
    }

    for(let i = 0; i < transactions.length; i++){
        const tx = transactions[i];
        try {
            await execute(tx.name, tx.options, tx.methodName, tx.args.users, tx.args.unit, tx.args.maxQuorum, tx.args.durationInHrs, tx.args.colCoverage, tx.args.isPermissionless, tx.args.colAsset);
        } catch (error) {
            console.log(tx.options.from, "Could not create a pool due to", error?.message || error?.data?.message || error?.reason);
        }
    }
    return testers;
}

export async function joinAPool(args: JoinOption){
    const { testers, creators, deployments: { execute }, unit } = args;
    for(let i = 0; i < testers.length; i++) {
        const tester = testers[i];
        try {
            if(!creators.includes(tester)) {
                await execute("CeloBased", {from: tester}, "contribute", unit)
            }
        } catch (error) {
            console.log("Could not add tester: ", tester, "to pool due", error?.message || error?.data?.message || error?.reason);
        }
    }
}
