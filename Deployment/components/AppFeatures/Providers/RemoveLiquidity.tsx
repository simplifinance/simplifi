import { Button } from "@/components/ui/button";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, } from "@/utilities";
import { Confirmation } from "../FlexPool/update/ActionButton/Confirmation";
import { HandleTransactionParam } from "@/interfaces";

export default function RemoveLiquidity() {
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);

    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const transactionArgs : HandleTransactionParam = {
        commonParam: {account, config, unit: 0n,},
    }

    return(
        <div>
            <Button onClick={() => setOpenDrawer(1)} className="text-orange-200" variant={'outline'}>X</Button>
            <Confirmation 
                functionName='removeLiquidity'
                args={[]}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                transactionArgs={transactionArgs}
            />
        </div>
    )
}
