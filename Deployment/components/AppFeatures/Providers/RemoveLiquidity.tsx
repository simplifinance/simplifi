import { Button } from "@/components/ui/button";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, } from "@/utilities";
import { zeroAddress } from "viem";
import { Confirmation } from "../FlexPool/update/ActionButton/Confirmation";
import { HandleTransactionParam } from "@/interfaces";

export default function RemoveLiquidity() {
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);

    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account, config, contractAddress: zeroAddress, unit: 0n,},
        txnType: 'RemoveLiquidity',
    }

    return(
        <div>
            <Button onClick={() => setOpenDrawer(1)} variant={'outline'}>Remove</Button>
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
            />
        </div>
    )
}
