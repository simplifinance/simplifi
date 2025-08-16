// Testnet
import allowance44787 from "@/contractsData/44787/allowance.json";
import approve44787 from "@/contractsData/44787/approve.json";
import balanceOf44787 from "@/contractsData/44787/balanceOf.json";
import borrow44787 from "@/contractsData/44787/borrow.json";
import claimTestTokens44787 from "@/contractsData/44787/claimTestTokens.json";
import closePool44787 from "@/contractsData/44787/closePool.json";
import contribute44787 from "@/contractsData/44787/contribute.json";
import createPool44787 from "@/contractsData/44787/createPool.json";
import deposit44787 from "@/contractsData/44787/deposit.json";
import getDeposit44787 from "@/contractsData/44787/getDeposit.json";
import getCollateralQuote44787 from "@/contractsData/44787/getCollateralQuote.json";
import getCurrentDebt44787 from "@/contractsData/44787/getCurrentDebt.json";
import getFactoryData44787 from "@/contractsData/44787/getFactoryData.json";
import getFinance44787 from "@/contractsData/44787/getFinance.json";
import getPoints44787 from "@/contractsData/44787/getPoints.json";
import getPoolData44787 from "@/contractsData/44787/getPoolData.json";
import getProviders44787 from "@/contractsData/44787/getProviders.json";
import getSupportedAssets44787 from "@/contractsData/44787/getSupportedAssets.json";
import liquidate44787 from "@/contractsData/44787/liquidate.json";
import lockToken44787 from "@/contractsData/44787/lockToken.json";
import panicUnlock44787 from "@/contractsData/44787/panicUnlock.json";
import payback44787 from "@/contractsData/44787/payback.json";
import provideLiquidity44787 from "@/contractsData/44787/provideLiquidity.json";
import registerToEarnPoints44787 from "@/contractsData/44787/registerToEarnPoints.json";
import removeLiquidity44787 from "@/contractsData/44787/removeLiquidity.json";
import setBaseToken44787 from "@/contractsData/44787/lockToken.json";
import setCollateralToken44787 from "@/contractsData/44787/setCollateralToken.json";
import symbol44787 from "@/contractsData/44787/symbol.json";
import transferFrom44787 from "@/contractsData/44787/transferFrom.json";
import unlockToken44787 from "@/contractsData/44787/unlockToken.json";
import isVerified44787 from "@/contractsData/44787/isVerified.json";
import getVerificationStatus44787 from "@/contractsData/44787/getVerificationStatus.json";
import setVerification44787 from "@/contractsData/44787/setVerification.json";

// Mainnet
import allowance42220 from "@/contractsData/42220/allowance.json";
import approve42220 from "@/contractsData/42220/approve.json";
import balanceOf42220 from "@/contractsData/42220/balanceOf.json";
import borrow42220 from "@/contractsData/42220/borrow.json";
import claimTestTokens42220 from "@/contractsData/42220/claimTestTokens.json";
import closePool42220 from "@/contractsData/42220/closePool.json";
import contribute42220 from "@/contractsData/42220/contribute.json";
import createPool42220 from "@/contractsData/42220/createPool.json";
import deposit42220 from "@/contractsData/42220/deposit.json";
import getDeposit42220 from "@/contractsData/42220/getDeposit.json";
import getCollateralQuote42220 from "@/contractsData/42220/getCollateralQuote.json";
import getCurrentDebt42220 from "@/contractsData/42220/getCurrentDebt.json";
import getFactoryData42220 from "@/contractsData/42220/getFactoryData.json";
import getFinance42220 from "@/contractsData/42220/getFinance.json";
import getPoints42220 from "@/contractsData/42220/getPoints.json";
import getPoolData42220 from "@/contractsData/42220/getPoolData.json";
import getProviders42220 from "@/contractsData/42220/getProviders.json";
import getSupportedAssets42220 from "@/contractsData/42220/getSupportedAssets.json";
import liquidate42220 from "@/contractsData/42220/liquidate.json";
import lockToken42220 from "@/contractsData/42220/lockToken.json";
import panicUnlock42220 from "@/contractsData/42220/panicUnlock.json";
import payback42220 from "@/contractsData/42220/payback.json";
import provideLiquidity42220 from "@/contractsData/42220/provideLiquidity.json";
import registerToEarnPoints42220 from "@/contractsData/42220/registerToEarnPoints.json";
import removeLiquidity42220 from "@/contractsData/42220/removeLiquidity.json";
import setBaseToken42220 from "@/contractsData/42220/lockToken.json";
import setCollateralToken42220 from "@/contractsData/42220/setCollateralToken.json";
import symbol42220 from "@/contractsData/42220/symbol.json";
import transferFrom42220 from "@/contractsData/42220/transferFrom.json";
import unlockToken42220 from "@/contractsData/42220/unlockToken.json";
import isVerified42220 from "@/contractsData/42220/isVerified.json";
import getVerificationStatus42220 from "@/contractsData/42220/getVerificationStatus.json";
import setVerification42220 from "@/contractsData/42220/setVerification.json";

// Global data import
import globalData from "@/contractsData/global.json";

const { chainIds, approvedFunctions } = globalData;

