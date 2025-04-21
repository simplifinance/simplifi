import getReadFunctions from "@/components/AppFeatures/FlexPool/update/DrawerWrapper/readContractConfig";
import { formatAddr } from "@/utilities";
import React from "react";
import { useAccount, useReadContract } from "wagmi";
import Grid from "@mui/material/Grid";
import AddressWrapper from "@/components/utilities/AddressFormatter/AddressWrapper";

export default function Leaderboard() {
    const { chainId, address } = useAccount();
    const { getPointsConfig } = getReadFunctions({chainId})
    const { data, } = useReadContract({
        ...getPointsConfig(),
        query: {refetchInterval: 5000},
    });

    return(
        <div>
            {/* Header */}
            <div className="grid grid-cols-3 w-full max-w-sm text-sm p-4 bg-green1/90 text-white1 font-bold rounded-lg">
                <h3>Ids</h3>
                <h3>As creator</h3>
                <h3 className="text-end">As contributor</h3>
            </div>
            {
                data?.map(({contributor, creator, user}) => (
                    <div className="grid grid-cols-3 w-full max-w-sm text-sm p-4 text-white1 font-bold rounded-lg">
                        <div>
                            <AddressWrapper account={user} size={3} display={false} />
                        </div>
                        <h3>{ creator.toString() }</h3>
                        <h3>{ contributor.toString() }</h3>                        
                    </div>
                ))
            }
        </div>
    )
}