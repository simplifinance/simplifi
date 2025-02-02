import React from "react";
import { FormattedData } from "@/interfaces";
import { flexSpread } from "@/constants";
import AddressWrapper from "@/components/AddressFormatter/AddressWrapper";
import Collapse from "@mui/material/Collapse";
import { Chevron } from "@/components/Collapsible";
import { getContractData } from "@/apis/utils/getContractData";
import { useAccount } from "wagmi";

export const Provider = ({ formattedData, index, isAdmin }: ProviderProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const handleCollapse = () => setOpen(!open);
    const { chainId } = useAccount();
    const { currency } = getContractData(chainId || 4157);

    const { 
        // isAdmin, 
        sentQuota,
        id_toString, 
        loan_InEther,
        // slot_toNumber, 
        colBals_InEther,
        durOfChoice_InSec,
        expInterest_InEther,
        payDate_InDateFormat,
        turnTime_InDateFormat,
    } = formattedData;

    return(
        <div >
            <button onClick={handleCollapse} className={`w-full ${flexSpread} text-orange-300 p-1 text-xs uppercase hover:text-orange-300 focus:font-semibold`}>
                <h3>{`Prov. ${index + 1}`}</h3>
                <Chevron open={open} />
            </button>
            <Collapse in={open} timeout="auto" unmountOnExit className={'w-full bg-gray1 p-4 text-orange-200'}>
                <ul className="w-full space-y-2 text-xs relative">
                    <li className={`${flexSpread} underline underline-offset-4`}>
                        <h3 className="text-center font-bold text-sm md:text-md">Address</h3>
                        <AddressWrapper size={3} account={id_toString} display overrideClassName="text-sm" copyIconSize="4"/>
                        <h3 className="absolute right-[40%]">
                            { adminBadge(isAdmin) }
                        </h3>
                    </li>
                    {/* <li className={`${flexSpread}`}>
                        <h3>Slot</h3>
                        <h3>{ slot_toNumber }</h3>
                    </li> */}
                    <li className={`${flexSpread}`}>
                        <h3>Time Until GetFinance</h3>
                        <h3 className="text-end">{turnTime_InDateFormat}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Has Sent Quota</h3>
                        <h3>{sentQuota? 'Yes' : 'No'}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Duration Choice</h3>
                        <h3>{durOfChoice_InSec > 0? durOfChoice_InSec / 3600 : 0}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Loan Bal</h3>
                        <h3>{`${loan_InEther} USDT`}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>{'Max. Date To Payback'}</h3>
                        <h3 className="text-end">{ payDate_InDateFormat }</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>{"Col-Bal"}</h3>
                        <h3>{`${colBals_InEther} ${currency}`}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Interest Accrued</h3>
                        <h3>{`${expInterest_InEther} ${currency}`}</h3>
                    </li>
                </ul>
            </Collapse>
        </div>
    );
}

const adminBadge = (isAdmin: boolean) => {
    return(
        <span hidden={!isAdmin} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="#F87C00" viewBox="0 0 20 20" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
        </span>
    );
};

interface ProviderProps {
    formattedData: FormattedData;
    index: number;
    isAdmin: boolean;
}