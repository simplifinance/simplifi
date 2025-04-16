import React from "react";
import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import { formatAddr } from "@/utilities";
import { useAccount, useReadContract } from "wagmi";
import Grid from "@mui/material/Grid";

export default function RewardsAndPoints() {
    const { chainId, address } = useAccount();
    const account = formatAddr(address);
    const { getPointConfig } = getReadFunctions({chainId})
    const { data, } = useReadContract({
        ...getPointConfig(account),
        query: {refetchInterval: 5000},
    });

    return(
        <div className="space-y-4 text-center text-2xl font-semibold">
            <div>
                <h3 className="text-5xl font-bold">{data?.creator.toString() || '0'}</h3>
                <h3>Creator reward</h3>
            </div>
            <div>
                <h3 className="text-5xl font-bold">{data?.contributor.toString() || '0'}</h3>
                <h3>Contributor reward</h3>
            </div>
            <div>
                <h3 className="text-5xl font-bold">{data?.referrals.toString() || '0'}</h3>
                <h3>Referrals</h3>
            </div>
        </div>
    )
}