import { assert } from "console";
import { createPublicClient, createWalletClient, getContract, Hex, http, parseAbi } from 'viem'
import { privateKeyToAccount } from "viem/accounts";
import { celo, celoAlfajores } from 'viem/chains';
import mainArtifacts from "./deployments/celo/CeloBased.json";
import testArtifacts from "./deployments/celo/CeloBased.json";
import token from "./deployments/celo/BaseAsset.json";
import wrappedNative from "./deployments/celo/WrappedNative.json"; 
import verifier from "./deployments/celo/Verifier.json";

interface GetOption {
    testersSlice: {
        from: number;
        to: number;
    };
    run: boolean;
    // deployments: DeploymentsExtension;
    units: bigint[];
    networkName: string;
    creators?: {
        key: `0x${string}`;
        account: `0x${string}`;
    }[];
}

enum Stage {JOIN, GET, PAYBACK, CANCELED,ENDED}
enum Phase { ALPHA, MAINNET }
enum Status { AVAILABLE, TAKEN }
enum Router { NONE, PERMISSIONLESS, PERMISSIONED }

interface JoinOption extends GetOption {
    testersSlice: {
        from: number;
        to: number;
    };
}

interface CreateOption extends GetOption {
    units: bigint[];
    maxQuorums?: number[];
    durationInHrs: number[];
    colCoverages: number[];
    colAsset: Address;
    isPermissionless: boolean;
}

interface Addresses {
    colAsset: Address;
    lastPaid: Address;
    safe: Address;
    admin: Address;
}

interface Pool {
    low: Low;
    big: Big;
    addrs: Addresses;
    router: Router;
    stage: Stage;
    status: Status;
}

interface Low {
    maxQuorum: number;
    selector: number;
    colCoverage: number;
    duration: number;
    allGh: number;
    userCount: number;
}

interface Big {
    unit: bigint;
    currentPool: bigint;
    recordId: bigint;
    unitId: bigint;
}

interface Point {
    contributor: bigint;
    creator: bigint;
    referrals: bigint;
    user: Address;
    phase: Phase;
}

// Confirmation block
const CONFIRMATION = 2;
const cUSD_celo = "0x765de816845861e75a25fca122bb6898b8b1282a";
const cUSD_alfa = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"

// Testers
const t1 = process.env.P_KEY_0xe5d as Hex;
const t2 = process.env.P_KEY_0xd53 as Hex;
const t3 = process.env.P_KEY_0x286a as Hex;
const t4 = process.env.P_KEY_0xdd0 as Hex;
const t5 = process.env.P_KEY_farca as Hex;
const t6 = process.env.P_KEY_0x84F as Hex;
const t7 = process.env.P_KEY_0xC0F as Hex;
const t8 = process.env.P_KEY_0xD7c as Hex;
// const roleBearer = process.env.PRIVATE_KEY_MAIN_0xa1f as Hex;

export const testers = Array.from([t1, t2, t3, t4, t5, t6, t7, t8]).map((key) => {
    return {
        key,
        account: privateKeyToAccount(key).address
    }
});

/**
 * @dev Get specific set of testers from the list of testers.
 * @param startIndex : Where to begin 
 * @param endIndex : Where to stop
 * @returns : New array of testers
 */
function getTesters(startIndex: number, endIndex: number) {
    // if(!startIndex || !endIndex) return testers;
    assert(startIndex < testers.length && endIndex <= testers.length, "Length mismatch");
    return testers.slice(startIndex, endIndex);
}

/**
 * @dev Get wallet client for signing transactions
 * @param networkName : Connected chain name
 * @param pkey : Private key. Note: Protect your private key at all cost. Use environment variables where necessary
 * @returns : Wallet client for signing transactions
 */
function getClients(networkName: string, pkey: Hex) {
    // const endpoint = process.env.ALCHEMY_CELO_MAINNET_ENDPOINT as string;
    const walletClient = createWalletClient({
      chain: networkName === 'alfajores'? celoAlfajores : celo,
      transport: http(),
      account: privateKeyToAccount(pkey)
    });
    const  publicCLient = createPublicClient({
        chain: networkName === 'alfajores'? celoAlfajores : celo,
        transport: http()
    });
    return {walletClient, publicCLient};
}

/**
 * @dev Get the contract abi and address using the network name to determine the connected chain
 * @param networkName : Connected chain
 * @returns : Abi and contract address
 */
function getArtifacts(networkName: string) {
    const isAlfajores = networkName === 'alfajores';
    const { abi, address } = isAlfajores? testArtifacts : mainArtifacts;
    const cUSD = isAlfajores?  cUSD_alfa : cUSD_celo;
    return { abi : abi as any, address: address as Address, cUSD: cUSD as Address }
}

function getContractInfo(networkName: string, pkey: Hex) {
    const { abi, address, cUSD } = getArtifacts(networkName);
    const { publicCLient, walletClient } = getClients(networkName, pkey);
    // console.log("Abi", abi)
    const contract = getContract({
      address,
      abi,
      client: walletClient
    });
    return{
        cUSD,
        contract,
        publicCLient,
        walletClient
    }
}

