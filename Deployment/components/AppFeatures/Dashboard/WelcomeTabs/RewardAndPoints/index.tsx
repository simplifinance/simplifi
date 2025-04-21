import React from "react";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import { formatAddr } from "@/utilities";
import { useAccount, useReadContract } from "wagmi";
import { flexSpread } from "@/constants";

export default function RewardsAndPoints() {
    const { chainId, address } = useAccount();
    const account = formatAddr(address);
    const { getPointConfig } = getReadFunctions({chainId})
    const { data, } = useReadContract({
        ...getPointConfig(account),
        query: {refetchInterval: 5000},
    });

    return(
        <div className="space-y-4 text-center text-lg font-semibold">
            <div className={`${flexSpread} dark:bg-green1/90 border border-green1/30 rounded-lg p-4 text-green1/80`}>
                <h3>Creator reward</h3>
                <h3 className="text-5xl font-bold">{data?.creator.toString() || '0'}</h3>
            </div>
            <div className={`${flexSpread} dark:bg-green1/90 border border-green1/30 rounded-lg p-4 text-green1/80`}>
                <h3>Contributor reward</h3>
                <h3 className="text-5xl font-bold">{data?.contributor.toString() || '0'}</h3>
            </div>
            <div className={`${flexSpread} dark:bg-green1/90 border border-green1/30 rounded-lg p-4 text-green1/80`}>
                <h3>Referrals</h3>
                <h3 className="text-5xl font-bold">{data?.referrals.toString() || '0'}</h3>
            </div>
            <div className={`${flexSpread} rounded-lg p-4 border-double border-green1/30 text-green1/70 dark:text-white1`}>
                <h3>Total Points</h3>
                <h3 className="text-5xl font-bold">{((data?.creator || 0n) + (data?.contributor || 0n) + (data?.referrals || 0n)).toString()}</h3>
            </div>
        </div>
    )
}