import { Button } from "@/components/ui/button";
import { flexStart,} from "@/constants";
import React from "react";
import { toBN } from "@/utilities";
import { parseEther, } from "viem";
import UnitLiquidity from "../FlexPool/Create/forms/userInputsComponents/UnitLiquidity";
import Interest from "../FlexPool/Create/forms/userInputsComponents/Interest";
import { VoidFunc } from "@/interfaces";
import { MotionDivWrap } from "@/components/utilities/MotionDivWrap";
import ProvideLiquidity from "../FlexPool/update/transactions/ProvideLiquidity";

export default function AddLiquidity() {
    const [ unitLiquidity, setUnitLiquidity ] = React.useState<string>('0');
    const [ rate, setRate ] = React.useState<string>('0');
    const [ openDrawer, setOpenDrawer ] = React.useState<number>(0);

    const toggleDrawer = (arg: number) => setOpenDrawer(arg);
    const args = [toBN(rate).times(toBN(100)).toNumber()];

    return(
        <MotionDivWrap className="space-y-4">
            <Interest handleChange={(arg) => setRate(arg)} selected={rate}/>
            <UnitLiquidity handleChange={(arg) => setUnitLiquidity(arg)} selected={unitLiquidity}/>
            <Button onClick={() => setOpenDrawer(1)}>Submit</Button>
            <ProvideLiquidity 
                args={args}
                liquidityAmount={parseEther(unitLiquidity)}
                openDrawer={openDrawer}
                toggleDrawer={toggleDrawer}
                // back={back}
            />
        </MotionDivWrap>
    )
}
