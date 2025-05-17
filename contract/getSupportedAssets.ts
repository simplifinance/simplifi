import { assert } from "chai";
import { zeroAddress } from "viem";

export type NetworkName = 'crosstestnet' | 'crossfimainnet' | 'celo' | 'alfajores' | 'hardhat';

export const getContractData = (networkName: string) => {
    let flexpool = '';;
    let priceData = [{}];
    let wrappedAssetMetadata : {symbol: string, name: string} = {symbol: '', name: ''};
    let oracleAddress = '';
    let isNotHardhat = true;

    switch (networkName) {
        case 'alfajores':
            flexpool = 'CeloBased';
            wrappedAssetMetadata = { name: 'Wrapped Test Celo', symbol: 'TCELO'};
            oracleAddress = '0x74f09cb3c7e2A01865f424FD14F6dc9A14E3e94E';
            priceData = [{
                decimals: 18,
                pair: 'CELO/USD',
                priceFeedId: '0x7d669ddcdd23d9ef1fa9a9cc022ba055ec900e91c4cb960f3c20429d4447a411', 
            }];
            break;
        case 'celo':
            flexpool = 'CeloBased';
            wrappedAssetMetadata = { name: 'Wrapped Celo', symbol: 'WCELO'};
            oracleAddress = '0xff1a0f4744e8582DF1aE09D5611b887B6a12925C';
            priceData = [{
                decimals: 18,
                pair: 'CELO/USD',
                priceFeedId: '0x7d669ddcdd23d9ef1fa9a9cc022ba055ec900e91c4cb960f3c20429d4447a411'
            }];
            break;
        case 'crosstestnet':
            flexpool = 'CrossfiBased';
            wrappedAssetMetadata = { name: 'Wrapped Test XFI', symbol: 'TXFI'};
            oracleAddress = '0x33df80cdf0c9ff686261b11263d9f4a3ccc3d07f';
            priceData = [{
                latestPrice: 0n,
                timestampOflatestPrice: 0n,
                pair: 'XFI/USD',
                decimals: 8
            }];
            break;
        case 'crossfimainnet':
            flexpool = 'CrossfiBased';
            wrappedAssetMetadata = { name: 'Wrapped XFI', symbol: 'WXFI'};
            priceData = [{
                latestPrice: 0n,
                timestampOflatestPrice: 0n,
                pair: 'XFI/USD',
                decimals: 8
            }];
            oracleAddress = '0x859e221ada7cebdf5d4040bf6a2b8959c05a4233';
            break;
                
        // Defaults to Hardhat
        default:
            isNotHardhat = false;
            flexpool = 'HardhatBased';
            oracleAddress = zeroAddress;
            wrappedAssetMetadata = { name: 'Wrapped Token', symbol: 'WToken'};
            break;
    }

    console.log(`NetworkName: ${networkName}`);
    return { flexpool, wrappedAssetMetadata, priceData, oracleAddress, isNotHardhat }
};

export const baseContractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"transferAndCall","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"typeAndVersion","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"}];

// 0xC8CeED65E236F7d6fB378b8715f9e6912e486A54 asset address on dia 