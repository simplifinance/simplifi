function defaultErrors(arg: DefaultErrorArgs) {
    const { duration, epochId, maxEpochDuration, durationInSec, amount } = arg;

    return [
        {
            key: 'Col coverage is too low',
            value: () => `Amount sent as collateral was rejected! Reason: Too low`
        },
        {
            key: 'Invalid duration',
            value: () => {
                let returnError = '';
                if(durationInSec) {
                    const dayInSec = 86400;
                    const minDurInSec = 3600;
                    const maxDurInSec = 30 * dayInSec;
                    if(durationInSec > maxDurInSec) returnError = `${duration} given as duration exceeds max of 30days/720hrs or epoch's set at ${maxEpochDuration}`;
                    else if(durationInSec < minDurInSec) returnError = 'Duration given is less than minimum of 1hr';
                    else returnError = 'Duration given is invalid'; 
                }
                return returnError;
            }
        },
        {
            key: 'Insufficient allowance',
            value: () => `Amount given as spending cap was rejected! Reason: Too low`
        },
        {
            key: 'User denied transaction signature',
            value: () => `You have rejected this transaction`
        },
        {
            key: 'Transfer failed',
            value: () => `Transfer operation was not successful`
        },
        {
            key: 'Admin spotted twice',
            value: () => `An operator cannot operate more than one position in a pool`
        },
        {
            key: 'Amount exist',
            value: () => `Liquidity amount of ${amount} cannot exist twice in a permissionless flexpool. Consider operating it in a permissioned setting or wait until the quorum for the existing amount is completed`
        },
        {
            key: 'Adding User to strategy failed',
            value: () => 'Adding User to strategy failed'
        },
        {
            key: 'Epoch Id has not begin',
            value: () => `Epoch ${epochId} is invalid`
        },
        {
            key: 'Add Liquidity not ready',
            value: () => `Cannot add liquidity at this time`
        },
        {
            key: 'Admin cannot liquidate',
            value: () => `An admin/operator cannot liquidate a member in this pool`
        },
        {
            key: 'Not a member',
            value: () => `You're not a member in flexpool id ${epochId}`
        },
        {
            key: 'Not permitted',
            value: () => 'User not permitted'
        },
        {
            key: 'Borrow not ready',
            value: () => 'Getting finance not activated'
        },
        {
            key: 'Pool not complete',
            value: () => 'This pool is yet to achieve the required participants yet'
        },
        {
            key: 'Turn time has not passed',
            value: () => 'Cannot override expected user because the grace period has not lapse'
        },
        {
            key: 'Insufficient Collateral in XFI',
            value: () => `Collateral too low. Please set a higher value`
        },
        {
            key: 'Payback not ready',
            value: () => `Payback stage not ready`
        },
        {
            key: 'No debt',
            value: () => 'User has no debt to service'
        },
        {
            key: 'Not defaulter',
            value: () => 'No defaulter yet'
        },
        {
            key: 'FactoryLib - Pub: Cannot cancel',
            value: () => 'Cannot cancel pool at this time'
        },
        {
            key: 'FactoryLib - Priv: Cannot cancel',
            value: () => 'Cannot cancel pool at this time'
        },
        {
            key: 'FactoryLib: Only admin',
            value: () => 'Only admin/operator is permitted'
        },
        {
            key: 'Withdrawal failed',
            value: () => 'Withdrawal failed'
        },
        {
            key: 'Insufficient XFI',
            value: () => 'XFI not enough'
        },
        {
            key: 'Utils: FullDur or DurOfChoice oerflow',
            value: () => 'Invalid duration given'
        },
        {
            key: 'FuncHandler: No Permission detected',
            value: () => 'No Permission detected'
        },
        {
            key: 'Trxn failed with HTTP request failed',
            value: () => 'Please check your internet connection'
        },
        {
            key: 'HTTP request failed',
            value: () => 'Cannot reach destination. Please check your internet connection'
        },
        {
            key: 'The request took too long to respond',
            value: () => 'Cannot complete request. Please check your internet connection'
        },
        {
            key: '0xb8bd6758',
            value: () => 'Invalid contribution amount'
        },
    ]
}

export const formatError = (arg: FormatErrorArgs) : string => {
    const { error, ...rest } = arg;
    const errorMessage : any = error?.message || error?.data?.message || error;
    // console.log("error", error);
    // console.log("ErrorHEre", errorMessage);
    const filteredMessage = defaultErrors({...rest}).filter(({key,}) => errorMessage?.match(key));
    if(filteredMessage.length && filteredMessage.length > 0) return filteredMessage[0].value();
    return errorMessage?.length > 100? errorMessage.substring(0, 100) : errorMessage;
}

export const errorMessage = (error: any) => {
    return (`This transaction will likely fail! Reason: ${formatError({error})}`)
}

interface DefaultErrorArgs {
    durationInSec?: number;
    amount?: string;
    epochId?: string;
    duration?: string;
    maxEpochDuration?: string;
}

export interface FormatErrorArgs extends DefaultErrorArgs {
    error: any;
}