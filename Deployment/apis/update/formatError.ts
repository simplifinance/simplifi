import { WriteContractErrorType } from "wagmi/actions";

export const formatError = (e: any) : string => {
    const error = e as WriteContractErrorType;
    return error.message?.length > 120? error.message.substring(0, 120) : error.message;
}

export const errorMessage = (error: any) => {
    return (`This transaction will likely fail! Reason: ${formatError({error})}`)
}

// const filteredMessage = defaultErrors({...rest}).filter(({key,}) => errorMessage?.match(key));
// if(filteredMessage.length && filteredMessage.length > 0) return filteredMessage[0].value();
// return errorMessage?.length > 100? errorMessage.substring(0, 100) : errorMessage;