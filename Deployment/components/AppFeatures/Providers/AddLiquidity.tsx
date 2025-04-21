import { Button } from "@/components/ui/button";
import { flexStart,} from "@/constants";
import React from "react";
import { useAccount, useConfig } from "wagmi";
import { formatAddr, toBN } from "@/utilities";
import { parseEther, } from "viem";
import { Confirmation } from "../FlexPool/update/ActionButton/Confirmation";
import UnitLiquidity from "../FlexPool/Create/forms/userInputsComponents/UnitLiquidity";
import Interest from "../FlexPool/Create/forms/userInputsComponents/Interest";
import { CommonParam, HandleTransactionParam, VoidFunc } from "@/interfaces";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";

export default function AddLiquidity({back} : {back: VoidFunc}) {
    const [ unitLiquidity, setUnitLiquidity ] = React.useState<string>('0');
    const [ rate, setRate ] = React.useState<string>('0');
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);

    const account = formatAddr(useAccount().address);
    const config = useConfig();
    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const commonParam : CommonParam = { account, config, unit: parseEther(unitLiquidity)}
    const transactionArgs : HandleTransactionParam = {
        commonParam,
        txnType: 'ProvideLiquidity',
        rate: toBN(rate).times(toBN(100)).toNumber()
    }

    return(
        <MotionDivWrap className="space-y-4">
            <Interest handleChange={(arg) => setRate(arg)} selected={rate}/>
            <UnitLiquidity handleChange={(arg) => setUnitLiquidity(arg)} selected={unitLiquidity}/>
            <div className={`${flexStart} gap-2`}>
                <Button variant={'outline'} onClick={back} className="">Cancel</Button>
                <Button onClick={() => setOpenDrawer(1)}>Submit</Button>
            </div>
            <Confirmation 
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                back={back}
                transactionArgs={transactionArgs}
            />
        </MotionDivWrap>
    )
}
