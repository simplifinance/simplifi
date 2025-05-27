import allowance from "@/contractsData/allowance.json";
import approve from "@/contractsData/approve.json";
import balanceOf from "@/contractsData/balanceOf.json";
import borrow from "@/contractsData/borrow.json";
import claimTestTokens from "@/contractsData/claimTestTokens.json";
import closePool from "@/contractsData/closePool.json";
import contribute from "@/contractsData/contribute.json";
import createPool from "@/contractsData/createPool.json";
import deposit from "@/contractsData/deposit.json";
import deposits from "@/contractsData/deposits.json";
import getCollateralQuote from "@/contractsData/getCollateralQuote.json";
import getCurrentDebt from "@/contractsData/getCurrentDebt.json";
import getFactoryData from "@/contractsData/getFactoryData.json";
import getFinance from "@/contractsData/getFinance.json";
import getPoints from "@/contractsData/getPoints.json";
import getPoolData from "@/contractsData/getPoolData.json";
import getPoolRecord from "@/contractsData/getPoolRecord.json";
import getProviders from "@/contractsData/getProviders.json";
import getSupportedAssets from "@/contractsData/getSupportedAssets.json";
import liquidate from "@/contractsData/liquidate.json";
import lockToken from "@/contractsData/lockToken.json";
import panicUnlock from "@/contractsData/panicUnlock.json";
import payback from "@/contractsData/payback.json";
import provideLiquidity from "@/contractsData/provideLiquidity.json";
import registerToEarnPoints from "@/contractsData/registerToEarnPoints.json";
import removeLiquidity from "@/contractsData/removeLiquidity.json";
import setBaseToken from "@/contractsData/lockToken.json";
import setCollateralToken from "@/contractsData/setCollateralToken.json";
import symbol from "@/contractsData/symbol.json";
import transferFrom from "@/contractsData/transferFrom.json";
import unlockToken from "@/contractsData/unlockToken.json";

const steps = [
    { key: 'allowance', value: { ...allowance} },
    { key: 'approve', value: { ...approve} },
    { key: 'balanceOf', value: { ...balanceOf } },
    { key: 'borrow', value: { ...borrow } },
    { key: 'claimTestTokens', value: { ...claimTestTokens } },
    { key: 'closePool', value: { ...closePool } },
    { key: 'contribute', value: { ...contribute } },
    { key: 'createPool', value: { ...createPool } },
    { key: 'deposit', value: { ...deposit } },
    { key: 'deposits', value: { ...deposits } },
    { key: 'getCollateralQuote', value: { ...getCollateralQuote } },
    { key: 'getCurrentDebt', value: { ...getCurrentDebt } },
    { key: 'getFactoryData', value: { ...getFactoryData } },
    { key: 'getFinance', value: { ...getFinance } },
    { key: 'getPoints', value: { ...getPoints } },
    { key: 'getPoolData', value: { ...getPoolData } },
    { key: 'getPoolRecord', value: { ...getPoolRecord } },
    { key: 'getProviders', value: { ...getProviders } },
    { key: 'getSupportedAssets', value: { ...getSupportedAssets } },
    { key: 'liquidate', value: { ...liquidate } },
    { key: 'lockToken', value: { ...lockToken } },
    { key: 'panicUnlock', value: { ...panicUnlock } },
    { key: 'payback', value: { ...payback } },
    { key: 'provideLiquidity', value: { ...provideLiquidity } },
    { key: 'registerToEarnPoints', value: { ...registerToEarnPoints } },
    { key: 'removeLiquidity', value: { ...removeLiquidity } },
    { key: 'setBaseToken', value: { ...setBaseToken } },
    { key: 'setCollateralToken', value: { ...setCollateralToken } },
    { key: 'symbol', value: { ...symbol } },
    { key: 'transferFrom', value: { ...transferFrom } },
    { key: 'unlockToken', value: { ...unlockToken } }
];

export const getStepData = (functionName: string) => {
    const filtered = steps.filter(({key}) => key === functionName);
    return filtered[0].value;
}