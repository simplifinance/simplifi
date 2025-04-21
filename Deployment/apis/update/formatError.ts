/**
 * @dev Handle and format reverting errors
 * @param args : Arguments of type DefaultErrorArgs.
 * @returns : object containing formatted error
*/
function defaultErrors(arg: DefaultErrorArgs) {
    const { duration, amount } = arg;

    return [
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
            key: 'Amount exist',
            value: () => `Liquidity amount of ${amount} cannot exist twice in a permissionless flexpool. Consider operating it in a permissioned setting or wait until the quorum for the existing amount is completed`
        },
        {
            key: 'Adding User to strategy failed',
            value: () => 'Adding User to strategy failed'
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
            value: () => `You're not a contributor of this pool`
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
            value: () => 'This pool is yet to achieve the required contributor'
        },
        {
            key: 'Turn time has not passed',
            value: () => 'Cannot override expected user because the grace period has not lapse'
        },
        {
            key: 'Insufficient Collateral',
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
            key: 'Pub: Cannot cancel',
            value: () => 'Cannot cancel pool at this time'
        },
        {
            key: 'Priv: Cannot cancel',
            value: () => 'Cannot cancel pool at this time'
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
    amount?: string;
    unit?: string;
    duration?: string;
}

export interface FormatErrorArgs extends DefaultErrorArgs {
    error: any;
}