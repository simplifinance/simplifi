export const formatError = (error: any) : string => {
    const errorMessage = error?.message || error?.data.message || error;
    console.log("ErrorMEssage", errorMessage)
    return errorMessage > 120? errorMessage.substring(0, 120) : errorMessage;
}

export const errorMessage = (error: any) => {
    return (`This transaction will likely fail! Reason: ${formatError({error})}`)
}
