import Safe from "@safe-global/protocol-kit";
import { MetaTransactionData, OperationType } from "@safe-global/types-kit";

/**
 * @dev Create and return safe transaction 
 * @param param0 : Transaction parameter
 * @returns : Safe transaction
 */
const createSafeTransaction = async({to, data, value, operation, kit} : {to: string, data: string, value: string, operation: OperationType, kit: Safe}) => {
    const transactions : MetaTransactionData[] = [{
        to,
        data,
        value,
        operation
    }];
    return await kit.createTransaction({transactions});
}