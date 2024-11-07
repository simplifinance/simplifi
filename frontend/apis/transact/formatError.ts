export const formatError = (error: any) : string => {
    const errorMessage : string = error?.message || error?.data?.message;
    return errorMessage.length > 100? errorMessage.substring(0, 100) : errorMessage;
}