export type NetworkName = 'crosstestnet' | 'crossfimainnet' | 'celo' | 'alfajores' | 'hardhat';
export type Address = `0x${string}`;

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


/**
 * @dev Create new flexpools
 * @param args : parameters
 * @returns : List of creators
 */
export async function createPool(args: CreateOption) {
    const { testersSlice, networkName, units, maxQuorums, run, isPermissionless, durationInHrs, colCoverages, colAsset } = args;
    const creators = getTesters(testersSlice.from, testersSlice.to);
    // console.log("Contributors:", creators);
    // console.log("Units:", units);
    assert(creators.length === units.length && units.length === colCoverages.length && colCoverages.length === durationInHrs.length, "Args must have the same size");
    if(!run) return creators;
    if(isPermissionless) {
        assert(maxQuorums !== undefined && maxQuorums?.length === units.length, "MaxQuorum not provided");
        const transactions = creators.map((user, i) => {
            const users = [user.account];
            return{
                amount: units[i],
                account: user.account,
                data: getContractInfo(networkName, user.key),
                methodName: "createPool", 
                args: [users, units[i], maxQuorums?.[i], durationInHrs[i], colCoverages[i], true, colAsset]
            }
        });
        
        for(let i = 0; i < transactions.length; i++){
            const tx = transactions[i];
            try {
                let hash : Hex = '0x';
                hash = await tx.data.walletClient.writeContract({
                    abi: token.abi,
                    address: tx.data.cUSD,
                    functionName: 'approve',
                    args: [tx.data.contract.address, tx.amount],
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                hash = await tx.data.walletClient.writeContract({
                    abi: tx.data.contract.abi,
                    address: tx.data.contract.address,
                    functionName: tx.methodName,
                    args: tx.args,
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                // await execute(tx.name, tx.options, tx.methodName, tx.args.users, tx.args.unit, tx.args.maxQuorum, tx.args.durationInHrs, tx.args.colCoverage, tx.args.isPermissionless, tx.args.colAsset);
            } catch (error) {
                console.log(tx.account, "Could not create a pool due to", error?.message || error?.data?.message || error?.reason);
            }
        }
    } else {
        const transactions = creators.map((user, i) => {
            const otherUserIndex = i + 1;
            const users = [user.account, creators[otherUserIndex < testers.length? otherUserIndex : 0].account];
            return{
                amount: units[i],
                account: user.account,
                data: getContractInfo(networkName, user.key),
                methodName: "createPool", 
                args: [users, units[i], users.length, durationInHrs[i], colCoverages[i], false, colAsset]
            }
        });

        for(let i = 0; i < transactions.length; i++){
            const tx = transactions[i];
            try {
                let hash : Hex = '0x';
                hash = await tx.data.walletClient.writeContract({
                    abi: token.abi,
                    address: tx.data.cUSD,
                    functionName: 'approve',
                    args: [tx.data.contract.address, tx.amount],
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                hash = await tx.data.walletClient.writeContract({
                    abi: tx.data.contract.abi,
                    address: tx.data.contract.address,
                    functionName: tx.methodName,
                    args: tx.args,
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
            } catch (error) {
                console.log(tx.account, "Could not create a pool due to", error?.message || error?.data?.message || error?.reason);
            }
        }
    }

    return creators;
}

/**
 * @dev Contribute to a pool
 * @param args : Parameters
 */
export async function joinAPool(args: JoinOption){
    const { testersSlice, units, run, networkName, creators } = args;
    const contributors = getTesters(testersSlice.from, testersSlice.to);
    assert(contributors.length === units.length, "Args must have the same size");
    assert(creators !== undefined && creators.length > 0, "Cant find creators list");
    if(!run) return;
    // console.log("Entry")
    const transactions = contributors.map((user, i) => {
        return{
            amount: units[i],
            account: user,
            data: getContractInfo(networkName, user.key),
            methodName: "contribute", 
            args: [units[i]]
        }
    });
    // console.log("Transactions:", transactions);
    const poolCreators = creators!.map(({account}) => account)!;
    
    for(let i = 0; i < transactions.length; i++){
        const tx = transactions[i];
        console.log("Pool Creators:", poolCreators);
        const isInList = poolCreators.includes(tx.account.account);
        console.log("Is in Pool Creators:", isInList);
        if(!isInList) {
            const isVerified = await tx.data.publicCLient.readContract({
                abi: verifier.abi,
                address: verifier.address as Address,
                functionName: "isVerified",
                args: [tx.account.account]
            }) as bigint;

            try {
                let hash : Hex = '0x';
                console.log("isVerified:", isVerified);
                if(!isVerified) {
                    hash = await tx.data.walletClient.writeContract({
                        abi: verifier.abi,
                        address: verifier.address as Address,
                        functionName: 'setVerification',
                        args: [],
                        account: privateKeyToAccount(tx.account.key)
                    });
                    await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                }
                hash = await tx.data.walletClient.writeContract({
                    abi: token.abi,
                    address: tx.data.cUSD,
                    functionName: 'approve',
                    args: [tx.data.contract.address, tx.amount],
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                hash = await tx.data.walletClient.writeContract({
                    abi: tx.data.contract.abi,
                    address: tx.data.contract.address,
                    functionName: tx.methodName,
                    args: tx.args,
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                // await execute(tx.name, tx.options, tx.methodName, tx.args.users, tx.args.unit, tx.args.maxQuorum, tx.args.durationInHrs, tx.args.colCoverage, tx.args.isPermissionless, tx.args.colAsset);
            } catch (error) {
                console.log(tx.account, "Could not contribute to", error?.message || error?.data?.message || error?.reason);
            }
        }
    }
}

/**
 * @dev Get finance
 * @param args : Getfinance parameters
 */
export async function getFinance(args: GetOption){
    const { testersSlice, units, networkName, creators, run } = args;
    const contributors = getTesters(testersSlice.from, testersSlice.to);
    if(!run) return;
    assert(contributors.length === units.length, "Args must have the same size");
    assert(creators !== undefined && creators.length > 0, "Cant find creators list");
    const transactions = contributors.map((user, i) => {
        return{
            amount: units[i],
            account: user.account,
            data: getContractInfo(networkName, user.key),
            methodName: "getFinance", 
            args: [units[i]]
        }
    });
    
    // const poolCreators = creators!.map(({account}) => account)!;
    for(let i = 0; i < transactions.length; i++){
        const tx = transactions[i];
        const collateralQuote = await tx.data.publicCLient.readContract({
            abi: tx.data.contract.abi,
            address: tx.data.contract.address,
            functionName: "getCollateralQuote",
            args: tx.args
        }) as bigint;
        const prevDeposit = await tx.data.publicCLient.readContract({
            abi: wrappedNative.abi,
            address: wrappedNative.address as Address,
            functionName: "getDeposit",
            args: [tx.amount, tx.account]
        }) as bigint;

        const pool = await tx.data.publicCLient.readContract({
            abi: tx.data.contract.abi,
            address: tx.data.contract.address,
            functionName: "getPool",
            args: [tx.amount]
        }) as Pool;
        console.log("pool", pool.addrs.safe);

        try {
            let hash : Hex = '0x';
            if(prevDeposit < collateralQuote){
                hash = await tx.data.walletClient.writeContract({
                    abi: wrappedNative.abi,
                    address: wrappedNative.address as Address,
                    functionName: 'deposit',
                    args: [tx.data.contract.address, tx.amount, pool.addrs.safe],
                });
            }
            hash = await tx.data.walletClient.writeContract({
                abi: token.abi,
                address: tx.data.cUSD,
                functionName: 'approve',
                args: [tx.data.contract.address, tx.amount],
            });
            await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
            hash = await tx.data.walletClient.writeContract({
                abi: tx.data.contract.abi,
                address: tx.data.contract.address,
                functionName: tx.methodName,
                args: tx.args,
            });
            await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
        } catch (error) {
            console.log(tx.account, "Could not getFinance to", error?.message || error?.data?.message || error?.reason);
        }

        // const lapses = collateralQuote + (collateralQuote / 5n)
        // if(!poolCreators.includes(tx.account)) {
        // }
    }
}

/**
 * @dev Payback loans
 * @param args : Payback args
 */
export async function payback(args: GetOption){
   const { testersSlice, units, networkName, creators, run } = args;
    const contributors = getTesters(testersSlice.from, testersSlice.to);
    if(!run) return;
    assert(contributors.length === units.length, "Args must have the same size");
    assert(creators !== undefined && creators.length > 0, "Cant find creators list");
    const transactions = contributors.map((user, i) => {
        return{
            amount: units[i],
            account: user.account,
            data: getContractInfo(networkName, user.key),
            methodName: "payback", 
            args: [units[i]]
        }
    });
    
    // const poolCreators = creators!.map(({account}) => account)!;
    for(let i = 0; i < transactions.length; i++){
        const tx = transactions[i];
        const debt = await tx.data.publicCLient.readContract({
            abi: tx.data.contract.abi,
            address: tx.data.contract.address,
            functionName: "getCurrentDebt",
            args: [tx.amount, tx.account]
        }) as bigint;
        if(debt > 0n) {
            try {
                let hash : Hex = '0x';
                hash = await tx.data.walletClient.writeContract({
                    abi: token.abi,
                    address: tx.data.cUSD,
                    functionName: 'approve',
                    args: [tx.data.contract.address, debt],
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                hash = await tx.data.walletClient.writeContract({
                    abi: tx.data.contract.abi,
                    address: tx.data.contract.address,
                    functionName: tx.methodName,
                    args: tx.args,
                });
                await tx.data.publicCLient.waitForTransactionReceipt({hash, confirmations: CONFIRMATION});
                // await execute(tx.name, tx.options, tx.methodName, tx.args.users, tx.args.unit, tx.args.maxQuorum, tx.args.durationInHrs, tx.args.colCoverage, tx.args.isPermissionless, tx.args.colAsset);
            } catch (error) {
                console.log(tx.account, "Could not contribute to", error?.message || error?.data?.message || error?.reason);
            }
        }
    }
}
