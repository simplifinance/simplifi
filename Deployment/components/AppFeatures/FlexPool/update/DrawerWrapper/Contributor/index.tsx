import React from "react";
import { ProviderProps } from "@/interfaces";
import { flexSpread } from "@/constants";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";
import Collapse from "@mui/material/Collapse";
import { Chevron } from "@/components/utilities/Icons";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { Button } from "@/components/ui/button";
import useAppStorage from "@/components/contexts/StateContextProvider/useAppStorage";

export const Contributor = ({ data }: ProviderProps) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const [showExternalProviders, setShowExternalProviders] = React.useState<boolean>(false);
    const handleCollapse = () => setOpen(!open);
    const toggleShowProviders = () => setShowExternalProviders(!showExternalProviders);
    const { chainId } = useAccount();
    const { symbol } = useAppStorage();

    const { 
        profile: {
            getFinanceTime,
            id,
            colBals,
            loan,
            paybackTime,
            sentQuota,
            turnStartTime
        },
        slot: { value, isAdmin },
        providers
    } = data;

    return(
        <div >
            <Button variant={'ghost'} onClick={handleCollapse} className={`w-full ${flexSpread} text-green1/70 dark:text-white1 hover:text-orange-200 focus:font-semibold text-lg`}>
                <h3>{`Contributor. ${value + 1}`}</h3>
                <Chevron open={open} />
            </Button>
            <Collapse in={open} timeout="auto" unmountOnExit className={'w-full bg-geen1/70 p-4 dark:text-white1 max-h-[350px] overflow-auto'}>
                <ul className="w-full space-y-2 relative">
                    <li className={`${flexSpread} underline underline-offset-4`}>
                        <h3 className="text-center font-bold md:text-lg ">Identifier</h3>
                        <AddressWrapper size={3} account={id.toString()} display overrideClassName="md:text-lg" copyIconSize="4"/>
                        <h3 className="absolute right-[40%]">
                            { adminBadge(isAdmin) }
                        </h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Time Until GetFinance</h3>
                        <h3 className="text-end">{turnStartTime.inDate}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Get Finance time</h3>
                        <h3 className="text-end">{getFinanceTime.inDate}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Contributed</h3>
                        <h3>{sentQuota? 'Yes' : 'No'}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>Gross Debt Bal</h3>
                        <h3>{`${loan.inEther} USD`}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>{'Max. Date To Payback'}</h3>
                        <h3 className="text-end">{paybackTime.inDate}</h3>
                    </li>
                    <li className={`${flexSpread}`}>
                        <h3>{"Col-Bal"}</h3>
                        <h3>{`${parseEther(colBals)} ${symbol}`}</h3>
                    </li>
                    <Button variant={'outline'} onClick={toggleShowProviders} className={`w-full ${flexSpread} dark:text-orange-300 p-6 hover:text-orange-300 `}>
                        <h3>{(providers && providers.length > 0)? "External providers" : "No external fund providers"}</h3>
                        <Chevron open={showExternalProviders} />
                    </Button>
                    <Collapse in={showExternalProviders} timeout="auto" unmountOnExit className={'w-full bg-white2/70 dark:bg-green1/50 dakr:text-white1'}>
                        <div className="space-y-4">
                            {
                                (providers && providers.length > 0) && providers.map((provider, index) => (
                                    <ul className="border p-4 rounded-lg" key={index}>
                                        <li className={`font-bold text-md text-green1/90 dark:text-white1 pb-4`}>
                                            Provider {index + 1}
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>Loan amount</h3>
                                            <h3>{`${provider.amount} usd`}</h3>
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Expected interest/sec"}</h3>
                                            <h3>{`${provider.accruals.intPerSec} usd`}</h3>
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Expected full interest"}</h3>
                                            <h3>{`${provider.accruals.fullInterest} usd`}</h3>
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Start date"}</h3>
                                            <h3>{provider.earnStartDate.inDate}</h3>
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Provider rate"}</h3>
                                            <h3>{`${provider.rate}%`}</h3>
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Provider Id"}</h3>
                                            <AddressWrapper
                                                account={provider.account}
                                                size={4}
                                                display={true}
                                            />
                                        </li>
                                        <li className={`${flexSpread}`}>
                                            <h3>{"Provider' slot"}</h3>
                                            <h3>{provider.slot}</h3>
                                        </li>
                                    </ul>
                                ))
                            }
                        </div>
                    </Collapse>
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