const steps = [
    [
        { key: 'allowance', value: { ...allowance44787} },
        { key: 'approve', value: { ...approve44787} },
        { key: 'balanceOf', value: { ...balanceOf44787} },
        { key: 'borrow', value: { ...borrow44787} },
        { key: 'claimTestTokens', value: { ...claimTestTokens44787} },
        { key: 'closePool', value: { ...closePool44787} },
        { key: 'contribute', value: { ...contribute44787} },
        { key: 'createPool', value: { ...createPool44787} },
        { key: 'deposit', value: { ...deposit44787} },
        { key: 'getDeposit', value: { ...getDeposit44787} },
        { key: 'getCollateralQuote', value: { ...getCollateralQuote44787} },
        { key: 'getCurrentDebt', value: { ...getCurrentDebt44787} },
        { key: 'getFactoryData', value: { ...getFactoryData44787} },
        { key: 'getFinance', value: { ...getFinance44787} },
        { key: 'getPoints', value: { ...getPoints44787} },
        { key: 'getPoolData', value: { ...getPoolData44787} },
        { key: 'getProviders', value: { ...getProviders44787} },
        { key: 'getSupportedAssets', value: { ...getSupportedAssets44787} },
        { key: 'liquidate', value: { ...liquidate44787} },
        { key: 'lockToken', value: { ...lockToken44787} },
        { key: 'panicUnlock', value: { ...panicUnlock44787} },
        { key: 'payback', value: { ...payback44787} },
        { key: 'provideLiquidity', value: { ...provideLiquidity44787} },
        { key: 'registerToEarnPoints', value: { ...registerToEarnPoints44787} },
        { key: 'removeLiquidity', value: { ...removeLiquidity44787} },
        { key: 'setBaseToken', value: { ...setBaseToken44787} },
        { key: 'setCollateralToken', value: { ...setCollateralToken44787} },
        { key: 'symbol', value: { ...symbol44787} },
        { key: 'transferFrom', value: { ...transferFrom44787} },
        { key: 'unlockToken', value: { ...unlockToken44787} },
        { key: 'isVerified', value: { ...isVerified44787} },
        { key: 'getVerificationStatus', value: { ...getVerificationStatus44787} },
        { key: 'setVerification', value: { ...setVerification44787} },
    ],
    [],
    [
        { key: 'allowance', value: { ...allowance42220} },
        { key: 'approve', value: { ...approve42220} },
        { key: 'balanceOf', value: { ...balanceOf42220} },
        { key: 'borrow', value: { ...borrow42220} },
        { key: 'claimTestTokens', value: { ...claimTestTokens42220} },
        { key: 'closePool', value: { ...closePool42220} },
        { key: 'contribute', value: { ...contribute42220} },
        { key: 'createPool', value: { ...createPool42220} },
        { key: 'deposit', value: { ...deposit42220} },
        { key: 'getDeposit', value: { ...getDeposit42220} },
        { key: 'getCollateralQuote', value: { ...getCollateralQuote42220} },
        { key: 'getCurrentDebt', value: { ...getCurrentDebt42220} },
        { key: 'getFactoryData', value: { ...getFactoryData42220} },
        { key: 'getFinance', value: { ...getFinance42220} },
        { key: 'getPoints', value: { ...getPoints42220} },
        { key: 'getPoolData', value: { ...getPoolData42220} },
        { key: 'getProviders', value: { ...getProviders42220} },
        { key: 'getSupportedAssets', value: { ...getSupportedAssets42220} },
        { key: 'liquidate', value: { ...liquidate42220} },
        { key: 'lockToken', value: { ...lockToken42220} },
        { key: 'panicUnlock', value: { ...panicUnlock42220} },
        { key: 'payback', value: { ...payback42220} },
        { key: 'provideLiquidity', value: { ...provideLiquidity42220} },
        { key: 'registerToEarnPoints', value: { ...registerToEarnPoints42220} },
        { key: 'removeLiquidity', value: { ...removeLiquidity42220} },
        { key: 'setBaseToken', value: { ...setBaseToken42220} },
        { key: 'setCollateralToken', value: { ...setCollateralToken42220} },
        { key: 'symbol', value: { ...symbol42220} },
        { key: 'transferFrom', value: { ...transferFrom42220} },
        { key: 'unlockToken', value: { ...unlockToken42220} },
        { key: 'isVerified', value: { ...isVerified42220} },
        { key: 'getVerificationStatus', value: { ...getVerificationStatus42220} },
        { key: 'setVerification', value: { ...setVerification42220} },
    ],
    []
];

/**
 * @dev Fetch contract data related to a specific chain and function. By default it fetches data for celo mainnet if
 * no chainId is provided.
 * @param functionName : Function name
 * @param chainId : Connected chainId
 * @returns Contract data
 */
export const getStepData = (functionName: string, chainId: number | undefined) => {
    let chain = chainIds[0];
    if(!approvedFunctions.includes(functionName)) {
        throw new Error(`${functionName} not supported`);
    }
    if(chainId && chainIds.includes(chainId)) chain = chainId; 
    const chainIndex = chainIds.indexOf(chain);
    const found = steps[chainIndex].filter(q => q.key.toLowerCase() === functionName.toLowerCase());
    return found?.[0].value; 
}