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

const { approvedFunctions } = globalData;

const steps = [
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
    ]
];

/**
 * @dev Fetch contract data related to a specific chain and function. By default it fetches data for celo mainnet if
 * no chainId is provided.
 * @param functionName : Function name
 * @param chainId : Connected chainId
 * @returns Contract data
 */
export const getStepData = (functionName: string) => {
    if(!approvedFunctions.includes(functionName)) {
        throw new Error(`${functionName} not supported`);
    }
    const found = steps[0].filter(q => q.key.toLowerCase() === functionName.toLowerCase());
    return found?.[0].value; 
}